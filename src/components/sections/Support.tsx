import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { EMAIL, PHONE, WHATSAPP } from "@/lib/site-data";

const channels = [
  { Icon: MessageCircle, label: "WhatsApp", value: "Chat now — replies in 60s", href: WHATSAPP, accent: "bg-[#25D366]" },
  { Icon: Phone, label: "Call us", value: PHONE, href: `tel:${PHONE.replace(/\s/g,"")}`, accent: "bg-gold" },
  { Icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, accent: "bg-navy" },
];

export function Support() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-x">
        <div className="rounded-3xl bg-gradient-to-br from-navy to-navy-700 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl"/>
          <div className="relative grid lg:grid-cols-[1fr_auto] items-center gap-8">
            <div>
              <span className="eyebrow !text-gold-light">24/7 Support</span>
              <h3 className="mt-2 font-display font-bold text-white text-3xl md:text-4xl max-w-xl leading-tight">How can we help you plan the perfect UAE trip?</h3>
              <p className="mt-3 text-white/65 max-w-lg">Our team is online every day of the year. Pick the channel that works for you.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:max-w-[640px]">
              {channels.map(({ Icon, label, value, href, accent }, i) => (
                <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="group bg-white/8 hover:bg-white/12 border border-white/10 rounded-2xl p-5 transition">
                  <div className={`h-10 w-10 rounded-xl ${accent} grid place-items-center text-white mb-3 group-hover:scale-110 transition`}><Icon size={18}/></div>
                  <div className="text-[11px] uppercase tracking-wider text-white/55">{label}</div>
                  <div className="text-white font-display font-semibold mt-0.5 text-sm leading-tight">{value}</div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
