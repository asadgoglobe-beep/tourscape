import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

export type ItineraryStep = { time: string; title: string; desc: string };

const fieldCls =
  "w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm focus:border-gold focus:outline-none transition";

function toSteps(value: unknown): ItineraryStep[] {
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
    return {
      time: String(o.time ?? ""),
      title: String(o.title ?? ""),
      desc: String(o.desc ?? o.detail ?? ""),
    };
  });
}

/** Visual editor for a tour itinerary — no JSON required. */
export function ItineraryEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (steps: ItineraryStep[]) => void;
}) {
  const steps = toSteps(value);
  const patch = (i: number, p: Partial<ItineraryStep>) =>
    onChange(steps.map((s, idx) => (idx === i ? { ...s, ...p } : s)));
  const add = () => onChange([...steps, { time: "", title: "", desc: "" }]);
  const remove = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="rounded-xl border border-navy/12 bg-sand/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60">
              <GripVertical size={13} className="text-charcoal/30" /> Step {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <IconBtn title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronUp size={15} />
              </IconBtn>
              <IconBtn
                title="Move down"
                onClick={() => move(i, 1)}
                disabled={i === steps.length - 1}
              >
                <ChevronDown size={15} />
              </IconBtn>
              <IconBtn title="Remove step" onClick={() => remove(i)} danger>
                <Trash2 size={15} />
              </IconBtn>
            </div>
          </div>
          <div className="grid sm:grid-cols-[150px_1fr] gap-2">
            <input
              value={s.time}
              onChange={(e) => patch(i, { time: e.target.value })}
              placeholder="Time / Day"
              className={fieldCls}
            />
            <input
              value={s.title}
              onChange={(e) => patch(i, { title: e.target.value })}
              placeholder="Title (e.g. Hotel pickup)"
              className={fieldCls}
            />
          </div>
          <textarea
            value={s.desc}
            onChange={(e) => patch(i, { desc: e.target.value })}
            placeholder="What happens in this step…"
            rows={2}
            className={`${fieldCls} mt-2`}
          />
        </div>
      ))}
      {steps.length === 0 && (
        <p className="text-xs text-charcoal/50">No steps yet — add the first one below.</p>
      )}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-semibold text-gold hover:bg-gold/10 transition"
      >
        <Plus size={16} /> Add step
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
