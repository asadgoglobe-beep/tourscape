import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import { WHATSAPP } from "@/lib/site-data";

export function PromoBanner() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-navy shadow-soft">
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=1600&q=80" alt="" className="h-full w-full object-cover opacity-25" />
          </div>
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center p-8 md:p-14">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-light text-[11px] uppercase tracking-[0.15em] font-semibold"><Award size={12}/> Limited Offer</span>
              <h2 className="mt-4 font-display font-bold text-white text-3xl md:text-5xl leading-[1.05] max-w-xl">Desert Safari packages — <span className="text-gold-light">up to 30% off</span> this season.</h2>
              <p className="mt-4 text-white/70 max-w-md">Evening, premium and VIP overnight safaris. Free pickup from anywhere in Dubai. Offer ends end of month.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="md:justify-self-end w-full md:w-auto">
              <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-6 md:min-w-[280px]">
                <div className="text-white/60 text-xs uppercase tracking-wider">Starting from</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-gold-light font-display font-bold text-5xl">99</span>
                  <span className="text-white/80 font-display font-medium">AED</span>
                  <span className="ml-1 line-through text-white/40 text-sm">149</span>
                </div>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-gold w-full mt-5">Book Now <ArrowRight size={14}/></a>
                <div className="mt-3 text-center text-[11px] text-white/50">Free cancellation up to 24 hours before</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
