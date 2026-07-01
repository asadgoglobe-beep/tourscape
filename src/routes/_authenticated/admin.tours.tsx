import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveTourFn, deleteTourFn } from "@/lib/tour-actions";
import { checkCanManage } from "@/lib/admin-guard";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ItineraryEditor } from "@/components/admin/ItineraryEditor";
import { FaqEditor } from "@/components/admin/FaqEditor";

export const Route = createFileRoute("/_authenticated/admin/tours")({
  beforeLoad: async () => {
    if (!(await checkCanManage())) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Tours — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminTours,
});

type Tour = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  hero_image: string | null;
  gallery: string[] | null;
  price_adult: number;
  price_child: number;
  duration: string | null;
  location: string | null;
  category: string | null;
  highlights: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  itinerary: unknown;
  faqs: unknown;
  is_published: boolean;
  rating: number | null;
  reviews_count: number | null;
};

const CATEGORIES = ["Desert Safari", "Adventures", "City Tours", "Attractions", "Packages"];

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "slug: lowercase-hyphens only"),
  title: z.string().trim().min(3).max(200),
  summary: z.string().max(400).optional().or(z.literal("")),
  description: z.string().max(8000).optional().or(z.literal("")),
  hero_image: z.string().url().max(600).optional().or(z.literal("")),
  price_adult: z.number().min(0).max(100000),
  price_child: z.number().min(0).max(100000),
  duration: z.string().max(60).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  category: z.string().max(60),
});

function emptyTour(): Tour {
  return {
    id: "",
    slug: "",
    title: "",
    summary: "",
    description: "",
    hero_image: "",
    gallery: [],
    price_adult: 0,
    price_child: 0,
    duration: "",
    location: "",
    category: CATEGORIES[0],
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: [],
    faqs: [],
    is_published: false,
    rating: 4.9,
    reviews_count: 0,
  };
}

function AdminTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [active, setActive] = useState<Tour | null>(null);
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
      .from("tours")
      .select("*")
      .order("created_at", { ascending: false });
    setTours((data as Tour[]) ?? []);
  }

  async function save(t: Tour, publish: boolean) {
    const parsed = schema.safeParse({
      slug: t.slug,
      title: t.title,
      summary: t.summary ?? "",
      description: t.description ?? "",
      hero_image: t.hero_image ?? "",
      price_adult: Number(t.price_adult) || 0,
      price_child: Number(t.price_child) || 0,
      duration: t.duration ?? "",
      location: t.location ?? "",
      category: t.category ?? CATEGORIES[0],
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    // Validate JSON fields client-side for fast feedback (server re-validates)
    let itinerary: unknown = [],
      faqs: unknown = [];
    try {
      itinerary =
        typeof t.itinerary === "string" ? JSON.parse(t.itinerary || "[]") : (t.itinerary ?? []);
    } catch {
      toast.error("Itinerary must be valid JSON");
      return;
    }
    try {
      faqs = typeof t.faqs === "string" ? JSON.parse(t.faqs || "[]") : (t.faqs ?? []);
    } catch {
      toast.error("FAQs must be valid JSON");
      return;
    }
    if (!Array.isArray(itinerary)) {
      toast.error("Itinerary must be a JSON array");
      return;
    }
    if (!Array.isArray(faqs)) {
      toast.error("FAQs must be a JSON array");
      return;
    }

    try {
      await saveTourFn({
        data: {
          id: t.id || undefined,
          slug: parsed.data.slug,
          title: parsed.data.title,
          summary: parsed.data.summary || null,
          description: parsed.data.description || null,
          hero_image: parsed.data.hero_image || null,
          gallery: (t.gallery ?? []).filter(Boolean),
          price_adult: parsed.data.price_adult,
          price_child: parsed.data.price_child,
          duration: parsed.data.duration || null,
          location: parsed.data.location || null,
          category: parsed.data.category,
          highlights: (t.highlights ?? []).filter(Boolean),
          inclusions: (t.inclusions ?? []).filter(Boolean),
          exclusions: (t.exclusions ?? []).filter(Boolean),
          itinerary,
          faqs,
          rating: Number(t.rating) || 4.9,
          reviews_count: Number(t.reviews_count) || 0,
          is_published: publish,
        },
      });
      toast.success(publish ? "Tour published" : "Saved as draft");
      setActive(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this tour? Existing bookings reference it and may block deletion."))
      return;
    try {
      await deleteTourFn({ data: { id } });
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
          <h1 className="font-display text-3xl font-bold text-navy">Tours</h1>
          <button onClick={() => setActive(emptyTour())} className="btn-gold !rounded-xl">
            <Plus size={14} /> New tour
          </button>
        </div>

        <div className="mt-8 grid gap-3">
          {tours.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 shadow-card flex items-center gap-4 flex-wrap"
            >
              {t.hero_image && (
                <img
                  src={t.hero_image}
                  alt=""
                  className="h-14 w-20 rounded-lg object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${t.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {t.is_published ? "Published" : "Draft"}
                  </span>
                  {t.category && (
                    <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-sand text-navy/70">
                      {t.category}
                    </span>
                  )}
                  <span className="text-xs text-charcoal/55 truncate">/tours/{t.slug}</span>
                </div>
                <h3 className="mt-1 font-display font-semibold text-navy truncate">{t.title}</h3>
                <div className="text-xs text-charcoal/55 mt-0.5">
                  AED {t.price_adult} adult · AED {t.price_child} child
                  {t.duration ? ` · ${t.duration}` : ""}
                </div>
              </div>
              <button
                onClick={() => setActive(t)}
                className="px-3 py-1.5 rounded-lg border border-navy/15 text-sm text-navy hover:bg-sand"
              >
                Edit
              </button>
              <button
                onClick={() => remove(t.id)}
                className="h-9 w-9 grid place-items-center rounded-lg text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {tours.length === 0 && (
            <p className="text-charcoal/55 text-sm">No tours yet — create your first one.</p>
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
              {active.id ? "Edit tour" : "New tour"}
            </h2>
            <div className="mt-5 grid gap-3">
              <Field label="Title">
                <input
                  value={active.title}
                  onChange={(e) => setActive({ ...active, title: e.target.value })}
                  className="ti"
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Slug (URL)">
                  <input
                    value={active.slug}
                    onChange={(e) =>
                      setActive({
                        ...active,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className="ti"
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={active.category ?? CATEGORIES[0]}
                    onChange={(e) => setActive({ ...active, category: e.target.value })}
                    className="ti bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Price — adult (AED)">
                  <input
                    type="number"
                    value={active.price_adult}
                    onChange={(e) => setActive({ ...active, price_adult: Number(e.target.value) })}
                    className="ti"
                  />
                </Field>
                <Field label="Price — child (AED)">
                  <input
                    type="number"
                    value={active.price_child}
                    onChange={(e) => setActive({ ...active, price_child: Number(e.target.value) })}
                    className="ti"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Duration">
                  <input
                    value={active.duration ?? ""}
                    onChange={(e) => setActive({ ...active, duration: e.target.value })}
                    placeholder="e.g. 6 hours"
                    className="ti"
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={active.location ?? ""}
                    onChange={(e) => setActive({ ...active, location: e.target.value })}
                    placeholder="e.g. Lahbab Desert, Dubai"
                    className="ti"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Rating (0–5)">
                  <input
                    type="number"
                    step="0.1"
                    value={active.rating ?? 0}
                    onChange={(e) => setActive({ ...active, rating: Number(e.target.value) })}
                    className="ti"
                  />
                </Field>
                <Field label="Reviews count">
                  <input
                    type="number"
                    value={active.reviews_count ?? 0}
                    onChange={(e) =>
                      setActive({ ...active, reviews_count: Number(e.target.value) })
                    }
                    className="ti"
                  />
                </Field>
              </div>
              <Field label="Hero image">
                <ImageUpload
                  value={active.hero_image ?? ""}
                  onChange={(url) => setActive({ ...active, hero_image: url })}
                />
              </Field>
              <Field label="Summary (short tagline)">
                <textarea
                  value={active.summary ?? ""}
                  onChange={(e) => setActive({ ...active, summary: e.target.value })}
                  maxLength={400}
                  rows={2}
                  className="ti"
                />
              </Field>
              <Field label="Description">
                <RichTextEditor
                  value={active.description ?? ""}
                  onChange={(html) => setActive({ ...active, description: html })}
                  minHeight={240}
                />
              </Field>

              <Field label="Gallery images">
                <GalleryUpload
                  value={active.gallery ?? []}
                  onChange={(urls) => setActive({ ...active, gallery: urls })}
                />
              </Field>
              <ArrayField
                label="Highlights (one per line)"
                value={active.highlights ?? []}
                onChange={(v) => setActive({ ...active, highlights: v })}
              />
              <ArrayField
                label="Inclusions (one per line)"
                value={active.inclusions ?? []}
                onChange={(v) => setActive({ ...active, inclusions: v })}
              />
              <ArrayField
                label="Exclusions (one per line)"
                value={active.exclusions ?? []}
                onChange={(v) => setActive({ ...active, exclusions: v })}
              />

              <Field label="Itinerary">
                <ItineraryEditor
                  value={active.itinerary}
                  onChange={(v) => setActive({ ...active, itinerary: v })}
                />
              </Field>
              <Field label="FAQs">
                <FaqEditor
                  value={active.faqs}
                  onChange={(v) => setActive({ ...active, faqs: v })}
                />
              </Field>
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

      <style>{`.ti{width:100%;padding:.6rem .85rem;border-radius:.6rem;border:1px solid rgba(16,24,38,.12);background:#fff}.ti:focus{outline:none;border-color:#BC8438}`}</style>
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

function ArrayField({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  mono?: boolean;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        rows={Math.min(8, Math.max(3, value.length + 1))}
        className={`ti ${mono ? "font-mono text-xs" : ""}`}
      />
    </Field>
  );
}
