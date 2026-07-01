import { ArrowRight, Ticket } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNavTours } from "@/lib/use-nav-tours";
import { SectionHead } from "./SectionHead";

export function Attractions() {
  const { byCategory, loading } = useNavTours();
  const items = byCategory("Attractions").slice(0, 6);

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            eyebrow="Tickets & Attractions"
            title="Skip-the-line to UAE icons."
            sub="Instant e-tickets to the city's must-see attractions — at fair, transparent prices in AED."
          />
          <Link to="/attractions" className="btn-ghost-gold hidden md:inline-flex">
            View all attractions <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl bg-sand animate-pulse" />
              ))
            : items.map((a) => (
                <Link
                  key={a.slug}
                  to="/tours/$slug"
                  params={{ slug: a.slug }}
                  className="group block"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                    <img
                      src={a.hero_image ?? ""}
                      alt={a.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gold text-white grid place-items-center">
                      <Ticket size={14} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <div className="text-[10px] uppercase tracking-wider text-gold-light">
                        From AED {Number(a.price_adult).toFixed(0)}
                      </div>
                      <div className="font-display font-semibold text-sm leading-tight mt-0.5 line-clamp-2">
                        {a.title}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
        {!loading && items.length === 0 && (
          <div className="mt-8">
            <Link to="/tours" className="btn-gold">
              Browse all tours <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
