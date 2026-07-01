import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Star, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

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

export const Route = createFileRoute("/premium")({
  loader: async () => {
    const { data } = await supabase
      .from("tours")
      .select(
        "id, slug, title, summary, hero_image, price_adult, duration, location, category, rating, reviews_count",
      )
      .eq("is_published", true)
      .eq("category", "Premium Experiences")
      .order("rating", { ascending: false });
    return { tours: (data as Tour[]) ?? [] };
  },
  head: () => ({
    meta: [
      { title: "Premium & Private Experiences in Dubai — Yacht, Helicopter, Camping | Tripscape" },
      {
        name: "description",
        content:
          "Private and luxury experiences in Dubai — private yacht charters, helicopter tours, overnight desert camping, birthday and desert parties. Exclusive, fully tailored, transparent AED pricing.",
      },
      { property: "og:title", content: "Premium & Private Experiences — Tripscape Adventures" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  const { tours } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-sand/30">
      <Header />
      <FloatingWhatsApp />

      {/* Hero */}
      <section className="relative bg-navy text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
        <div className="container-x relative py-16 md:py-24">
          <span className="inline-flex items-center gap-1.5 eyebrow text-gold-light">
            <Sparkles size={13} /> Premium & Private
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-[1.05] max-w-3xl">
            Private experiences, entirely your own.
          </h1>
          <p className="mt-4 text-white/75 max-w-2xl text-lg">
            Yacht charters, helicopter flights, overnight desert camps and private celebrations —
            exclusive to your group, tailored to the occasion, with transparent pricing.
          </p>
          <a href="#premium-tours" className="btn-gold mt-8 inline-flex">
            Explore experiences <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* Grid */}
      <section id="premium-tours" className="container-x py-12 md:py-16">
        <div className="text-sm text-charcoal/70 mb-8">
          {tours.length} private experience{tours.length === 1 ? "" : "s"} · fully customisable
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-charcoal/60">
              Premium experiences are being added. Message us on WhatsApp and we&apos;ll tailor one
              for you.
            </p>
            <Link to="/tours" className="mt-4 inline-flex text-gold font-semibold hover:underline">
              Browse all tours
            </Link>
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
                    <div className="absolute top-3 left-3">
                      <span className="badge-gold inline-flex items-center gap-1">
                        <Sparkles size={10} /> Private
                      </span>
                    </div>
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
