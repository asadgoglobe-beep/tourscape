import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, BadgeCheck, Headphones } from "lucide-react";

const items = [
  { Icon: ShieldCheck, title: "Licensed Operator", sub: "DED-registered, fully insured tours across the UAE." },
  { Icon: BadgeCheck, title: "Best Price Guarantee", sub: "Find it cheaper? We'll match it — no questions asked." },
  { Icon: Sparkles, title: "Hand-picked Experiences", sub: "Real itineraries, real guides, no tourist traps." },
  { Icon: Headphones, title: "24/7 WhatsApp Support", sub: "Reply in under 60 seconds, every day of the year." },
];

export function TrustStrip() {
  return (
    <section className="bg-sand">
      <div className="container-x py-12 md:py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ Icon, title, sub }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex gap-4 items-start"
          >
            <div className="shrink-0 h-12 w-12 rounded-xl bg-white grid place-items-center text-gold shadow-sm">
              <Icon size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-navy text-[17px]">{title}</h3>
              <p className="text-[13.5px] text-charcoal/70 mt-1 leading-snug">{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
