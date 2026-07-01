import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL, PHONE, WHATSAPP } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Tripscape Adventures — Plan Your UAE Trip" },
      {
        name: "description",
        content:
          "Contact our Dubai-based team via WhatsApp, phone, email or form. 24/7 support, replies in under 60 seconds.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  travel_dates: z.string().trim().max(120).optional().or(z.literal("")),
  tour_type: z.string().max(60),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const TOUR_TYPES = [
  "Desert Safari",
  "City Tour",
  "Attractions",
  "Holiday Package",
  "Custom Itinerary",
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travel_dates: "",
    tour_type: TOUR_TYPES[0],
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
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      travel_dates: parsed.data.travel_dates || null,
      tour_type: parsed.data.tour_type,
      message: parsed.data.message || null,
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
      eyebrow="Contact"
      title="Plan your perfect UAE trip."
      sub="Tell us your dates and what you love — we'll send back a custom itinerary in AED, usually the same day."
      image="https://images.unsplash.com/photo-1582672060674-bc2bd808a8f5?auto=format&fit=crop&w=1920&q=80"
    >
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10">
        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-card"
        >
          {sent ? (
            <div className="py-12 text-center">
              <div className="h-14 w-14 rounded-full bg-gold mx-auto grid place-items-center text-white">
                <Send />
              </div>
              <h3 className="mt-4 font-display font-bold text-2xl text-navy">Message sent</h3>
              <p className="mt-2 text-charcoal/70">
                We'll be back to you within 60 minutes during UAE hours, or by WhatsApp instantly.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/70">
                  Full name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="mt-1.5 w-full h-12 px-4 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/70">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="mt-1.5 w-full h-12 px-4 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/70">
                  Phone / WhatsApp
                </span>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="mt-1.5 w-full h-12 px-4 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/70">
                  Preferred date
                </span>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.travel_dates}
                  onChange={(e) => set("travel_dates", e.target.value)}
                  className="mt-1.5 w-full h-12 px-4 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/70">
                  Tour type
                </span>
                <select
                  value={form.tour_type}
                  onChange={(e) => set("tour_type", e.target.value)}
                  className="mt-1.5 w-full h-12 px-4 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition bg-white"
                >
                  {TOUR_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/70">
                  Tell us about your trip
                </span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 rounded-lg border border-black/10 focus:border-gold focus:outline-none transition resize-none"
                />
              </label>
              <button
                disabled={saving}
                className="btn-gold sm:col-span-2 !w-full disabled:opacity-60"
              >
                <Send size={15} /> {saving ? "Sending…" : "Send enquiry"}
              </button>
            </div>
          )}
        </form>
        <div className="space-y-4">
          {[
            { Icon: Phone, label: "Phone", value: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
            { Icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
            {
              Icon: MapPin,
              label: "Office",
              value: "Office 1204, Business Bay, Dubai, UAE",
              href: "#",
            },
          ].map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-start gap-4 p-5 bg-sand/50 rounded-2xl hover:bg-sand transition"
            >
              <div className="h-11 w-11 rounded-xl bg-gold/15 text-gold grid place-items-center shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">
                  {label}
                </div>
                <div className="font-display font-semibold text-navy">{value}</div>
              </div>
            </a>
          ))}
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-gold w-full !bg-[#25D366] hover:!bg-[#1ebd5a]"
          >
            Chat instantly on WhatsApp
          </a>
          <iframe
            title="Tripscape office map"
            className="w-full h-64 rounded-2xl border-0"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28852.92!2d55.27!3d25.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEwJzQ4LjAiTiA1NcKwMTYnMTIuMCJF!5e0!3m2!1sen!2sae!4v0000000000"
          />
        </div>
      </div>
    </PageShell>
  );
}
