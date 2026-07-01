import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Support } from "@/components/sections/Support";

export function PageShell({ eyebrow, title, sub, image, children }: {
  eyebrow: string; title: string; sub?: string; image: string; children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header transparent />
      <main>
        <section className="relative h-[60vh] min-h-[420px] -mt-[72px] lg:-mt-[calc(72px+36px)] overflow-hidden">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/40 to-navy/85" />
          <div className="relative h-full container-x flex flex-col justify-end pb-16 pt-32">
            <span className="eyebrow !text-gold-light">{eyebrow}</span>
            <h1 className="mt-3 text-white font-display font-bold text-4xl md:text-6xl leading-[1.05] max-w-3xl">{title}</h1>
            {sub && <p className="mt-4 text-white/80 max-w-xl text-lg">{sub}</p>}
          </div>
        </section>
        <section className="section-pad">
          <div className="container-x">
            {children ?? (
              <div className="max-w-2xl mx-auto text-center py-16">
                <span className="badge-gold">Coming soon</span>
                <h2 className="mt-4 font-display font-bold text-3xl text-navy">We're polishing this page</h2>
                <p className="mt-3 text-charcoal/70">In the meantime, message us on WhatsApp and we'll send you the full menu of options — including custom itineraries built around your dates.</p>
              </div>
            )}
          </div>
        </section>
        <Support />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
