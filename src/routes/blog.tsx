import { createFileRoute, Outlet } from "@tanstack/react-router";

// Layout route for /blog. Renders the matched child:
//   /blog        -> blog.index.tsx (the listing)
//   /blog/$slug  -> blog.$slug.tsx (the article)
export const Route = createFileRoute("/blog")({
  component: () => <Outlet />,
});
