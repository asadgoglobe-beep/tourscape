import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Experiences } from "@/components/sections/Experiences";

export const Route = createFileRoute("/adventures")({
  head: () => ({
    meta: [
      { title: "Dubai Adventure Tours — Dune Buggy, Quad Bike, Sandboarding | Tripscape" },
      {
        name: "description",
        content:
          "Adrenaline-packed UAE adventures: dune buggy, quad bike, dune bashing, sandboarding, camel riding and hot air balloon rides over Dubai.",
      },
      { property: "og:title", content: "Dubai Adventures — Tripscape" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1599580546666-c0c08c3c4c1c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Adventures"
      title="Adrenaline meets the desert."
      sub="Buggies, quads, sandboards and sunrise balloons — pick your level of thrill."
      image="https://images.unsplash.com/photo-1599580546666-c0c08c3c4c1c?auto=format&fit=crop&w=1920&q=80"
    >
      <Experiences
        category="Adventures"
        eyebrow="Adventures"
        title="Pick your desert thrill"
        sub="Dune buggies, quad bikes, sandboarding and balloons — book online in minutes."
      />
    </PageShell>
  ),
});
