import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Phone, Search, Star } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { heroSlides, PHONE, WHATSAPP } from "@/lib/site-data";

const DESTS = ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Fujairah", "Al Ain"];
const CATS = ["All", "Desert Safari", "City Tours", "Attractions", "Adventures"];

export function Hero() {
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const [dest, setDest] = useState("Dubai");
  const [cat, setCat] = useState("All");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);
  const slide = heroSlides[i];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/tours", search: { q: q || undefined, category: cat === "All" ? undefined : cat, date: date || undefined } as any });
  }

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden -mt-[72px] lg:-mt-[calc(72px+36px)]">
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.img} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-navy/45 via-navy/30 to-navy/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />

      <div className="relative z-10 min-h-[100svh] container-x flex flex-col justify-end pb-36 md:pb-32 pt-32">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.7, ease: [0.2,0.7,0.2,1] }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] tracking-[0.18em] uppercase font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-light animate-pulse" /> {slide.eyebrow}
            </span>
            <h1 className="mt-5 text-white font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="mt-5 text-white/85 text-base md:text-lg max-w-xl leading-relaxed">{slide.sub}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tours" className="btn-gold">Explore tours <ArrowRight size={16}/></Link>
              <a href={`tel:${PHONE.replace(/\s/g,"")}`} className="btn-outline-light"><Phone size={16}/> <span className="hidden sm:inline">{PHONE}</span><span className="sm:hidden">Call us</span></a>
            </div>

            <div className="mt-8 flex items-center gap-4 text-white/85">
              <div className="flex">{Array.from({length:5}).map((_,k)=><Star key={k} size={14} className="text-gold-light fill-gold-light"/>)}</div>
              <div className="text-xs sm:text-sm"><span className="font-semibold text-white">4.9 / 5</span> · 356 verified reviews</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-28 md:bottom-36 right-5 md:right-8 flex gap-2 z-20">
          {heroSlides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className="h-1 rounded-full transition-all" style={{ width: k === i ? 44 : 16, background: k === i ? "#F4CC90" : "rgba(255,255,255,0.4)" }} aria-label={`Slide ${k+1}`} />
          ))}
        </div>
      </div>

      {/* Functional search bar */}
      <div className="relative z-20 container-x">
        <form onSubmit={submit} className="-mt-24 md:-mt-16 mb-6 relative bg-white rounded-2xl shadow-[0_30px_60px_-20px_rgba(16,24,38,0.45)] p-2 md:p-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-2">
          <label className="px-4 py-2 rounded-xl hover:bg-sand transition flex items-center gap-3 min-w-0">
            <Search size={16} className="text-charcoal/45 shrink-0"/>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider text-charcoal/55 font-semibold">Search</div>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="e.g. Burj Khalifa" className="w-full text-navy font-display font-semibold bg-transparent focus:outline-none text-sm placeholder:text-charcoal/35"/>
            </div>
          </label>
          <label className="px-4 py-2 rounded-xl hover:bg-sand transition">
            <div className="text-[10px] uppercase tracking-wider text-charcoal/55 font-semibold">Destination</div>
            <select value={dest} onChange={e => setDest(e.target.value)} className="w-full text-navy font-display font-semibold bg-transparent focus:outline-none text-sm">
              {DESTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="px-4 py-2 rounded-xl hover:bg-sand transition">
            <div className="text-[10px] uppercase tracking-wider text-charcoal/55 font-semibold">Category</div>
            <select value={cat} onChange={e => setCat(e.target.value)} className="w-full text-navy font-display font-semibold bg-transparent focus:outline-none text-sm">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="px-4 py-2 rounded-xl hover:bg-sand transition">
            <div className="text-[10px] uppercase tracking-wider text-charcoal/55 font-semibold">Date</div>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-navy font-display font-semibold bg-transparent focus:outline-none text-sm"/>
          </label>
          <button type="submit" className="btn-gold !rounded-xl !py-3">Search</button>
        </form>
      </div>
    </section>
  );
}
