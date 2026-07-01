// Server-only. Branded booking emails + Resend delivery + durable queue.
// Imported dynamically from server-fn handlers and the Stripe webhook so it
// never reaches the client bundle.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ---- config (env with safe defaults) ----
const FROM = process.env.EMAIL_FROM || "Tripscape Adventures <bookings@tripscapetourism.com>";
const ADMIN_TO = process.env.ADMIN_BOOKING_EMAIL || "bookings@tripscapetourism.com";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "bookings@tripscapetourism.com";
const WHATSAPP_BUSINESS = (process.env.WHATSAPP_NUMBER || "971549930684").replace(/[^0-9]/g, "");
const SITE_URL = (process.env.SITE_URL || "https://tripscapetourism.com").replace(/\/$/, "");

// ---- brand tokens (Tripscape) ----
const NAVY = "#101826";
const GOLD = "#BC8438";
const SAND = "#F4ECDE";
const WA_GREEN = "#25D366";

type BookingRow = {
  id: string;
  reference_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  booking_date: string;
  adults: number;
  children: number;
  total_amount: number;
  currency: string;
  notes: string | null;
  status: string;
  payment_status: string;
};
type TourRow = {
  title: string;
  location: string | null;
  duration: string | null;
  hero_image: string | null;
};

function waLink(number: string, text: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
}

function money(amount: number, currency: string) {
  return `${currency} ${Number(amount).toLocaleString("en-AE", { minimumFractionDigits: 0 })}`;
}

function paxLine(b: BookingRow) {
  const a = `${b.adults} adult${b.adults > 1 ? "s" : ""}`;
  const c = b.children > 0 ? ` · ${b.children} child${b.children > 1 ? "ren" : ""}` : "";
  return a + c;
}

function shell(title: string, bodyRows: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${SAND};font-family:Helvetica,Arial,sans-serif;color:#222">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${SAND};padding:24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(16,24,38,.10)">
  <tr><td style="background:${NAVY};padding:28px 32px">
    <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em">Tripscape</span>
    <span style="font-size:20px;font-weight:700;color:${GOLD}">Adventures</span>
  </td></tr>
  ${bodyRows}
  <tr><td style="background:${NAVY};padding:22px 32px;color:rgba(255,255,255,.65);font-size:12px;line-height:1.6">
    Tripscape Adventures · Licensed UAE tour operator · Business Bay, Dubai<br>
    <a href="tel:+971556595007" style="color:${GOLD};text-decoration:none">+971 55 659 5007</a> ·
    <a href="${SITE_URL}" style="color:${GOLD};text-decoration:none">tripscapetourism.com</a>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

function summaryTable(b: BookingRow, tour: TourRow) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;color:#6b6b6b;font-size:13px">${label}</td><td style="padding:8px 0;text-align:right;font-weight:600;color:${NAVY};font-size:13px">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;border-bottom:1px solid #eee;margin:8px 0 4px">
    ${row("Tour", tour.title)}
    ${tour.location ? row("Location", tour.location) : ""}
    ${row("Date", b.booking_date)}
    ${row("Guests", paxLine(b))}
    ${row("Reference", b.reference_code)}
    ${row("Payment", b.payment_status === "paid" ? "Paid online ✓" : "Pay on confirmation")}
    <tr><td style="padding:12px 0 0;color:${NAVY};font-size:15px;font-weight:700">Total</td><td style="padding:12px 0 0;text-align:right;color:${GOLD};font-size:18px;font-weight:700">${money(b.total_amount, b.currency)}</td></tr>
  </table>`;
}

function ctaButton(href: string, label: string, bg: string) {
  return `<a href="${href}" style="display:inline-block;background:${bg};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:10px">${label}</a>`;
}

// ---- GUEST template ----
export function guestConfirmationEmail(b: BookingRow, tour: TourRow) {
  const paid = b.payment_status === "paid";
  const headline = paid ? "Your booking is confirmed 🎉" : "We've received your booking";
  const intro = paid
    ? `Thank you, ${b.guest_name.split(" ")[0]}! Your payment came through and your spot is locked in. Here are your details.`
    : `Thanks, ${b.guest_name.split(" ")[0]}! We've got your request and our team will confirm it within 30 minutes during UAE hours. Here are your details.`;
  const wa = waLink(
    WHATSAPP_BUSINESS,
    `Hi Tripscape, this is about my booking ${b.reference_code} for ${tour.title} on ${b.booking_date}.`,
  );
  const subject = `${paid ? "Booking confirmed" : "Booking received"} — ${tour.title} (${b.reference_code})`;
  const body = `
  ${tour.hero_image ? `<tr><td style="padding:0"><img src="${tour.hero_image}" alt="${tour.title}" width="600" style="width:100%;max-height:220px;object-fit:cover;display:block"></td></tr>` : ""}
  <tr><td style="padding:32px 32px 8px">
    <h1 style="margin:0;font-size:22px;color:${NAVY}">${headline}</h1>
    <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#444">${intro}</p>
    ${summaryTable(b, tour)}
    ${b.notes ? `<p style="margin:8px 0 0;font-size:13px;color:#666"><strong>Your notes:</strong> ${b.notes}</p>` : ""}
    <div style="margin:22px 0 6px">${ctaButton(wa, "Chat with us on WhatsApp", WA_GREEN)}</div>
    <p style="margin:14px 0 0;font-size:12px;color:#888;line-height:1.6">Need to change anything? Just reply to this email or message us on WhatsApp with your reference <strong>${b.reference_code}</strong>.</p>
  </td></tr>`;
  return { subject, html: shell(subject, body) };
}

