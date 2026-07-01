import { Plus, Trash2, ChevronUp, ChevronDown, HelpCircle } from "lucide-react";

export type Faq = { q: string; a: string };

const fieldCls =
  "w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none transition";

function toFaqs(value: unknown): Faq[] {
  let arr: unknown = value;
  if (typeof value === "string") {
    try {
      arr = JSON.parse(value || "[]");
    } catch {
      arr = [];
    }
  }
  if (!Array.isArray(arr)) return [];
  return arr.map((s) => {
    const o = (s ?? {}) as Record<string, unknown>;
    return { q: String(o.q ?? o.question ?? ""), a: String(o.a ?? o.answer ?? "") };
  });
}

/** Visual editor for tour FAQs — no JSON required. */
export function FaqEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (faqs: Faq[]) => void;
}) {
  const faqs = toFaqs(value);
  const patch = (i: number, p: Partial<Faq>) =>
    onChange(faqs.map((f, idx) => (idx === i ? { ...f, ...p } : f)));
  const add = () => onChange([...faqs, { q: "", a: "" }]);
  const remove = (i: number) => onChange(faqs.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= faqs.length) return;
    const next = [...faqs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl border border-navy/12 bg-sand/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60">
              <HelpCircle size={13} className="text-charcoal/30" /> Question {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <IconBtn title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronUp size={15} />
              </IconBtn>
              <IconBtn
                title="Move down"
                onClick={() => move(i, 1)}
                disabled={i === faqs.length - 1}
              >
                <ChevronDown size={15} />
              </IconBtn>
              <IconBtn title="Remove" onClick={() => remove(i)} danger>
                <Trash2 size={15} />
              </IconBtn>
            </div>
          </div>
          <input
            value={f.q}
            onChange={(e) => patch(i, { q: e.target.value })}
            placeholder="Question (e.g. Is hotel pickup included?)"
            className={fieldCls}
          />
          <textarea
            value={f.a}
            onChange={(e) => patch(i, { a: e.target.value })}
            placeholder="Answer…"
            rows={2}
            className={`${fieldCls} mt-2`}
          />
        </div>
      ))}
      {faqs.length === 0 && (
        <p className="text-xs text-charcoal/50">No questions yet — add the first one below.</p>
      )}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-semibold text-gold hover:bg-gold/10 transition"
      >
        <Plus size={16} /> Add question
      </button>
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  children,
  disabled,
  danger,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`h-7 w-7 grid place-items-center rounded-md transition disabled:opacity-30 ${danger ? "text-red-500 hover:bg-red-50" : "text-charcoal/60 hover:bg-white hover:text-navy"}`}
    >
      {children}
    </button>
  );
}
