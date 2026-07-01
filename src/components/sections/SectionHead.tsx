import { motion } from "framer-motion";

export function SectionHead({ eyebrow, title, sub, align = "left", invert = false }: {
  eyebrow: string; title: string; sub?: string; align?: "left" | "center"; invert?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`mt-3 font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1] ${invert ? "text-white" : "text-navy"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-[15.5px] leading-relaxed ${invert ? "text-white/70" : "text-charcoal/70"}`}>{sub}</p>}
    </motion.div>
  );
}
