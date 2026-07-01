import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkCanManage } from "@/lib/admin-guard";

// Layout for the whole /admin section. This guard protects every admin page:
//   /admin           -> admin.index.tsx (dashboard)
//   /admin/tours     -> admin.tours.tsx
//   /admin/bookings  -> admin.bookings.tsx
//   /admin/posts     -> admin.posts.tsx
// Each child renders its own Header, so the layout is just a guarded Outlet.
export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    if (!(await checkCanManage())) throw redirect({ to: "/" });
  },
  component: () => <Outlet />,
});
