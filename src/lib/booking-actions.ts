import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------------- shared validators ----------------
const createBookingInput = z.object({
  tour_id: z.string().uuid(),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  adults: z.number().int().min(1).max(40),
  children: z.number().int().min(0).max(40),
  guest_name: z.string().trim().min(2).max(120),
  guest_email: z.string().trim().email().max(200),
  guest_phone: z.string().trim().min(5).max(40),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  pay_now: z.boolean().optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingInput>;

function getOrigin(): string {
  try {
    const req = getRequest();
    const h = req?.headers;
    const origin = h?.get("origin");
    if (origin) return origin;
    const proto = h?.get("x-forwarded-proto") || "https";
    const host = h?.get("host");
    if (host) return `${proto}://${host}`;
  } catch {
    /* noop */
  }
  return process.env.SITE_URL || "https://tripscapetourism.com";
}

// ---------------- create booking (public) ----------------
// Server-authoritative: the create_booking RPC recomputes the price from the
// tours table and atomically locks availability, so a tampered client total or
// a sold-out date cannot get through. Returns a Stripe checkout URL when the
// guest chose to pay now and Stripe is configured.
export const createBookingFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => createBookingInput.parse(d))
  .handler(async ({ data }) => {
    const { supabasePublic } = await import("@/lib/server/supabase-public.server");

    const { data: booking, error } = await supabasePublic.rpc("create_booking", {
      p_tour_id: data.tour_id,
      p_guest_name: data.guest_name,
      p_guest_email: data.guest_email,
      p_guest_phone: data.guest_phone,
      p_date: data.booking_date,
      p_adults: data.adults,
      p_children: data.children,
      p_notes: data.notes || undefined,
      p_user_id: undefined,
    });

    if (error || !booking) {
      // RPC RAISE messages are already guest-friendly.
      throw new Error(error?.message || "We couldn't create your booking. Please try again.");
    }
    const b = booking as unknown as {
      id: string;
      reference_code: string;
      guest_email: string;
      total_amount: number;
      currency: string;
      adults: number;
      children: number;
      tour_id: string;
    };

    // Pay now → Stripe Checkout (only if configured)
    if (data.pay_now) {
      const { stripeConfigured, createBookingCheckoutSession } =
        await import("@/lib/server/stripe.server");
      if (stripeConfigured()) {
        const { data: tour } = await supabasePublic
          .from("tours")
          .select("title, hero_image")
          .eq("id", b.tour_id)
          .maybeSingle();
        const session = await createBookingCheckoutSession(
          {
            id: b.id,
            reference_code: b.reference_code,
            guest_email: b.guest_email,
            total_amount: b.total_amount,
            currency: b.currency,
            adults: b.adults,
            children: b.children,
          },
          { title: tour?.title ?? "Tour", hero_image: tour?.hero_image ?? null },
          getOrigin(),
        );
        // Store the session id for reference. Non-fatal: the webhook resolves
        // the booking by metadata.booking_id, so this is just a convenience.
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("bookings")
            .update({ stripe_session_id: session.sessionId })
            .eq("id", b.id);
        } catch {
          /* non-fatal */
        }
        return {
          reference_code: b.reference_code,
          checkoutUrl: session.url,
          paymentRequired: true as const,
        };
      }
      // Stripe not configured — fall through to request flow so booking still works.
    }

    // Request flow (pay on confirmation) → send "received" emails now.
    // Best-effort: the booking is already saved, so never fail it on email.
    try {
      const { queueAndSendBookingEmails } = await import("@/lib/server/email.server");
      await queueAndSendBookingEmails(b.id);
    } catch {
      /* email is best-effort */
    }
    return { reference_code: b.reference_code, checkoutUrl: null, paymentRequired: false as const };
  });

// ---------------- update booking status (admin only) ----------------
const updateStatusInput = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export const updateBookingStatusFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => updateStatusInput.parse(d))
  .handler(async ({ data, context }) => {
    const { assertRole } = await import("@/lib/server/roles.server");
    await assertRole(context.userId, ["admin"]);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.bookingId);
    if (error) throw new Error(error.message);

    // Free the held seats when an admin cancels.
    if (data.status === "cancelled") {
      await supabaseAdmin.rpc("release_booking_seats", { p_booking_id: data.bookingId });
    }
    return { ok: true as const };
  });