// ---- ADMIN template ----
export function adminNotificationEmail(b: BookingRow, tour: TourRow) {
  const waGuest = waLink(
    b.guest_phone,
    `Hi ${b.guest_name}, thanks for booking ${tour.title} with Tripscape (ref ${b.reference_code}). `,
  );
  const adminPanel = `${SITE_URL}/admin/bookings`;
  const subject = `New ${b.payment_status === "paid" ? "PAID " : ""}booking — ${tour.title} · ${b.reference_code}`;
  const body = `
  <tr><td style="padding:32px 32px 8px">
    <span style="display:inline-block;background:${b.payment_status === "paid" ? "#e6f7ec" : "#fff6e0"};color:${b.payment_status === "paid" ? "#1b7a3e" : "#9a6b00"};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:4px 10px;border-radius:999px">${b.payment_status === "paid" ? "Paid online" : "Awaiting confirmation"}</span>
    <h1 style="margin:14px 0 0;font-size:20px;color:${NAVY}">New booking received</h1>
    <p style="margin:10px 0 0;font-size:14px;color:#444">${b.guest_name} just booked <strong>${tour.title}</strong>.</p>
    ${summaryTable(b, tour)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px">
      <tr><td style="padding:6px 0;color:#6b6b6b;font-size:13px">Email</td><td style="padding:6px 0;text-align:right;font-size:13px"><a href="mailto:${b.guest_email}" style="color:${GOLD};text-decoration:none">${b.guest_email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#6b6b6b;font-size:13px">Phone</td><td style="padding:6px 0;text-align:right;font-size:13px"><a href="tel:${b.guest_phone.replace(/[^0-9+]/g, "")}" style="color:${GOLD};text-decoration:none">${b.guest_phone}</a></td></tr>
    </table>
    ${b.notes ? `<p style="margin:8px 0 0;font-size:13px;color:#666"><strong>Notes:</strong> ${b.notes}</p>` : ""}
    <div style="margin:22px 0 6px">
      ${ctaButton(waGuest, "WhatsApp the guest", WA_GREEN)}
      &nbsp;
      ${ctaButton(adminPanel, "Open in admin", NAVY)}
    </div>
  </td></tr>`;
  return { subject, html: shell(subject, body) };
}

// ---- Resend delivery ----
async function sendViaResend(
  to: string,
  subject: string,
  html: string,
): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html, reply_to: REPLY_TO }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${txt.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

/**
 * Build, queue, and attempt to send both confirmation emails for a booking.
 * Each email is recorded in email_notifications (durable queue) with status
 * 'sent' or 'failed' so the admin can see and retry. Never throws — email
 * problems must not break the booking flow.
 */
export async function queueAndSendBookingEmails(bookingId: string): Promise<void> {
  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select(
      "id, reference_code, guest_name, guest_email, guest_phone, booking_date, adults, children, total_amount, currency, notes, status, payment_status, tours(title, location, duration, hero_image)",
    )
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return;

  const tour = ((booking as Record<string, unknown>).tours as TourRow) ?? {
    title: "Your tour",
    location: null,
    duration: null,
    hero_image: null,
  };
  const b = booking as unknown as BookingRow;

  const guest = guestConfirmationEmail(b, tour);
  const admin = adminNotificationEmail(b, tour);

  const targets: Array<{ recipient: string; kind: string; subject: string; html: string }> = [
    {
      recipient: b.guest_email,
      kind: "guest_confirmation",
      subject: guest.subject,
      html: guest.html,
    },
    { recipient: ADMIN_TO, kind: "admin_notification", subject: admin.subject, html: admin.html },
  ];

  for (const t of targets) {
    const result = await sendViaResend(t.recipient, t.subject, t.html);
    await supabaseAdmin.from("email_notifications").insert({
      booking_id: b.id,
      recipient: t.recipient,
      kind: t.kind,
      subject: t.subject,
      status: result.ok ? "sent" : "failed",
      error: result.error ?? null,
      attempts: 1,
      sent_at: result.ok ? new Date().toISOString() : null,
    });
  }
}
