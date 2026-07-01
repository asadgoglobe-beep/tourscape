import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, LogOut, MapPin, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkCanManage } from "@/lib/admin-guard";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/_authenticated/admin/")({
  beforeLoad: async () => {
    if (!(await checkCanManage())) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Admin — Tripscape" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ tours: 0, bookings: 0, posts: 0, pending: 0 });
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id);
      const admin = roles?.some((r) => r.role === "admin" || r.role === "editor") ?? false;
      setIsAdmin(admin);
      if (!admin) return;
      const [{ count: tours }, { count: bookings }, { count: posts }, { count: pending }] =
        await Promise.all([
          supabase.from("tours").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
        ]);
      setStats({
        tours: tours ?? 0,
        bookings: bookings ?? 0,
        posts: posts ?? 0,
        pending: pending ?? 0,
      });
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-sand grid place-items-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold text-navy">Admin access only</h1>
          <p className="mt-2 text-charcoal/70">
            Your account doesn't have admin privileges. Contact support if this is wrong.
          </p>
          <Link to="/" className="mt-6 inline-flex btn-gold">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand/40">
      <Header />
      <div className="container-x py-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold text-navy">
              Dashboard
            </h1>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-navy/15 text-navy hover:bg-white transition"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tours", value: stats.tours, icon: MapPin },
            { label: "Bookings", value: stats.bookings, icon: Calendar },
            { label: "Pending", value: stats.pending, icon: Package },
            { label: "Blog posts", value: stats.posts, icon: FileText },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-card"
            >
              <s.icon size={18} className="text-gold" />
              <div className="mt-3 font-display text-3xl font-bold text-navy">{s.value}</div>
              <div className="text-xs uppercase tracking-wider text-charcoal/55 font-semibold mt-1">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <Link
            to="/admin/tours"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition flex items-center justify-between"
          >
            <div>
              <div className="font-display font-bold text-navy">Manage tours</div>
              <div className="text-xs text-charcoal/55 mt-1">
                Create, edit, price and publish tours
              </div>
            </div>
            <span className="text-gold font-semibold">Open →</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition flex items-center justify-between"
          >
            <div>
              <div className="font-display font-bold text-navy">Manage bookings</div>
              <div className="text-xs text-charcoal/55 mt-1">
                Confirm, cancel and export bookings
              </div>
            </div>
            <span className="text-gold font-semibold">Open →</span>
          </Link>
          <Link
            to="/admin/posts"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition flex items-center justify-between"
          >
            <div>
              <div className="font-display font-bold text-navy">Manage blog posts</div>
              <div className="text-xs text-charcoal/55 mt-1">Create, edit and publish articles</div>
            </div>
            <span className="text-gold font-semibold">Open →</span>
          </Link>
          <a
            href="https://wa.me/971549930684"
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition flex items-center justify-between"
          >
            <div>
              <div className="font-display font-bold text-navy">Operations WhatsApp</div>
              <div className="text-xs text-charcoal/55 mt-1">Notify guides about new bookings</div>
            </div>
            <span className="text-gold font-semibold">Open →</span>
          </a>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-navy">Recent bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-semibold text-gold hover:underline">
              View all →
            </Link>
          </div>
          <RecentBookings />
        </div>
      </div>
    </div>
  );
}

function RecentBookings() {
  const [rows, setRows] = useState<
    Array<{
      id: string;
      guest_name: string;
      guest_email: string;
      booking_date: string;
      adults: number;
      status: string;
      reference_code: string;
      tours: { title: string } | null;
    }>
  >([]);
  useEffect(() => {
    supabase
      .from("bookings")
      .select(
        "id, guest_name, guest_email, booking_date, adults, status, reference_code, tours(title)",
      )
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setRows((data as unknown as typeof rows) ?? []));
  }, []);
  if (!rows.length) return <p className="mt-4 text-sm text-charcoal/60">No bookings yet.</p>;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-charcoal/55 font-semibold border-b border-black/5">
          <tr>
            <th className="py-3">Ref</th>
            <th>Guest</th>
            <th>Tour</th>
            <th>Date</th>
            <th>Pax</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-black/5">
              <td className="py-3 font-mono text-xs text-gold">{r.reference_code}</td>
              <td>
                <div className="font-semibold text-navy">{r.guest_name}</div>
                <div className="text-xs text-charcoal/55">{r.guest_email}</div>
              </td>
              <td>{r.tours?.title ?? "—"}</td>
              <td>{r.booking_date}</td>
              <td>{r.adults}</td>
              <td>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${r.status === "confirmed" ? "bg-green-100 text-green-700" : r.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
