import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { About as AboutSection } from "@/components/sections/About";
import { Reviews } from "@/components/sections/Reviews";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Tripscape Adventures — Licensed UAE Tour Operator" },
    { name: "description", content: "Meet the team behind Tripscape Adventures: a Dubai-based, fully licensed UAE tour operator with 7+ years experience and 12,000+ happy travellers." },
    { property: "og:image", content: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80" },
  ]}),
  component: () => (
    <PageShell eyebrow="About Us" title="Locals who love what they do." sub="A Dubai-based team of guides, drivers and concierges — building real itineraries since 2018."
      image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80">
      <AboutSection />
      <Reviews />
    </PageShell>
  ),
});
