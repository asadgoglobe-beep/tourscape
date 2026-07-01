import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Stripe posts here after a checkout. We verify the signature, then mark the
// booking paid + confirmed and fire the confirmation emails. No auth — trust
// comes from the Stripe signature (STRIPE_WEBHOOK_SECRET).
export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const payload = await request.text();

        let event;
        try {
          const { constructWebhookEvent } = await import("@/lib/server/stripe.server");
          event = await constructWebhookEvent(payload, signature);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Invalid payload";
          console.error("[stripe webhook] verification failed:", msg);
          return new Response(`Webhook Error: ${msg}`, { status: 400 });
        }

        try {
          if (event.type === "checkout.session.completed") {
            const session = event.data.object as {
              id: string;
              metadata?: { booking_id?: string };
              payment_status?: string;
            };
            const bookingId = session.metadata?.booking_id;

            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

            // Resolve the booking by metadata id, falling back to the session id.
            let id = bookingId;
            if (!id) {
              const { data } = await supabaseAdmin
                .from("bookings")
                .select("id")
                .eq("stripe_session_id", session.id)
                .maybeSingle();
              id = data?.id;
            }
            if (id) {
              await supabaseAdmin
                .from("bookings")
                .update({
                  payment_status: "paid",
                  status: "confirmed",
                  paid_at: new Date().toISOString(),
                  stripe_session_id: session.id,
                })
                .eq("id", id);

              const { queueAndSendBookingEmails } = await import("@/lib/server/email.server");
              await queueAndSendBookingEmails(id);
            }
          } else if (event.type === "checkout.session.expired") {
            // Guest abandoned a pay-now checkout — release the seats we held.
            const session = event.data.object as { id: string; metadata?: { booking_id?: string } };
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            let id = session.metadata?.booking_id;
            if (!id) {
              const { data } = await supabaseAdmin
                .from("bookings")
                .select("id")
                .eq("stripe_session_id", session.id)
                .maybeSingle();
              id = data?.id;
            }
            if (id) {
              await supabaseAdmin.rpc("release_booking_seats", { p_booking_id: id });
              await supabaseAdmin
                .from("bookings")
                .update({ payment_status: "failed" })
                .eq("id", id)
                .eq("payment_status", "unpaid");
            }
          }
        } catch (err) {
          // Acknowledge to avoid infinite Stripe retries, but log loudly.
          console.error("[stripe webhook] handler error:", err);
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
