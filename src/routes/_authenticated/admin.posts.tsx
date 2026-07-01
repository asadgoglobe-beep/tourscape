import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { savePostFn, deletePostFn } from "@/lib/post-actions";
import { checkCanManage } from "@/lib/admin-guard";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export const Route = createFileRoute("/_authenticated/admin/posts")({
  beforeLoad: async () => {
    if (!(await checkCanManage())) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Posts — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPosts,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  content: string;
  tags: string[] | null;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
};

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "lowercase-hyphens only"),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().max(400).optional(),
  cover_image: z.string().url().max(500).optional().or(z.literal("")),
  content: z.string().max(50000),
  tags: z.string().max(300),
});

function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [active, setActive] = useState<Post | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user?.id ?? "");
      setAllowed(roles?.some((r) => r.role === "admin" || r.role === "editor") ?? false);
      load();
    })();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  }

  function newPost() {
    setActive({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      cover_image: "",
      content: "",
      tags: [],
      is_published: false,
      seo_title: "",
      seo_description: "",
      published_at: null,
    });
  }

  async function save(p: Post, publish: boolean) {
    const parsed = schema.safeParse({
      ...p,
      excerpt: p.excerpt ?? "",
      cover_image: p.cover_image ?? "",
      tags: (p.tags ?? []).join(","),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const tags = (parsed.data.tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await savePostFn({
        data: {
          id: p.id || undefined,
          slug: parsed.data.slug,
          title: parsed.data.title,
          excerpt: parsed.data.excerpt || null,
          cover_image: parsed.data.cover_image || null,
          content: parsed.data.content,
          tags,
          seo_title: p.seo_title || null,
          seo_description: p.seo_description || null,
          is_published: publish,
        },
      });
      toast.success(publish ? "Published" : "Saved as draft");
      setActive(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePostFn({ data: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  }

  if (allowed === false)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-navy">Admins only</h1>
          <Link to="/" className="mt-4 inline-flex btn-gold">
            Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-sand/40">
      <Header />
      <div className="container-x py-10">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-charcoal/70 hover:text-gold"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display text-3xl font-bold text-navy">Blog posts</h1>
          <button onClick={newPost} className="btn-gold !rounded-xl">
            <Plus size={14} /> New post
          </button>
        </div>

        <div className="mt-8 grid gap-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${p.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-charcoal/55 truncate">/blog/{p.slug}</span>
                </div>
                <h3 className="mt-1 font-display font-semibold text-navy">{p.title}</h3>
              </div>
              <button
                onClick={() => setActive(p)}
                className="px-3 py-1.5 rounded-lg border border-navy/15 text-sm text-navy hover:bg-sand"
              >
                Edit
              </button>
              <button
                onClick={() => remove(p.id)}
                className="h-9 w-9 grid place-items-center rounded-lg text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-charcoal/55 text-sm">No posts yet — create your first one.</p>
          )}
        </div>
      </div>

      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] bg-navy/70 backdrop-blur-sm overflow-y-auto py-10 px-4"
          onClick={() => setActive(null)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl max-w-3xl mx-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display font-bold text-2xl text-navy">
              {active.id ? "Edit post" : "New post"}
            </h2>
            <div className="mt-5 grid gap-3">
              <Field label="Title">
                <input
                  value={active.title}
                  onChange={(e) => setActive({ ...active, title: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={active.slug}
                  onChange={(e) =>
                    setActive({
                      ...active,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  className="input"
                />
              </Field>
              <Field label="Cover image">
                <ImageUpload
                  value={active.cover_image ?? ""}
                  onChange={(url) => setActive({ ...active, cover_image: url })}
                />
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  value={(active.tags ?? []).join(", ")}
                  onChange={(e) =>
                    setActive({
                      ...active,
                      tags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="input"
                />
              </Field>
              <Field label="Excerpt">
                <textarea
                  value={active.excerpt ?? ""}
                  onChange={(e) => setActive({ ...active, excerpt: e.target.value })}
                  maxLength={400}
                  rows={2}
                  className="input"
                />
              </Field>
              <Field label="Content">
                <RichTextEditor
                  value={active.content}
                  onChange={(html) => setActive({ ...active, content: html })}
                  minHeight={300}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="SEO title">
                  <input
                    value={active.seo_title ?? ""}
                    onChange={(e) => setActive({ ...active, seo_title: e.target.value })}
                    maxLength={70}
                    className="input"
                  />
                </Field>
                <Field label="SEO description">
                  <input
                    value={active.seo_description ?? ""}
                    onChange={(e) => setActive({ ...active, seo_description: e.target.value })}
                    maxLength={160}
                    className="input"
                  />
                </Field>
              </div>
            </div>
            <div className="mt-6 flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => setActive(null)}
                className="px-4 py-2 rounded-lg border border-navy/15 text-navy"
              >
                Cancel
              </button>
              <button
                onClick={() => save(active, false)}
                className="px-4 py-2 rounded-lg bg-navy text-white hover:bg-navy/90 inline-flex items-center gap-1"
              >
                <Save size={14} /> Save draft
              </button>
              <button onClick={() => save(active, true)} className="btn-gold !rounded-lg">
                Publish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <style>{`.input{width:100%;padding:.6rem .85rem;border-radius:.6rem;border:1px solid rgba(16,24,38,.12);background:#fff}.input:focus{outline:none;border-color:#BC8438}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-charcoal/55 font-semibold">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
