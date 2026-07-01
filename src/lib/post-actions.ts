import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const postInput = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().max(400).optional().nullable(),
  cover_image: z.string().url().max(600).optional().or(z.literal("")).nullable(),
  content: z.string().max(50000).default(""),
  tags: z.array(z.string().max(60)).max(20).default([]),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  is_published: z.boolean().default(false),
});

export const savePostFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => postInput.parse(d))
  .handler(async ({ data, context }) => {
    const { assertRole } = await import("@/lib/server/roles.server");
    await assertRole(context.userId, ["admin", "editor"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || null,
      cover_image: data.cover_image || null,
      content: data.content,
      tags: data.tags,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      author_id: context.userId,
      is_published: data.is_published,
      published_at: data.is_published ? new Date().toISOString() : null,
    };

    const res = data.id
      ? await supabaseAdmin.from("posts").update(payload).eq("id", data.id).select("id").single()
      : await supabaseAdmin.from("posts").insert(payload).select("id").single();
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const, id: res.data.id };
  });

export const deletePostFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { assertRole } = await import("@/lib/server/roles.server");
    await assertRole(context.userId, ["admin", "editor"]);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
