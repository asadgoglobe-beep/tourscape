import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews } from "@/lib/site-data";
import { SectionHead } from "./SectionHead";

export function Reviews() {
  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHead eyebrow="What travellers say" title="Real reviews. Real travellers. Real moments." sub="4.9★ average across 356 verified Google reviews & growing on TripAdvisor." align="center"/>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-charcoal/70">
          <div className="flex items-center gap-2"><div className="font-display font-bold text-navy text-2xl">4.9</div><div className="flex">{Array.from({length:5}).map((_,k)=><Star key={k} size={14} className="text-gold fill-gold"/>)}</div><span className="text-xs">Google</span></div>
          <div className="h-6 w-px bg-black/10" />
          <div className="text-sm"><span className="font-display font-bold text-navy">5.0</span> ★ TripAdvisor</div>
          <div className="h-6 w-px bg-black/10" />
          <div className="text-sm"><span className="font-display font-bold text-navy">4.8</span> ★ Viator</div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.figure key={r.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }} className="bg-sand/50 border border-black/5 rounded-2xl p-6 relative hover:shadow-card transition">
              <Quote size={28} className="text-gold/30 absolute top-5 right-5" />
              <div className="flex">{Array.from({length:r.rating}).map((_,k)=><Star key={k} size={13} className="text-gold fill-gold"/>)}</div>
              <blockquote className="mt-3 text-[14.5px] text-charcoal/85 leading-relaxed">"{r.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <img src={r.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div><div className="font-display font-semibold text-navy text-sm">{r.name}</div><div className="text-xs text-charcoal/55">{r.country}</div></div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
