import { useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

/** Single-image uploader with preview, replace and remove. */
export function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {value ? (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt=""
            className="w-full aspect-[16/10] object-cover rounded-xl border border-black/10"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="h-8 px-2.5 rounded-lg bg-white/95 text-navy text-xs font-semibold shadow hover:bg-white disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="h-8 w-8 grid place-items-center rounded-lg bg-white/95 text-red-600 shadow hover:bg-white"
              aria-label="Remove image"
            >
              <X size={15} />
            </button>
          </div>
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-white/60 rounded-xl">
              <Loader2 className="animate-spin text-gold" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          disabled={busy}
          className={`w-full max-w-xs aspect-[16/10] rounded-xl border-2 border-dashed grid place-items-center text-center transition ${drag ? "border-gold bg-gold/5" : "border-navy/20 hover:border-gold hover:bg-sand/50"}`}
        >
          {busy ? (
            <Loader2 className="animate-spin text-gold" />
          ) : (
            <div className="text-charcoal/60">
              <UploadCloud size={22} className="mx-auto mb-1.5 text-gold" />
              <div className="text-sm font-semibold text-navy">Upload image</div>
              <div className="text-xs mt-0.5">
                Click or drag &amp; drop · JPG/PNG/WEBP · max 8MB
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
