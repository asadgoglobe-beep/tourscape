import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-bold text-gold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-navy">Page not found</h2>
        <p className="mt-2 text-sm text-charcoal/70">This adventure doesn't exist yet — head back home and explore.</p>
        <Link to="/" className="mt-6 inline-flex btn-gold">Back to home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold text-navy">This page didn't load</h1>
        <p className="mt-2 text-sm text-charcoal/70">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">Try again</button>
          <a href="/" className="px-5 py-3 rounded-lg border border-navy/20 text-navy font-display font-semibold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tripscape Adventures — UAE Tours, Desert Safari & City Experiences" },
      { name: "description", content: "Licensed UAE tour operator. Book desert safaris, Dubai & Abu Dhabi city tours, attractions and bespoke holiday packages. 4.9★ Google rating." },
      { name: "author", content: "Tripscape Adventures" },
      { property: "og:title", content: "Tripscape Adventures — UAE Tours, Desert Safari & City Experiences" },
      { property: "og:description", content: "Licensed UAE tour operator. Book desert safaris, Dubai & Abu Dhabi city tours, attractions and bespoke holiday packages. 4.9★ Google rating." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Tripscape Adventures" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tripscape Adventures — UAE Tours, Desert Safari & City Experiences" },
      { name: "twitter:description", content: "Licensed UAE tour operator. Book desert safaris, Dubai & Abu Dhabi city tours, attractions and bespoke holiday packages. 4.9★ Google rating." },
      { name: "theme-color", content: "#101826" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/X8zg5g27rBODRNwG0cXCdCYfr7c2/social-images/social-1782552575163-Gold.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/X8zg5g27rBODRNwG0cXCdCYfr7c2/social-images/social-1782552575163-Gold.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
