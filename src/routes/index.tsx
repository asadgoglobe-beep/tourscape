import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Experiences } from "@/components/sections/Experiences";
import { Destinations } from "@/components/sections/Destinations";
import { Adventures } from "@/components/sections/Adventures";
import { Attractions } from "@/components/sections/Attractions";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { About } from "@/components/sections/About";
import { Reviews } from "@/components/sections/Reviews";
import { Blog } from "@/components/sections/Blog";
import { Support } from "@/components/sections/Support";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tripscape Adventures — UAE Tours, Desert Safari & City Experiences" },
      { name: "description", content: "Licensed Dubai tour operator offering desert safari, city tours, attraction tickets and custom UAE holiday packages. 4.9★ Google, 24/7 WhatsApp support." },
      { property: "og:title", content: "Tripscape Adventures — UAE Tours & Desert Safari" },
      { property: "og:description", content: "Real guides, real reviews, transparent AED pricing. Book your UAE adventure today." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80" },
      { name: "twitter:image", content: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header transparent />
      <main>
        <Hero />
        <TrustStrip />
        <Experiences />
        <Destinations />
        <Adventures />
        <Attractions />
        <PromoBanner />
        <About />
        <Reviews />
        <Blog />
        <Support />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
