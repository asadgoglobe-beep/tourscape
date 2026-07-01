import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { post: data };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    if (!p) return { meta: [{ title: "Article — Tripscape" }] };
    return {
      meta: [
        { title: `${p.seo_title ?? p.title} — Tripscape Journal` },
        { name: "description", content: p.seo_description ?? p.excerpt ?? "" },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt ?? "" },
        { property: "og:image", content: p.cover_image ?? "" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-sand">
      <div className="text-center">
        <h1 className="font-display text-4xl text-navy">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-flex btn-gold">
          Back to journal
        </Link>
      </div>
    </div>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.cover_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    description: post.excerpt,
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <div className="relative h-[55vh] min-h-[400px] -mt-[72px] lg:-mt-[calc(72px+36px)]">
          <img
            src={post.cover_image ?? ""}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/30" />
          <div className="absolute inset-x-0 bottom-0 container-x pb-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-white/80 hover:text-gold-light text-sm"
            >
              <ArrowLeft size={14} /> Back to journal
            </Link>
            <h1 className="mt-4 font-display font-bold text-white text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-[1.05]">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-white/80 text-sm">
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {format(new Date(post.published_at), "MMMM d, yyyy")}
                </span>
              )}
              {post.tags?.map((t: string) => (
                <span key={t} className="flex items-center gap-1 text-gold-light">
                  <Tag size={11} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-14">
          {post.excerpt && (
            <p className="text-xl text-charcoal/75 leading-relaxed font-display">{post.excerpt}</p>
          )}
          <div
            className="article-content mt-8"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
      </article>
      <Footer />
    </div>
  );
}
