import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NavTour = {
  slug: string;
  title: string;
  category: string | null;
  price_adult: number;
  hero_image: string | null;
  duration: string | null;
  summary: string | null;
};

// Module-level cache so the desktop mega-menu, the mobile drawer and the home
// sections share a single fetch. Only ever written on the client (inside the
// effect), so it is safe under SSR (stays empty on the server).
let cache: NavTour[] | null = null;
let inflight: Promise<NavTour[]> | null = null;

async function loadNavTours(): Promise<NavTour[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = (async () => {
      const { data } = await supabase
        .from("tours")
        .select("slug, title, category, price_adult, hero_image, duration, summary")
        .eq("is_published", true)
        .order("rating", { ascending: false });
      const rows = (data as NavTour[] | null) ?? [];
      cache = rows;
      return rows;
    })();
  }
  return inflight;
}

export function useNavTours() {
  const [tours, setTours] = useState<NavTour[]>(cache ?? []);

  useEffect(() => {
    let active = true;
    loadNavTours().then((t) => {
      if (active) setTours(t);
    });
    return () => {
      active = false;
    };
  }, []);

  const byCategory = (category: string) => tours.filter((t) => t.category === category);

  return { tours, byCategory, loading: tours.length === 0 };
}
