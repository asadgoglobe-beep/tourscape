import { supabase } from "@/integrations/supabase/client";

// Client-side role check for the /admin route guards. It runs in the browser
// (the _authenticated layout is ssr:false), so it uses the logged-in client
// session and does NOT depend on the server-only SUPABASE_SERVICE_ROLE_KEY.
// A logged-in user can read their OWN roles under RLS, which is all we need to
// decide whether to show the dashboard. Real security is still enforced by RLS
// and by server-side assertRole() on every write.
export async function checkCanManage(): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  return (roles ?? []).some((r) => r.role === "admin" || r.role === "editor");
}
