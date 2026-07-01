import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logoGold from "@/assets/logo-gold.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Tripscape Adventures" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  password: z.string().min(6, "Min 6 characters").max(72),
  name: z.string().trim().min(2).max(80).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, name: mode === "signup" ? name : undefined });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.invalidate();
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally { setLoading(false); }
  }

  async function google() {
    setLoading(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (res.error) throw res.error;
      if (!res.redirected) { router.invalidate(); navigate({ to: "/" }); }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-sand">
      <div className="hidden md:block relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1400&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/70 via-navy/40 to-gold/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <Link to="/" className="mb-auto"><img src={logoGold} alt="Tripscape" className="h-10 brightness-0 invert" /></Link>
          <h2 className="font-display font-bold text-4xl leading-tight max-w-md">Plan, book and remember your UAE adventure.</h2>
          <p className="mt-3 text-white/80 max-w-md">Sign in to track your bookings, save favourites, and get exclusive WhatsApp-only deals from licensed local guides.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md mx-auto">
          <Link to="/" className="md:hidden inline-block mb-8"><img src={logoGold} alt="Tripscape" className="h-10" /></Link>
          <h1 className="font-display text-3xl font-bold text-navy">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-charcoal/70">{mode === "login" ? "Sign in to manage your bookings." : "Join thousands exploring the UAE with Tripscape."}</p>

          <button onClick={google} disabled={loading} className="mt-8 w-full h-12 rounded-xl border border-navy/15 bg-white hover:bg-sand transition flex items-center justify-center gap-3 font-semibold text-navy disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-charcoal/50"><div className="h-px flex-1 bg-black/10"/>OR<div className="h-px flex-1 bg-black/10"/></div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={80} placeholder="Full name" className="w-full h-12 px-4 rounded-xl border border-navy/15 bg-white focus:border-gold focus:outline-none transition" />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={200} placeholder="Email" className="w-full h-12 px-4 rounded-xl border border-navy/15 bg-white focus:border-gold focus:outline-none transition" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} maxLength={72} placeholder="Password (min 6 chars)" className="w-full h-12 px-4 rounded-xl border border-navy/15 bg-white focus:border-gold focus:outline-none transition" />
            <button type="submit" disabled={loading} className="btn-gold w-full !h-12 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin"/> : <><Mail size={16}/> {mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={14}/></>}
            </button>
          </form>

          <p className="mt-6 text-sm text-charcoal/70 text-center">
            {mode === "login" ? "Don't have an account? " : "Already have one? "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-gold hover:underline">{mode === "login" ? "Sign up" : "Sign in"}</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
