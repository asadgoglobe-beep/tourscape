import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";

/**
 * Uploads an image to the public `media` Supabase Storage bucket and returns
 * its public URL. The bucket + policies are created by the storage SQL
 * (see ADD_STORAGE_RUN_IN_SUPABASE.sql).
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("Please choose an image file (JPG, PNG, WEBP).");
  if (file.size > 8 * 1024 * 1024)
    throw new Error("Image is too large — please use one under 8 MB.");

  const rawExt = file.name.split(".").pop() || "jpg";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const id = crypto.randomUUID();
  const path = `${new Date().getFullYear()}/${id}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) {
    // Most common cause: bucket/policies not created yet.
    throw new Error(
      error.message?.includes("Bucket not found")
        ? "Storage is not set up yet. Run ADD_STORAGE_RUN_IN_SUPABASE.sql in Supabase first."
        : error.message || "Upload failed.",
    );
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
