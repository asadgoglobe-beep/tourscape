import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHead } from "./SectionHead";

type Card = {
  id: string;
  slug: string;
  title: string;
  hero_image: string | null;
  price_adult: number;
  duration: string | null;
  category: string | null;
  rating: number | null;
  reviews_count: number | null;
};

type Props = {
  category?: string;
  eyebrow?: string;
  title?: string;
  sub?: string;
  limit?: number;
};

export function Experiences({
  category,
  eyebrow = "Top Experiences",
  title = "Top-rated tours, hand-picked.",
  sub = "Our most-booked experiences this month — verified guides, instant confirmations, free WhatsApp re-scheduling.",
  limit = 8,
}: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: false, dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [tours, setTours] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("tours")
        .select(
          "id, slug, title, hero_image, price_adult, duration, category, rating, reviews_count",
        )
        .eq("is_published", true)
        .order("rating", { ascending: false })
        .limit(limit);
      if (category) q = q.eq("category", category);
      const { data } = await q;
      if (active) {
        setTours((data as Card[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [category, limit]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla, onSelect, tours]);

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead eyebrow={eyebrow} title={title} sub={sub} />
          <div className="flex gap-2">
            <button
              onClick={() => embla?.scrollPrev()}
              disabled={!canPrev}
              aria-label="Previous"
              className="h-11 w-11 rounded-full border border-navy/15 grid place-items-center text-navy hover:bg-navy hover:text-white transition disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-navy"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => embla?.scrollNext()}
              disabled={!canNext}
              aria-label="Next"
              className="h-11 w-11 rounded-full border border-navy/15 grid place-items-center text-navy hover:bg-navy hover:text-white transition disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-navy"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-10 overflow-hidden -mx-5 md:-mx-8" ref={emblaRef}>
          <div className="flex pl-5 md:pl-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[82%] sm:w-[48%] lg:w-[31%] xl:w-[24%] pr-5 md:pr-6"
                >
                  <div className="bg-sand rounded-2xl h-[360px] animate-pulse" />
                </div>
              ))
            ) : tours.length === 0 ? (
              <div className="px-1 py-12 text-charcoal/65">
                No tours to show here yet.{" "}
                <Link to="/tours" className="text-gold font-semibold hover:underline">
                  Browse all tours →
                </Link>
              </div>
            ) : (
              tours.map((t) => (
                <div
                  key={t.id}
                  className="shrink-0 w-[82%] sm:w-[48%] lg:w-[31%] xl:w-[24%] pr-5 md:pr-6"
                >
                  <Link
                    to="/tours/$slug"
                    params={{ slug: t.slug }}
                    className="card-tour block group"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={t.hero_image ?? ""}
                        alt={t.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      {t.category && (
                        <div className="absolute top-3 left-3">
                          <span className="badge-gold">{t.category}</span>
                        </div>
                      )}
                      {t.duration && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold text-navy flex items-center gap-1">
                          <Clock size={11} /> {t.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-[12px] text-charcoal/65">
                        <Star size={12} className="text-gold fill-gold" />{" "}
                        {t.rating?.toFixed(1) ?? "4.9"} · {t.reviews_count ?? 0} reviews
                      </div>
                      <h3 className="mt-1.5 font-display font-semibold text-navy text-[17px] leading-snug group-hover:text-gold transition line-clamp-2">
                        {t.title}
                      </h3>
                      <div className="mt-4 pt-4 border-t border-black/5 flex items-end justify-between">
                        <div>
                          <div className="text-[11px] uppercase tracking-wider text-charcoal/55">
                            From
                          </div>
                          <div className="font-display font-bold text-navy">
                            <span className="text-gold text-xl">
                              AED {Number(t.price_adult).toFixed(0)}
                            </span>
                            <span className="text-xs text-charcoal/55 font-medium"> /person</span>
                          </div>
                        </div>
                        <span className="text-[13px] font-semibold text-gold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                          View <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
