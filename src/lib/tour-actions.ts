import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const itineraryStep = z.object({
  time: z.string().max(40).optional(),
  title: z.string().max(160).optional(),
  desc: z.string().max(1000).optional(),
  detail: z.string().max(1000).optional(),
});
const faqItem = z.object({ q: z.string().max(300), a: z.string().max(2000) });

const tourInput = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(3).max(200),
  summary: z.string().max(400).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  hero_image: z.string().url().max(600).optional().or(z.literal("")).nullable(),
  gallery: z.array(z.string().url().max(600)).max(20).default([]),
  price_adult: z.number().min(0).max(100000),
  price_child: z.number().min(0).max(100000),
  duration: z.string().max(60).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  category: z.string().max(60),
  highlights: z.array(z.string().max(300)).max(30).default([]),
  inclusions: z.array(z.string().max(300)).max(30).default([]),
  exclusions: z.array(z.string().max(300)).max(30).default([]),
  itinerary: z.array(itineraryStep).max(40).default([]),
  faqs: z.array(faqItem).max(30).default([]),
  rating: z.number().min(0).max(5).default(4.9),
  reviews_count: z.number().int().min(0).max(1000000).default(0),
  is_published: z.boolean().default(false),
});

export const saveTourFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => tourInput.parse(d))
  .handler(async ({ data, context }) => {
    const { assertRole } = await import("@/lib/server/roles.server");
    await assertRole(context.userId, ["admin", "editor"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload = {
      slug: data.slug,
      title: data.title,
      summary: data.summary || null,
      description: data.description || null,
      hero_image: data.hero_image || null,
      gallery: data.gallery,
      price_adult: data.price_adult,
      price_child: data.price_child,
      duration: data.duration || null,
      location: data.location || null,
      category: data.category,
      highlights: data.highlights,
      inclusions: data.inclusions,
      exclusions: data.exclusions,
      itinerary: data.itinerary,
      faqs: data.faqs,
      rating: data.rating,
      reviews_count: data.reviews_count,
      is_published: data.is_published,
    };

    const res = data.id
      ? await supabaseAdmin.from("tours").update(payload).eq("id", data.id).select("id").single()
      : await supabaseAdmin.from("tours").insert(payload).select("id").single();
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const, id: res.data.id };
  });

export const deleteTourFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { assertRole } = await import("@/lib/server/roles.server");
    await assertRole(context.userId, ["admin", "editor"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tours").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
