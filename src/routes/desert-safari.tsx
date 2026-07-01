import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Experiences } from "@/components/sections/Experiences";

export const Route = createFileRoute("/desert-safari")({
  head: () => ({
    meta: [
      { title: "Dubai Desert Safari Tours — Evening, Morning, Private & Premium | Tripscape" },
      {
        name: "description",
        content:
          "Book Dubai desert safari with 4×4 dune bashing, camel ride, BBQ dinner & live tanoura show. Evening, morning, private and premium VIP options. From AED 89.",
      },
      { property: "og:title", content: "Dubai Desert Safari — Tripscape Adventures" },
      {
        property: "og:description",
        content:
          "Evening, morning, private & premium desert safari tours in Dubai. Licensed operator, real reviews, transparent AED pricing.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="Desert Safari"
      title="The Dubai desert, the way locals do it."
      sub="Evening, morning, private and premium safaris with hand-picked drivers and award-winning camps."
      image="https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1920&q=80"
    >
      <Experiences
        category="Desert Safari"
        eyebrow="Desert Safari"
        title="Choose your desert safari"
        sub="Evening, morning, private and premium safaris — book online with instant confirmation."
      />
    </PageShell>
  ),
});
