import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WHATSAPP } from "@/lib/site-data";

export const Route = createFileRoute("/booking/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : "",
  }),
  head: () => ({
    meta: [
      { title: "Booking confirmed — Tripscape Adventures" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingSuccess,
});

function BookingSuccess() {
  const { ref } = Route.useSearch();
  const wa = `${WHATSAPP}${WHATSAPP.includes("?") ? "&" : "?"}text=${encodeURIComponent(`Hi Tripscape, this is about my booking ${ref}.`)}`;
  return (
    <div className="min-h-screen bg-sand/40 flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center px-4 py-20">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-soft p-8 md:p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 grid place-items-center mx-auto">
            <CheckCircle2 size={34} className="text-green-600" />
          </div>
          <h1 className="mt-6 font-display font-bold text-3xl text-navy">Payment received 🎉</h1>
          <p className="mt-3 text-charcoal/70">
            Your booking is confirmed and a confirmation email is on its way. Our team will be in
            touch with the final pickup details.
          </p>
          {ref && (
            <div className="mt-6 inline-flex items-center gap-2 bg-sand rounded-xl px-5 py-3">
              <span className="text-xs uppercase tracking-wider text-charcoal/55 font-semibold">
                Reference
              </span>
              <span className="font-mono font-bold text-gold">{ref}</span>
            </div>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="btn-gold !bg-[#25D366] hover:!bg-[#1ebd5a] justify-center"
            >
              <MessageCircle size={16} /> Message us on WhatsApp
            </a>
            <Link
              to="/tours"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-navy/15 text-navy font-semibold hover:bg-sand transition"
            >
              Browse more tours
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
