import { useRef, useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

/** Multi-image gallery uploader with thumbnails and per-image remove. */
export function GalleryUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} added`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative group aspect-square rounded-lg overflow-hidden border border-black/10"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove image"
              className="absolute top-1.5 right-1.5 h-7 w-7 grid place-items-center rounded-md bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition shadow"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="aspect-square rounded-lg border-2 border-dashed border-navy/20 hover:border-gold hover:bg-sand/50 grid place-items-center text-charcoal/60 transition disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="animate-spin text-gold" />
          ) : (
            <div className="text-center">
              <Plus size={20} className="mx-auto text-gold" />
              <div className="text-[11px] mt-1 font-semibold">Add</div>
            </div>
          )}
        </button>
      </div>
      {value.length === 0 && (
        <p className="mt-2 text-xs text-charcoal/50">
          No gallery images yet — click “Add” to upload.
        </p>
      )}
    </div>
  );
}
