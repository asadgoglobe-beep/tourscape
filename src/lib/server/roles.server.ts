// Server-only. Role checks for privileged server functions.
// Imported dynamically from inside server-fn handlers so it never ships to the client bundle.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AppRole = "admin" | "editor" | "user";

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error("Could not verify permissions");
  return (data ?? []).map((r) => r.role as AppRole);
}

/** Throws if the user does not hold at least one of the allowed roles. */
export async function assertRole(userId: string, allowed: AppRole[]): Promise<void> {
  const roles = await getUserRoles(userId);
  const ok = roles.some((r) => allowed.includes(r));
  if (!ok) throw new Error("Forbidden: you do not have permission to perform this action");
}
