import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useNavTours } from "@/lib/use-nav-tours";
import { SectionHead } from "./SectionHead";

export function Destinations() {
  const { byCategory, loading } = useNavTours();
  const items = byCategory("City Tours").slice(0, 6);

  return (
    <section className="section-pad bg-sand/50">
      <div className="container-x">
        <SectionHead
          eyebrow="Explore the UAE"
          title="Guided city tours across the emirates."
          sub="From the skyline of Dubai to the mosques of Abu Dhabi — pick where your story begins."
          align="center"
        />

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 md:h-72 rounded-2xl bg-white animate-pulse" />
              ))
            : items.map((d) => (
                <Link
                  key={d.slug}
                  to="/tours/$slug"
                  params={{ slug: d.slug }}
                  className="group block relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src={d.hero_image ?? ""}
                    alt={d.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition duration-[1200ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-gold-light">
                      <Clock size={11} /> {d.duration ?? "Guided tour"}
                    </div>
                    <div className="mt-1 font-display font-bold text-xl md:text-2xl leading-tight line-clamp-2">
                      {d.title}
                    </div>
                    <div className="mt-1 text-sm text-white/80">
                      From AED {Number(d.price_adult).toFixed(0)}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
