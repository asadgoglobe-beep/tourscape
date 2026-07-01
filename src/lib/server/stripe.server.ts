// Server-only. Stripe Checkout + webhook verification.
// Edge/Cloudflare compatible: uses the fetch HTTP client and the async
// webhook constructor (SubtleCrypto). Imported dynamically from handlers.
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  _stripe = new Stripe(key, {
    apiVersion: "2025-08-27.basil",
    httpClient: Stripe.createFetchHttpClient(),
  });
  return _stripe;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

type BookingLite = {
  id: string;
  reference_code: string;
  guest_email: string;
  total_amount: number;
  currency: string;
  adults: number;
  children: number;
};
type TourLite = { title: string; hero_image: string | null };

/** Create a hosted Stripe Checkout session for a booking. Returns the redirect URL. */
export async function createBookingCheckoutSession(
  booking: BookingLite,
  tour: TourLite,
  origin: string,
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const base = origin.replace(/\/$/, "");
  // Amount in the smallest currency unit. AED is a 2-decimal currency.
  const amountMinor = Math.round(Number(booking.total_amount) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.guest_email,
    client_reference_id: booking.reference_code,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: (booking.currency || "AED").toLowerCase(),
          unit_amount: amountMinor,
          product_data: {
            name: tour.title,
            description: `${booking.adults} adult(s)${booking.children ? ` + ${booking.children} child(ren)` : ""} · Ref ${booking.reference_code}`,
            ...(tour.hero_image ? { images: [tour.hero_image] } : {}),
          },
        },
      },
    ],
    metadata: { booking_id: booking.id, reference_code: booking.reference_code },
    success_url: `${base}/booking/success?ref=${encodeURIComponent(booking.reference_code)}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/booking/cancelled?ref=${encodeURIComponent(booking.reference_code)}`,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { url: session.url, sessionId: session.id };
}

/** Verify and parse a Stripe webhook payload (async for edge runtimes). */
export async function constructWebhookEvent(
  payload: string,
  signature: string,
): Promise<Stripe.Event> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  return stripe.webhooks.constructEventAsync(payload, signature, secret);
}
