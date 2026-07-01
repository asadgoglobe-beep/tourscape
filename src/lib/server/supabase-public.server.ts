import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Server-side Supabase client using the PUBLISHABLE (anon) key. Subject to RLS.
// Used for public operations such as the create_booking RPC and reading
// published tours — so the booking flow works WITHOUT the service-role key.
// Mirrors the browser client's handling of the new opaque API keys.

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createPublicFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if (isNewSupabaseApiKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

function make() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error("Supabase URL / publishable key is not configured on the server.");
  return createClient<Database>(url, key, {
    global: { fetch: createPublicFetch(key) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let _client: ReturnType<typeof make> | undefined;
export const supabasePublic = new Proxy({} as ReturnType<typeof make>, {
  get(_, prop, receiver) {
    if (!_client) _client = make();
    return Reflect.get(_client, prop, receiver);
  },
});
