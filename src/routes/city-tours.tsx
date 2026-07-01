import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Experiences } from "@/components/sections/Experiences";

export const Route = createFileRoute("/city-tours")({
  head: () => ({
    meta: [
      { title: "UAE City Tours — Dubai, Abu Dhabi, Sharjah, RAK & Fujairah | Tripscape" },
      {
        name: "description",
        content:
          "Guided city tours across all seven emirates. Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, Fujairah and Al Ain — book private or shared.",
      },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  }),
  component: () => (
    <PageShell
      eyebrow="City Tours"
      title="Seven emirates, one trusted operator."
      sub="Half-day, full-day and multi-day guided tours across the UAE."
      image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80"
    >
      <Experiences
        category="City Tours"
        eyebrow="City Tours"
        title="Guided tours across the UAE"
        sub="Half-day, full-day and multi-day city tours with licensed guides."
      />
    </PageShell>
  ),
});
