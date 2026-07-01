import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { services } from "@/lib/site-data";

const bullets = ["Licensed by Dubai Department of Economy & Tourism", "7+ years operating across the UAE", "4.9★ rating on Google with 356+ verified reviews", "Local guides fluent in English, Arabic, Hindi & Urdu"];

export function About() {
  return (
    <section className="section-pad bg-sand/60">
      <div className="container-x grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative mt-5 sm:absolute sm:-bottom-6 sm:-right-2 md:sm:-right-8 bg-white rounded-2xl shadow-soft p-5 max-w-[220px] w-full sm:w-auto">
            <div className="font-display font-bold text-4xl text-gold">12k+</div>
            <div className="text-sm text-charcoal/70 mt-1">Happy travellers welcomed to the UAE since 2018.</div>
          </div>
          <div className="absolute -top-4 -left-2 md:-left-6 bg-navy text-white rounded-2xl p-4 hidden sm:block animate-floaty">
            <div className="text-[11px] uppercase tracking-wider text-gold-light">Trusted by</div>
            <div className="font-display font-bold text-lg">TripAdvisor · Viator</div>
          </div>
        </motion.div>

        <div>
          <span className="eyebrow">About Tripscape</span>
          <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.1]">A licensed UAE operator built on real reviews & real itineraries.</h2>
          <p className="mt-5 text-charcoal/75 leading-relaxed">
            We're a Dubai-based team of local guides, drivers and concierges. No middlemen, no hidden fees, no generic tour-bus loops — every itinerary is built with the kind of care we'd give our own family flying in.
          </p>

          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3"><span className="mt-0.5 h-5 w-5 rounded-full bg-gold text-white grid place-items-center shrink-0"><Check size={12}/></span><span className="text-charcoal/85 text-[15px]">{b}</span></li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {services.map(s => (
              <div key={s.title} className="p-4 bg-white rounded-xl border border-black/5">
                <div className="font-display font-semibold text-navy text-sm">{s.title}</div>
                <div className="text-[12.5px] text-charcoal/65 mt-1 leading-snug">{s.desc}</div>
              </div>
            ))}
          </div>

          <Link to="/about" className="mt-8 btn-gold inline-flex">Our Story</Link>
        </div>
      </div>
    </section>
  );
}
