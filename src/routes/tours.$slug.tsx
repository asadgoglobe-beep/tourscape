import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Minus,
  Phone,
  Plus,
  Shield,
  Star,
  X,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { PHONE, WHATSAPP } from "@/lib/site-data";
import { createBookingFn } from "@/lib/booking-actions";

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { tour: data };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.tour;
    if (!t) return { meta: [{ title: "Tour — Tripscape" }] };
    return {
      meta: [
        { title: `${t.title} — Tripscape Adventures` },
        {
          name: "description",
          content: t.summary ?? `Book ${t.title} with Tripscape — licensed UAE tour operator.`,
        },
        { property: "og:title", content: t.title },
        { property: "og:description", content: t.summary ?? "" },
        { property: "og:image", content: t.hero_image ?? "" },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: t.hero_image ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-sand px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-4xl font-bold text-navy">Tour not found</h1>
        <Link to="/tours" className="mt-4 inline-flex btn-gold">
          Browse all tours
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="p-10 text-center">
      <p>Something went wrong.</p>
      <button onClick={reset} className="btn-gold mt-4">
        Retry
      </button>
    </div>
  ),
  component: TourDetail,
});

function TourDetail() {
  const { tour } = Route.useLoaderData();
  const gallery = (
    tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.hero_image]
  ).filter(Boolean) as string[];
  const [activeImg, setActiveImg] = useState(0);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: tour.title,
      description: tour.summary ?? "",
      image: gallery,
      offers: {
        "@type": "Offer",
        priceCurrency: "AED",
        price: tour.price_adult,
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tour.rating ?? 4.9,
        reviewCount: tour.reviews_count ?? 50,
      },
    }),
    [tour, gallery],
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="container-x pt-6 text-sm text-charcoal/60">
        <Link to="/" className="hover:text-gold">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/tours" className="hover:text-gold">
          Tours
        </Link>{" "}
        / <span className="text-navy">{tour.title}</span>
      </div>

      {/* Hero gallery */}
      <section className="container-x py-6">
        <div className="relative aspect-[16/10] md:aspect-[16/8] rounded-2xl overflow-hidden bg-sand">
          <motion.img
            key={activeImg}
            src={gallery[activeImg]}
            alt={tour.title}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-sand transition ${
                  i === activeImg
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-white"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Content + Booking */}
      <section className="container-x py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        <div>
          <div className="flex items-center gap-3 flex-wrap text-sm">
            {tour.category && <span className="badge-gold">{tour.category}</span>}
            {tour.location && (
              <span className="flex items-center gap-1 text-charcoal/65">
                <MapPin size={13} /> {tour.location}
              </span>
            )}
            {tour.duration && (
              <span className="flex items-center gap-1 text-charcoal/65">
                <Clock size={13} /> {tour.duration}
              </span>
            )}
            <span className="flex items-center gap-1 text-charcoal/65">
              <Star size={13} className="text-gold fill-gold" /> {tour.rating?.toFixed(1) ?? "4.9"}{" "}
              · {tour.reviews_count ?? 0} reviews
            </span>
          </div>
          <h1 className="mt-3 font-display font-bold text-3xl md:text-5xl text-navy leading-[1.1]">
            {tour.title}
          </h1>
          {tour.summary && (
            <p className="mt-4 text-lg text-charcoal/75 leading-relaxed">{tour.summary}</p>
          )}

          {tour.description && (
            <div
              className="mt-6 article-content"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />
          )}

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display font-bold text-2xl text-navy">Highlights</h2>
              <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((h: string) => (
                  <li key={h} className="flex gap-3 items-start">
                    <span className="mt-1 h-6 w-6 rounded-full bg-gold/15 grid place-items-center shrink-0">
                      <Check size={13} className="text-gold" />
                    </span>
                    <span className="text-charcoal/85">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display font-bold text-2xl text-navy">Itinerary</h2>
              <ol className="mt-5 relative border-l-2 border-gold/30 pl-6 space-y-6">
                {(
                  tour.itinerary as Array<{
                    time?: string;
                    title?: string;
                    desc?: string;
                    detail?: string;
                  }>
                ).map((step, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[33px] top-1.5 h-5 w-5 rounded-full bg-gold border-4 border-white shadow" />
                    {step.time && (
                      <div className="text-xs uppercase tracking-wider font-semibold text-gold">
                        {step.time}
                      </div>
                    )}
                    <div className="font-display font-semibold text-navy mt-0.5">{step.title}</div>
                    {(step.desc ?? step.detail) && (
                      <p className="text-sm text-charcoal/70 mt-1">{step.desc ?? step.detail}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {tour.inclusions && tour.inclusions.length > 0 && (
              <div className="bg-sand/60 rounded-2xl p-6">
                <h3 className="font-display font-bold text-navy">What's included</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {tour.inclusions.map((x: string) => (
                    <li key={x} className="flex gap-2">
                      <Check size={14} className="text-green-600 mt-0.5 shrink-0" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tour.exclusions && tour.exclusions.length > 0 && (
              <div className="bg-sand/30 rounded-2xl p-6">
                <h3 className="font-display font-bold text-navy">Not included</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {tour.exclusions.map((x: string) => (
                    <li key={x} className="flex gap-2">
                      <X size={14} className="text-red-500 mt-0.5 shrink-0" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* FAQs */}
          {Array.isArray(tour.faqs) && tour.faqs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display font-bold text-2xl text-navy">Frequently asked</h2>
              <div className="mt-5 divide-y divide-black/5 border-y border-black/5">
                {(tour.faqs as Array<{ q: string; a: string }>).map((f, i) => (
                  <FAQ key={i} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          )}
        </div>

        <BookingWidget
          tour={tour as { id: string; title: string; price_adult: number; price_child: number }}
        />
      </section>

      <Footer />
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between gap-4 text-left"
      >
        <span className="font-display font-semibold text-navy">{q}</span>
        <ChevronDown
          size={18}
          className={`text-gold transition shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="pb-5 text-sm text-charcoal/75 leading-relaxed">{a}</p>}
    </div>
  );
}

const bookingSchema = z.object({
  guest_name: z.string().trim().min(2).max(120),
  guest_email: z.string().trim().email().max(200),
  guest_phone: z.string().trim().min(5).max(40),
  notes: z.string().max(2000).optional(),
});

function BookingWidget({
  tour,
}: {
  tour: { id: string; title: string; price_adult: number; price_child: number };
}) {
  const [date, setDate] = useState("");
  const [minDate, setMinDate] = useState("");
  useEffect(() => {
    // Initialise dates on the client only, so server and client first render match.
    setMinDate(format(new Date(), "yyyy-MM-dd"));
    setDate(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  }, []);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"select" | "details">("select");

  const total = adults * Number(tour.price_adult) + children * Number(tour.price_child);

  async function submit(payNow: boolean) {
    const parsed = bookingSchema.safeParse({
      guest_name: name,
      guest_email: email,
      guest_phone: phone,
      notes,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await createBookingFn({
        data: {
          tour_id: tour.id,
          booking_date: date,
          adults,
          children,
          guest_name: name.trim(),
          guest_email: email.trim(),
          guest_phone: phone.trim(),
          notes: notes.trim() || "",
          pay_now: payNow,
        },
      });
      // Pay-now path → redirect to Stripe-hosted checkout.
      if (res.paymentRequired && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }
      toast.success(
        `Booking received! Ref ${res.reference_code} — check your email for confirmation.`,
      );
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setStep("select");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or message us on WhatsApp.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="bg-white rounded-2xl border border-black/5 shadow-soft p-6">
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-wider text-charcoal/55 font-semibold">
            From
          </span>
          <span className="font-display font-bold text-3xl text-gold">
            AED {Number(tour.price_adult).toFixed(0)}
          </span>
          <span className="text-sm text-charcoal/60">/ adult</span>
        </div>

        {step === "select" ? (
          <>
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-charcoal/55 font-semibold flex items-center gap-1.5">
                  <Calendar size={12} /> Date
                </span>
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 w-full h-12 px-4 rounded-xl border border-navy/10 bg-sand/30 focus:border-gold focus:outline-none font-medium text-navy"
                />
              </label>
              <Stepper
                label="Adults"
                value={adults}
                setValue={setAdults}
                min={1}
                max={20}
                sub={`AED ${Number(tour.price_adult).toFixed(0)} each`}
              />
              <Stepper
                label="Children"
                value={children}
                setValue={setChildren}
                min={0}
                max={20}
                sub={`AED ${Number(tour.price_child).toFixed(0)} each (3-11 yrs)`}
              />
            </div>
            <div className="mt-5 pt-5 border-t border-black/5 flex items-center justify-between">
              <span className="text-sm text-charcoal/60">Total</span>
              <span className="font-display font-bold text-2xl text-navy">
                AED {total.toFixed(0)}
              </span>
            </div>
            <button onClick={() => setStep("details")} className="btn-gold w-full mt-5 !rounded-xl">
              Continue to book
            </button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(true);
            }}
            className="mt-5 space-y-3"
          >
            <button
              type="button"
              onClick={() => setStep("select")}
              className="text-xs text-gold font-semibold"
            >
              ← Edit dates / guests
            </button>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              placeholder="Full name"
              className="w-full h-11 px-4 rounded-xl border border-navy/10 focus:border-gold focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
              placeholder="Email address"
              className="w-full h-11 px-4 rounded-xl border border-navy/10 focus:border-gold focus:outline-none"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              minLength={5}
              maxLength={40}
              placeholder="WhatsApp number with country code"
              className="w-full h-11 px-4 rounded-xl border border-navy/10 focus:border-gold focus:outline-none"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              rows={2}
              placeholder="Hotel name, dietary needs, special requests…"
              className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none resize-none"
            />
            <div className="pt-3 border-t border-black/5 flex items-center justify-between">
              <span className="text-sm text-charcoal/60">
                {adults} adult{adults > 1 ? "s" : ""}
                {children > 0 ? ` + ${children} child${children > 1 ? "ren" : ""}` : ""} · {date}
              </span>
              <span className="font-display font-bold text-xl text-navy">
                AED {total.toFixed(0)}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full !rounded-xl disabled:opacity-50"
            >
              {loading ? "Processing…" : `Pay now · AED ${total.toFixed(0)}`}
            </button>
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={loading}
              className="w-full text-center text-sm font-semibold text-navy/70 hover:text-gold transition disabled:opacity-50"
            >
              or reserve now & pay on confirmation
            </button>
            <p className="text-[11px] text-center text-charcoal/55 flex items-center justify-center gap-1.5">
              <Shield size={11} /> Secure Stripe checkout · we confirm within 30 minutes
            </p>
          </form>
        )}

        <div className="mt-5 pt-5 border-t border-black/5 grid grid-cols-2 gap-2">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="text-center py-2.5 rounded-xl bg-[#25D366]/10 text-[#128C7E] font-semibold text-sm hover:bg-[#25D366]/20 transition"
          >
            WhatsApp us
          </a>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="text-center py-2.5 rounded-xl bg-navy/5 text-navy font-semibold text-sm hover:bg-navy/10 transition flex items-center justify-center gap-1.5"
          >
            <Phone size={13} /> Call
          </a>
        </div>
      </div>
    </aside>
  );
}

function Stepper({
  label,
  value,
  setValue,
  min,
  max,
  sub,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-navy/10 bg-sand/30">
      <div>
        <div className="font-display font-semibold text-navy text-sm">{label}</div>
        {sub && <div className="text-[11px] text-charcoal/55">{sub}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          className="h-8 w-8 rounded-full border border-navy/15 grid place-items-center text-navy hover:bg-navy hover:text-white transition disabled:opacity-30"
          disabled={value <= min}
        >
          <Minus size={13} />
        </button>
        <span className="w-6 text-center font-display font-semibold text-navy">{value}</span>
        <button
          type="button"
          onClick={() => setValue(Math.min(max, value + 1))}
          className="h-8 w-8 rounded-full border border-navy/15 grid place-items-center text-navy hover:bg-navy hover:text-white transition disabled:opacity-30"
          disabled={value >= max}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}
