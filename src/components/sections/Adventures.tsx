import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useNavTours } from "@/lib/use-nav-tours";
import { SectionHead } from "./SectionHead";

export function Adventures() {
  const { byCategory, loading } = useNavTours();
  const items = byCategory("Adventures").slice(0, 6);

  return (
    <section className="section-pad bg-navy relative overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold-light/5 blur-3xl" />
      <div className="container-x relative">
        <SectionHead
          eyebrow="Adrenaline · Desert"
          title="Adventures that get your heart racing."
          sub="From dune bashing to hot-air ballooning at sunrise — choose your level of thrill."
          invert
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-white/5 animate-pulse" />
              ))
            : items.map((a) => (
                <Link
                  key={a.slug}
                  to="/tours/$slug"
                  params={{ slug: a.slug }}
                  className="group block relative h-72 rounded-2xl overflow-hidden"
                >
                  <img
                    src={a.hero_image ?? ""}
                    alt={a.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition duration-[1200ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="font-display font-bold text-2xl leading-tight line-clamp-2">
                      {a.title}
                    </h3>
                    {a.summary && (
                      <p className="mt-1.5 text-sm text-white/75 max-w-[30ch] line-clamp-2">
                        {a.summary}
                      </p>
                    )}
                    <div className="mt-4 inline-flex items-center gap-2 text-gold-light text-sm font-semibold group-hover:gap-3 transition-all">
                      From AED {Number(a.price_adult).toFixed(0)} <ArrowRight size={14} />
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
