import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route for /tours. Renders the matched child:
//   /tours          -> tours.index.tsx (the listing)
//   /tours/$slug     -> tours.$slug.tsx (the detail page)
// Each child brings its own Header/Footer, so this layout is just an Outlet.
export const Route = createFileRoute("/tours")({
  component: () => <Outlet />,
});
