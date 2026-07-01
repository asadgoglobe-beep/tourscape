import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Server-verified role check used by /admin route guards. The decision is made
// on the server from the user's bearer token — the client cannot spoof it.
export const getMyAdminStatusFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getUserRoles } = await import("@/lib/server/roles.server");
    const roles = await getUserRoles(context.userId);
    return {
      isAdmin: roles.includes("admin"),
      isEditor: roles.includes("editor"),
      canManage: roles.includes("admin") || roles.includes("editor"),
    };
  });
