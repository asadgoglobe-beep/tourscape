import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Travel Journal — UAE Guides, Tips & Itineraries | Tripscape" },
      {
        name: "description",
        content:
          "Honest UAE travel guides from a Dubai-based local team. Outfit guides, hidden spots, itineraries, food and family travel tips.",
      },
      { property: "og:title", content: "UAE Travel Journal — Tripscape" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: BlogIndex,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[] | null;
  published_at: string | null;
};

function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tag, setTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("posts")
      .select("id, slug, title, excerpt, cover_image, tags, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (tag) q = q.contains("tags", [tag]);
    q.then(({ data }) => {
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    });
  }, [tag]);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).slice(0, 12);

  return (
    <div className="min-h-screen bg-sand/30">
      <Header />
      <FloatingWhatsApp />
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=70"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="container-x relative">
          <span className="eyebrow text-gold-light">Travel Journal</span>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
            Real UAE stories,
            <br />
            freshly written.
          </h1>
          <p className="mt-4 text-white/80 max-w-xl">
            No SEO fluff. Just the spots, tips and itineraries our team would send a friend.
          </p>
        </div>
      </section>

      <section className="container-x py-12 md:py-16">
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setTag(null)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${!tag ? "bg-navy text-white" : "bg-white text-navy border border-navy/10 hover:border-gold"}`}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${tag === t ? "bg-navy text-white" : "bg-white text-navy border border-navy/10 hover:border-gold"}`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[420px] animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-charcoal/60 text-center py-20">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="card-tour group"
              >
                <Link to="/blog/$slug" params={{ slug: p.slug }}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.cover_image ?? ""}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[12px] text-charcoal/60">
                      {p.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {format(new Date(p.published_at), "MMM d, yyyy")}
                        </span>
                      )}
                      {p.tags?.[0] && (
                        <span className="flex items-center gap-1">
                          <Tag size={11} /> {p.tags[0]}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 font-display font-bold text-navy text-lg leading-snug group-hover:text-gold transition line-clamp-2">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-2 text-sm text-charcoal/70 line-clamp-3">{p.excerpt}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 font-semibold text-gold text-sm group-hover:gap-2 transition-all">
                      Read article <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
