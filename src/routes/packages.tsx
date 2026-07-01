import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Clock, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { WHATSAPP } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "UAE Holiday Packages — 1, 3, 5 & 7-Day Trips | Tripscape Adventures" },
      {
        name: "description",
        content:
          "All-inclusive UAE holiday packages: hotel, tours, transfers and visa assistance bundled. 1-day combos, 3–7 day explorers, and custom itineraries.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: PackagesPage,
});

type Pkg = {
  slug: string;
  title: string;
  summary: string | null;
  hero_image: string | null;
  price_adult: number;
  duration: string | null;
  inclusions: string[] | null;
};

function PackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("tours")
      .select("slug, title, summary, hero_image, price_adult, duration, inclusions")
      .eq("is_published", true)
      .eq("category", "Packages")
      .order("price_adult", { ascending: true })
      .then(({ data }) => {
        if (active) {
          setPackages((data as Pkg[]) ?? []);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell
      eyebrow="Holiday Packages"
      title="The whole UAE in one tidy itinerary."
      sub="Hotel + tours + transfers + visa — bundled, simple, and built for your dates."
      image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-tour h-[520px] bg-sand animate-pulse" />
            ))
          : packages.map((p, idx) => (
              <Link
                key={p.slug}
                to="/tours/$slug"
                params={{ slug: p.slug }}
                className="card-tour flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.hero_image ?? ""}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  {idx === 0 && (
                    <span className="absolute top-4 left-4 badge-gold">
                      <Sparkles size={11} className="mr-1" /> Most popular
                    </span>
                  )}
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                    <div>
                      {p.duration && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold opacity-90">
                          <Clock size={13} /> {p.duration}
                        </div>
                      )}
                      <h3 className="mt-1 font-display font-bold text-2xl leading-tight">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  {p.summary && <p className="text-charcoal/70 text-sm">{p.summary}</p>}
                  <ul className="mt-4 space-y-2 flex-1">
                    {(p.inclusions ?? []).slice(0, 5).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-charcoal/80">
                        <Check size={16} className="text-gold shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-5">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-charcoal/55 font-semibold">
                        From / person
                      </div>
                      <div className="font-display font-bold text-2xl text-navy">
                        AED {Number(p.price_adult).toLocaleString()}
                      </div>
                    </div>
                    <span className="btn-gold !rounded-xl group-hover:gap-2">
                      View &amp; book <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Custom itinerary CTA */}
      <div className="mt-10 rounded-3xl bg-navy text-white p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <span className="eyebrow !text-gold-light">Custom Itinerary</span>
            <h2 className="mt-2 font-display font-bold text-3xl md:text-4xl">
              None of these fit? Tell us your dates.
            </h2>
            <p className="mt-3 text-white/75 max-w-xl">
              Send us how long you're staying, your budget and what you love — desert, beaches,
              culture, theme parks — and we'll build a private package in AED, usually the same day.
              No pressure, no obligation.
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-gold-light" /> All 7 emirates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-gold-light" /> Visa assistance included
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/contact" className="btn-gold !w-full justify-center">
              Build my custom trip
            </Link>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-light !w-full justify-center"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-charcoal/50">
        Prices are indicative starting points and vary by season, hotel category and group size.
        Final quote confirmed in writing before any payment.
      </p>
    </PageShell>
  );
}
