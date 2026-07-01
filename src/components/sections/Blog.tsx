import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHead } from "./SectionHead";

type Post = {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  excerpt: string | null;
  tags: string[] | null;
  published_at: string | null;
};

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("posts")
      .select("id, slug, title, cover_image, excerpt, tags, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (active) {
          setPosts((data as Post[]) ?? []);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section-pad bg-sand/50">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHead
            eyebrow="Travel Journal"
            title="Stories, guides & insider tips."
            sub="From outfit guides to hidden cafés — fresh from our local team."
          />
          <Link to="/blog" className="btn-ghost-gold hidden md:inline-flex">
            All articles <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-[340px] animate-pulse" />
              ))
            : posts.map((p) => (
                <article key={p.id} className="card-tour group">
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={p.cover_image ?? ""}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-[12px] text-charcoal/55">
                        {p.tags && p.tags[0] && <span className="badge-gold">{p.tags[0]}</span>}
                        {p.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />{" "}
                            {new Date(p.published_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-display font-semibold text-navy text-lg leading-snug group-hover:text-gold transition line-clamp-2">
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="mt-2 text-sm text-charcoal/65 line-clamp-2">{p.excerpt}</p>
                      )}
                      <div className="mt-4 inline-flex items-center gap-1.5 text-gold font-semibold text-sm group-hover:gap-3 transition-all">
                        Read article <ArrowRight size={13} />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
