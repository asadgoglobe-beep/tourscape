import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, MessageCircle, Phone, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { PHONE, WHATSAPP } from "@/lib/site-data";

export const Route = createFileRoute("/enquire-now")({
  head: () => ({
    meta: [
      { title: "Book or Enquire — Tripscape Adventures" },
      {
        name: "description",
        content:
          "Tell us your dates and the experience you want — we'll send back a custom UAE itinerary in AED, usually the same day. No deposit to enquire.",
      },
    ],
  }),
  component: EnquirePage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  travel_dates: z.string().trim().max(120).optional().or(z.literal("")),
  tour_type: z.string().max(60),
  guests: z.string().max(10).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const TOUR_TYPES = [
  "Desert Safari",
  "City Tour",
  "Attractions",
  "Premium Experience",
  "Holiday Package",
  "Custom Itinerary",
];

const PERKS = [
  "Free, no-obligation quote in AED",
  "Usually a same-day reply",
  "Flexible dates & group sizes",
  "Licensed guides, hotel pickup included",
];

const inputCls =
  "mt-1.5 w-full h-12 px-4 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition";
const labelCls = "text-[12px] font-semibold uppercase tracking-wider text-charcoal/70";

function EnquirePage() {
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travel_dates: "",
    tour_type: TOUR_TYPES[0],
    guests: "",
    message: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    // Fold the guest count into the message so it reaches the team without a schema change.
    const guestLine = parsed.data.guests ? `Guests: ${parsed.data.guests}. ` : "";
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      travel_dates: parsed.data.travel_dates || null,
      tour_type: parsed.data.tour_type,
      message: (guestLine + (parsed.data.message || "")).trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Something went wrong — please try WhatsApp instead.");
      return;
    }
    toast.success("Enquiry sent! We'll be in touch shortly.");
    setSent(true);
  }

  return (
    <PageShell
      eyebrow="Book / Enquire"
      title="Tell us your trip — we'll do the rest."
      sub="Share your dates and what you'd love to do. We'll send a tailored plan in AED, usually the same day. Enquiring is free and there's no deposit to ask."
      image="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80"
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10">
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-card"
        >
          {sent ? (
            <div className="py-12 text-center">
              <div className="h-14 w-14 rounded-full bg-gold mx-auto grid place-items-center text-white">
                <Check />
              </div>
              <h3 className="mt-4 font-display font-bold text-2xl text-navy">Enquiry received</h3>
              <p className="mt-2 text-charcoal/70 max-w-sm mx-auto">
                Thank you — our team will reply within 60 minutes during UAE hours. Need it sooner?
                Message us on WhatsApp and we'll jump straight on it.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="btn-gold mt-6 !bg-[#25D366] hover:!bg-[#1ebd5a]"
              >
                <MessageCircle size={16} /> Continue on WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className={labelCls}>Full name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Phone / WhatsApp</span>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Preferred date</span>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.travel_dates}
                  onChange={(e) => set("travel_dates", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>Experience</span>
                <select
                  value={form.tour_type}
                  onChange={(e) => set("tour_type", e.target.value)}
                  className={`${inputCls} bg-white`}
                >
                  {TOUR_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelCls}>Number of guests</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={form.guests}
                  onChange={(e) => set("guests", e.target.value)}
                  placeholder="e.g. 2"
                  className={inputCls}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={labelCls}>Anything else? (optional)</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Hotel name, occasion, dietary needs, must-sees…"
                  className="mt-1.5 w-full px-4 py-3 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition resize-none"
                />
              </label>
              <button
                disabled={saving}
                className="btn-gold sm:col-span-2 !w-full disabled:opacity-60"
              >
                <Send size={15} /> {saving ? "Sending…" : "Send my enquiry"}
              </button>
              <p className="sm:col-span-2 text-center text-xs text-charcoal/50">
                No payment needed to enquire. We'll confirm availability and price first.
              </p>
            </div>
          )}
        </form>

        <div className="space-y-4">
          <div className="bg-navy text-white rounded-2xl p-6">
            <h3 className="font-display font-bold text-xl">Why book with Tripscape</h3>
            <ul className="mt-4 space-y-3">
              {PERKS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/85 text-sm">
                  <span className="mt-0.5 h-5 w-5 rounded-full bg-gold/20 text-gold grid place-items-center shrink-0">
                    <Check size={13} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-gold w-full !bg-[#25D366] hover:!bg-[#1ebd5a]"
          >
            <MessageCircle size={16} /> Chat instantly on WhatsApp
          </a>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 p-4 bg-sand/60 rounded-2xl hover:bg-sand transition font-display font-semibold text-navy"
          >
            <Phone size={16} /> {PHONE}
          </a>
        </div>
      </div>
    </PageShell>
  );
}
