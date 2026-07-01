import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updateBookingStatusFn } from "@/lib/booking-actions";
import { checkCanManage } from "@/lib/admin-guard";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  beforeLoad: async () => {
    if (!(await checkCanManage())) throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Bookings — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminBookings,
});

type Status = "pending" | "confirmed" | "cancelled" | "completed";
type Booking = {
  id: string;
  reference_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  booking_date: string;
  adults: number;
  children: number;
  total_amount: number;
  status: Status;
  payment_status: "unpaid" | "paid" | "refunded" | "failed";
  notes: string | null;
  created_at: string;
  tours: { title: string } | null;
};

const STATUSES: Status[] = ["pending", "confirmed", "cancelled", "completed"];
const FILTERS: Array<Status | "all"> = ["all", ...STATUSES];

const statusClass: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

function AdminBookings() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user?.id ?? "");
      setAllowed(roles?.some((r) => r.role === "admin") ?? false);
      load();
    })();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select(
        "id, reference_code, guest_name, guest_email, guest_phone, booking_date, adults, children, total_amount, status, payment_status, notes, created_at, tours(title)",
      )
      .order("created_at", { ascending: false });
    setRows((data as unknown as Booking[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Status) {
    // optimistic
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await updateBookingStatusFn({ data: { bookingId: id, status } });
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
      load();
    }
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!needle) return true;
      return [
        r.guest_name,
        r.guest_email,
        r.guest_phone,
        r.reference_code,
        r.tours?.title ?? "",
      ].some((v) => v.toLowerCase().includes(needle));
    });
  }, [rows, filter, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of STATUSES) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows]);

  function exportCsv() {
    const headers = [
      "Reference",
      "Guest",
      "Email",
      "Phone",
      "Tour",
      "Date",
      "Adults",
      "Children",
      "Amount (AED)",
      "Status",
      "Notes",
      "Created",
    ];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = filtered.map((r) =>
      [
        r.reference_code,
        r.guest_name,
        r.guest_email,
        r.guest_phone,
        r.tours?.title ?? "",
        r.booking_date,
        r.adults,
        r.children,
        r.total_amount,
        r.status,
        r.notes ?? "",
        new Date(r.created_at).toISOString(),
      ]
        .map(esc)
        .join(","),
    );
    const csv = [headers.map(esc).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (allowed === false)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-navy">Admins only</h1>
          <Link to="/" className="mt-4 inline-flex btn-gold">
            Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-sand/40">
      <Header />
      <div className="container-x py-10">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-charcoal/70 hover:text-gold"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display text-3xl font-bold text-navy">Bookings</h1>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-navy/15 text-navy hover:bg-white transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize transition ${filter === f ? "bg-navy text-white" : "bg-white text-navy/70 hover:bg-sand border border-black/5"}`}
            >
              {f} <span className="opacity-60">({counts[f] ?? 0})</span>
            </button>
          ))}
          <div className="relative ml-auto">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guest, ref, tour…"
              className="h-9 pl-9 pr-3 rounded-lg border border-black/10 bg-white text-sm focus:border-gold focus:outline-none w-64 max-w-full"
            />
          </div>
        </div>

        <div className="mt-5 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-charcoal/55 font-semibold border-b border-black/5">
                <tr>
                  <th className="py-3 px-5">Ref</th>
                  <th>Guest</th>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Pax</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="pr-5">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-black/5 align-top">
                    <td className="py-4 px-5 font-mono text-xs text-gold whitespace-nowrap">
                      {r.reference_code}
                    </td>
                    <td>
                      <div className="font-semibold text-navy">{r.guest_name}</div>
                      <div className="text-xs text-charcoal/55">{r.guest_email}</div>
                      <a
                        href={`https://wa.me/${r.guest_phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#1ebd5a] hover:underline"
                      >
                        {r.guest_phone}
                      </a>
                    </td>
                    <td className="max-w-[180px]">
                      <div className="text-navy">{r.tours?.title ?? "—"}</div>
                    </td>
                    <td className="whitespace-nowrap">{r.booking_date}</td>
                    <td className="whitespace-nowrap">
                      {r.adults}A{r.children ? ` · ${r.children}C` : ""}
                    </td>
                    <td className="whitespace-nowrap font-semibold text-navy">
                      AED {Number(r.total_amount).toLocaleString()}
                      <span
                        className={`ml-2 align-middle text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${
                          r.payment_status === "paid"
                            ? "bg-green-100 text-green-700"
                            : r.payment_status === "refunded"
                              ? "bg-purple-100 text-purple-700"
                              : r.payment_status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {r.payment_status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize ${statusClass[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="pr-5">
                      <select
                        value={r.status}
                        onChange={(e) => updateStatus(r.id, e.target.value as Status)}
                        className="text-xs px-2 py-1.5 rounded-lg border border-black/10 bg-white focus:border-gold focus:outline-none capitalize"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <p className="p-8 text-center text-charcoal/55 text-sm">No bookings match this view.</p>
          )}
          {loading && <p className="p-8 text-center text-charcoal/55 text-sm">Loading…</p>}
        </div>
      </div>
    </div>
  );
}
