import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WHATSAPP } from "@/lib/site-data";

export const Route = createFileRoute("/booking/cancelled")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : "",
  }),
  head: () => ({
    meta: [
      { title: "Payment cancelled — Tripscape Adventures" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingCancelled,
});

function BookingCancelled() {
  const { ref } = Route.useSearch();
  return (
    <div className="min-h-screen bg-sand/40 flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center px-4 py-20">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-soft p-8 md:p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 grid place-items-center mx-auto">
            <XCircle size={34} className="text-red-500" />
          </div>
          <h1 className="mt-6 font-display font-bold text-3xl text-navy">Payment not completed</h1>
          <p className="mt-3 text-charcoal/70">
            No charge was made. Your spot isn't confirmed yet
            {ref ? (
              <>
                {" "}
                (reference <span className="font-mono text-gold">{ref}</span>)
              </>
            ) : (
              ""
            )}
            . You can try again or reach us directly and we'll sort it out.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tours" className="btn-gold justify-center">
              Try booking again
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-navy/15 text-navy font-semibold hover:bg-sand transition"
            >
              <MessageCircle size={16} /> Chat with us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
