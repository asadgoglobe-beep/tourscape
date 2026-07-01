import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Experiences } from "@/components/sections/Experiences";

export const Route = createFileRoute("/attractions")({
  head: () => ({
    meta: [
      { title: "Dubai Attractions & Tickets — Burj Khalifa, Museum of the Future | Tripscape" },
      {
        name: "description",
        content:
          "Skip-the-line tickets to Dubai's top attractions: Burj Khalifa, Museum of the Future, Aquarium, AYA Universe, IMG Worlds & Miracle Garden.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1582034986517-30d162d9a16e?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Tickets & Attractions"
      title="UAE icons, ticket included."
      sub="Instant skip-the-line e-tickets to Dubai's must-see attractions."
      image="https://images.unsplash.com/photo-1582034986517-30d162d9a16e?auto=format&fit=crop&w=1920&q=80"
    >
      <Experiences
        category="Attractions"
        eyebrow="Tickets & Attractions"
        title="Skip-the-line attraction tickets"
        sub="Instant e-tickets to the UAE must-see attractions."
      />
    </PageShell>
  ),
});
