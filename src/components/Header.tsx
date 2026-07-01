import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, X, Search, Globe, User, ArrowRight } from "lucide-react";
import logoGold from "@/assets/logo-gold.png";
import logoWhite from "@/assets/logo-white.png";
import { EMAIL, PHONE, WHATSAPP, NAV_GROUPS } from "@/lib/site-data";
import { useLockScroll } from "@/lib/lock-scroll";
import { useAuth } from "@/lib/use-auth";
import { useNavTours } from "@/lib/use-nav-tours";

type Group = (typeof NAV_GROUPS)[number];

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const { user } = useAuth();
  const { byCategory } = useNavTours();
  useLockScroll(mobile);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;
  const logo = solid ? logoGold : logoWhite;
  const activeGroup: Group | undefined = NAV_GROUPS.find((g) => g.label === open);
  const groupTours = activeGroup ? byCategory(activeGroup.category) : [];
  const featured = groupTours[0];

  return (
    <>
      {/* Utility bar */}
      <div className="hidden lg:block bg-navy text-white/80 text-[12.5px]">
        <div className="container-x flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 hover:text-gold-light transition"
            >
              <Phone size={12} /> {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="hover:text-gold-light transition">
              {EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60">Become a Local Guide</span>
            <span className="text-white/30">·</span>
            <button className="hover:text-gold-light transition flex items-center gap-1">
              <Globe size={12} /> EN
            </button>
            <span className="text-white/30">·</span>
            {user ? (
              <Link
                to="/admin"
                className="hover:text-gold-light transition flex items-center gap-1"
              >
                <User size={12} /> My account
              </Link>
            ) : (
              <Link to="/auth" className="hover:text-gold-light transition">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: solid ? "rgba(255,255,255,0.96)" : "rgba(16,24,38,0)",
          backdropFilter: solid ? "blur(12px)" : "blur(0px)",
          borderColor: solid ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.25 }}
        className={`sticky top-0 z-50 border-b ${solid ? "shadow-[0_2px_24px_-12px_rgba(16,24,38,0.18)]" : ""}`}
        onMouseLeave={() => setOpen(null)}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-2 lg:gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Tripscape Adventures" className="h-10 md:h-11 w-auto" />
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            <NavLink solid={solid} to="/">
              Home
            </NavLink>
            {NAV_GROUPS.map((g) => (
              <div key={g.label} onMouseEnter={() => setOpen(g.label)} className="relative">
                <Link
                  to={g.to}
                  className={`px-2.5 py-2 rounded-lg font-medium text-[13.5px] flex items-center gap-1 whitespace-nowrap transition ${solid ? "text-navy hover:text-gold" : "text-white hover:text-gold-light"}`}
                >
                  {g.label}{" "}
                  <ChevronDown
                    size={13}
                    className={`transition ${open === g.label ? "rotate-180" : ""}`}
                  />
                </Link>
              </div>
            ))}
            <NavLink solid={solid} to="/blog">
              Blog
            </NavLink>
            <NavLink solid={solid} to="/about">
              About
            </NavLink>
            <NavLink solid={solid} to="/contact">
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/tours"
              className={`hidden md:grid h-10 w-10 place-items-center rounded-full transition ${solid ? "text-navy hover:bg-sand" : "text-white hover:bg-white/10"}`}
              aria-label="Search tours"
            >
              <Search size={18} />
            </Link>
            <Link
              to="/enquire-now"
              className="hidden md:inline-flex btn-gold !py-2.5 !px-5 !text-[13.5px]"
            >
              Book Now
            </Link>
            <button
              className={`xl:hidden grid h-10 w-10 place-items-center rounded-lg ${solid ? "text-navy" : "text-white"}`}
              onClick={() => setMobile(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {activeGroup && (
            <motion.div
              key={activeGroup.label}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full bg-white/98 backdrop-blur-xl border-t border-black/5 shadow-[0_24px_60px_-20px_rgba(16,24,38,0.25)]"
            >
              <div className="container-x grid grid-cols-12 gap-8 py-10">
                <div className="col-span-4 hidden md:block">
                  <span className="eyebrow">Featured</span>
                  <h3 className="mt-2 text-2xl font-bold text-navy">{activeGroup.label}</h3>
                  <p className="mt-3 text-sm text-charcoal/70 leading-relaxed">
                    {activeGroup.blurb}
                  </p>
                  {featured ? (
                    <Link
                      to="/tours/$slug"
                      params={{ slug: featured.slug }}
                      onClick={() => setOpen(null)}
                      className="mt-5 block relative h-44 rounded-2xl overflow-hidden group"
                    >
                      <img
                        src={featured.hero_image ?? ""}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="text-xs uppercase tracking-[0.18em] text-gold-light">
                          From AED {Number(featured.price_adult).toFixed(0)}
                        </div>
                        <div className="font-display font-bold text-lg leading-tight line-clamp-2">
                          {featured.title}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to={activeGroup.to}
                      onClick={() => setOpen(null)}
                      className="mt-5 inline-flex items-center gap-1.5 text-gold font-semibold text-sm"
                    >
                      Explore {activeGroup.label} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
                <div className="col-span-12 md:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    {groupTours.slice(0, 6).map((t) => (
                      <Link
                        key={t.slug}
                        to="/tours/$slug"
                        params={{ slug: t.slug }}
                        onClick={() => setOpen(null)}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-sand transition"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gold/10 grid place-items-center text-gold group-hover:bg-gold group-hover:text-white transition shrink-0">
                          <ChevronDown size={16} className="-rotate-90" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-navy group-hover:text-gold transition line-clamp-1">
                            {t.title}
                          </div>
                          <div className="text-[13px] text-charcoal/65 mt-0.5">
                            From AED {Number(t.price_adult).toFixed(0)}
                            {t.duration ? ` · ${t.duration}` : ""}
                          </div>
                        </div>
                      </Link>
                    ))}
                    {groupTours.length === 0 && (
                      <div className="p-4 text-sm text-charcoal/55 sm:col-span-2">
                        Loading experiences…
                      </div>
                    )}
                  </div>
                  <Link
                    to={activeGroup.to}
                    onClick={() => setOpen(null)}
                    className="mt-4 ml-4 inline-flex items-center gap-1.5 text-gold font-semibold text-sm hover:gap-3 transition-all"
                  >
                    View all {activeGroup.label} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && <MobileMenu close={() => setMobile(false)} byCategory={byCategory} />}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  to,
  children,
  solid,
}: {
  to: string;
  children: React.ReactNode;
  solid: boolean;
}) {
  return (
    <Link
      to={to}
      className={`px-2.5 py-2 rounded-lg font-medium text-[13.5px] transition ${solid ? "text-navy hover:text-gold" : "text-white hover:text-gold-light"}`}
      activeProps={{ className: "text-gold" }}
    >
      {children}
    </Link>
  );
}

function MobileMenu({
  close,
  byCategory,
}: {
  close: () => void;
  byCategory: (c: string) => { slug: string; title: string }[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-navy/60 backdrop-blur-sm"
      onClick={close}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-black/5">
          <img src={logoGold} alt="Tripscape" className="h-9" />
          <button
            onClick={close}
            aria-label="Close"
            className="h-10 w-10 grid place-items-center rounded-lg hover:bg-sand"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-1">
          <Link
            to="/"
            onClick={close}
            className="block px-4 py-3 rounded-lg font-display font-semibold text-navy hover:bg-sand"
          >
            Home
          </Link>
          {NAV_GROUPS.map((g) => {
            const tours = byCategory(g.category);
            return (
              <div key={g.label}>
                <button
                  onClick={() => setExpanded(expanded === g.label ? null : g.label)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-display font-semibold text-navy hover:bg-sand"
                >
                  {g.label}{" "}
                  <ChevronDown
                    size={16}
                    className={`transition ${expanded === g.label ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {expanded === g.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-1 space-y-1">
                        <Link
                          to={g.to}
                          onClick={close}
                          className="block px-4 py-2 rounded-md text-sm font-semibold text-gold"
                        >
                          View all {g.label} →
                        </Link>
                        {tours.slice(0, 8).map((t) => (
                          <Link
                            key={t.slug}
                            to="/tours/$slug"
                            params={{ slug: t.slug }}
                            onClick={close}
                            className="block px-4 py-2 rounded-md text-sm text-charcoal/80 hover:text-gold"
                          >
                            {t.title}
                          </Link>
                        ))}
                        {tours.length === 0 && (
                          <div className="px-4 py-2 text-sm text-charcoal/45">Loading…</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <Link
            to="/blog"
            onClick={close}
            className="block px-4 py-3 rounded-lg font-display font-semibold text-navy hover:bg-sand"
          >
            Blog
          </Link>
          <Link
            to="/about"
            onClick={close}
            className="block px-4 py-3 rounded-lg font-display font-semibold text-navy hover:bg-sand"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={close}
            className="block px-4 py-3 rounded-lg font-display font-semibold text-navy hover:bg-sand"
          >
            Contact
          </Link>
        </div>
        <div className="p-5 border-t border-black/5 space-y-3">
          <Link to="/enquire-now" onClick={close} className="btn-gold w-full">
            Book Now
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="btn-gold w-full !bg-[#25D366] hover:!bg-[#1ebd5a]"
          >
            Book on WhatsApp
          </a>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 text-charcoal/80 text-sm"
          >
            <Phone size={14} /> {PHONE}
          </a>
        </div>
      </motion.aside>
    </motion.div>
  );
}
