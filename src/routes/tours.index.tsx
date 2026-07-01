import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Filter, MapPin, Search, Star, X } from "lucide-react";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  date: z.string().optional(),
});

export const Route = createFileRoute("/tours/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All UAE Tours & Experiences — Tripscape Adventures" },
      {
        name: "description",
        content:
          "Browse desert safaris, Dubai & Abu Dhabi city tours, attractions and adventures. Real reviews, AED pricing, instant WhatsApp confirmation.",
      },
      { property: "og:title", content: "All UAE Tours — Tripscape" },
      {
        property: "og:description",
        content: "Find your perfect UAE experience — filter by category, date and price.",
      },
    ],
  }),
  component: ToursPage,
});

const CATEGORIES = [
  "All",
  "Desert Safari",
  "City Tours",
  "Attractions",
  "Adventures",
  "Premium Experiences",
];

type Tour = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  hero_image: string | null;
  price_adult: number;
  duration: string | null;
  location: string | null;
  category: string | null;
  rating: number | null;
  reviews_count: number | null;
};

function ToursPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const [category, setCategory] = useState(search.category ?? "All");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("tours")
      .select(
        "id, slug, title, summary, hero_image, price_adult, duration, location, category, rating, reviews_count",
      )
      .eq("is_published", true)
      .order("rating", { ascending: false });
    if (category && category !== "All") query = query.eq("category", category);
    if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);
    query.then(({ data }) => {
      setTours((data as Tour[]) ?? []);
      setLoading(false);
    });
  }, [q, category]);

  function applyFilter(next: { q?: string; category?: string }) {
    navigate({
      to: "/tours",
      search: {
        q: next.q ?? q ?? undefined,
        category: next.category ?? category,
        date: search.date,
      },
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-sand/30">
      <Header />
      <FloatingWhatsApp />
      <section className="bg-navy text-white py-12 md:py-20">
        <div className="container-x">
          <span className="eyebrow text-gold-light">All Tours</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">
            Find your UAE adventure
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            Hand-picked, licensed experiences across all seven emirates. Filter by category or
            search by name.
          </p>

          <div className="mt-8 bg-white rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 shadow-soft">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
              <Search size={18} className="text-charcoal/45 shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilter({ q: q })}
                placeholder="Search tours, e.g. 'desert safari'"
                className="w-full bg-transparent text-navy placeholder:text-charcoal/40 focus:outline-none"
              />
              {q && (
                <button
                  onClick={() => {
                    setQ("");
                    applyFilter({ q: "" });
                  }}
                  className="text-charcoal/40 hover:text-navy"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                applyFilter({ category: e.target.value });
              }}
              className="px-4 py-3 rounded-xl border border-navy/10 text-navy font-medium bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button onClick={() => applyFilter({})} className="btn-gold !rounded-xl">
              <Filter size={14} /> Apply
            </button>
          </div>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="text-sm text-charcoal/70">
            {loading ? "Loading…" : `${tours.length} tour${tours.length === 1 ? "" : "s"} found`}
          </div>
          <div className="hidden md:flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  applyFilter({ category: c });
                }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${category === c ? "bg-navy text-white" : "bg-white text-navy border border-navy/10 hover:border-gold"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[420px] animate-pulse" />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-charcoal/60">No tours match your filters.</p>
            <button
              onClick={() => {
                setQ("");
                setCategory("All");
                navigate({ to: "/tours", search: {} });
              }}
              className="mt-4 text-gold font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              >
                <Link to="/tours/$slug" params={{ slug: t.slug }} className="card-tour block group">
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
                    <div className="flex items-center gap-3 text-[12px] text-charcoal/65">
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-gold fill-gold" />{" "}
                        {t.rating?.toFixed(1) ?? "4.9"} · {t.reviews_count ?? 0}
                      </span>
                      {t.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {t.location}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display font-semibold text-navy text-[17px] leading-snug group-hover:text-gold transition line-clamp-2">
                      {t.title}
                    </h3>
                    {t.summary && (
                      <p className="mt-2 text-sm text-charcoal/65 line-clamp-2">{t.summary}</p>
                    )}
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
                      <span className="text-[13px] font-semibold text-gold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
