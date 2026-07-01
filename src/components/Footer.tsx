import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const FacebookIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);
const InstagramIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="15"
    height="15"
    {...p}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" {...p}>
    <path d="M23 7.5s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C16.9 4 12 4 12 4s-4.9 0-8 .2c-.4.1-1.3.1-2.1 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1C6 20 12 20 12 20s4.9 0 8-.2c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.7 14.6V8.4l6.3 3.1-6.3 3.1z" />
  </svg>
);
import logoWhite from "@/assets/logo-white.png";
import { EMAIL, PHONE, WHATSAPP, SOCIALS } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-navy text-white/75">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-x grid lg:grid-cols-2 gap-8 py-12 items-center">
          <div>
            <span className="eyebrow !text-gold-light">Stay in the loop</span>
            <h3 className="mt-2 text-2xl md:text-3xl font-bold text-white max-w-md leading-tight">
              Desert sunsets & secret deals — straight to your inbox.
            </h3>
          </div>
          <form className="flex flex-col gap-2 w-full sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-5 h-13 rounded-xl bg-white/8 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
            />
            <button className="btn-gold !rounded-xl shrink-0">
              <Send size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container-x grid gap-10 py-16 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2 max-w-sm">
          <img src={logoWhite} alt="Tripscape Adventures" className="h-12" />
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Licensed UAE tour operator delivering unforgettable desert, city and attraction
            experiences across Dubai, Abu Dhabi, Sharjah, RAK & Fujairah since 2018.
          </p>
          <div className="mt-6 space-y-2.5 text-sm">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-3 hover:text-gold-light transition"
            >
              <Phone size={14} className="text-gold" /> {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 hover:text-gold-light transition"
            >
              <Mail size={14} className="text-gold" /> {EMAIL}
            </a>
            <div className="flex items-start gap-3">
              <MapPin size={14} className="text-gold mt-1" /> Office 1204, Business Bay, Dubai, UAE
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            {[
              { Icon: FacebookIcon, href: SOCIALS.facebook, label: "Facebook" },
              { Icon: InstagramIcon, href: SOCIALS.instagram, label: "Instagram" },
              { Icon: YoutubeIcon, href: SOCIALS.youtube, label: "YouTube" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="h-9 w-9 grid place-items-center rounded-full bg-white/8 hover:bg-gold hover:text-white transition"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Company"
          links={[
            ["About Us", "/about"],
            ["Contact", "/contact"],
            ["Blog", "/blog"],
            ["Become a Guide", "/contact"],
            ["Careers", "/contact"],
          ]}
        />
        <FooterCol
          title="Experiences"
          links={[
            ["Desert Safari", "/desert-safari"],
            ["Adventures", "/adventures"],
            ["City Tours", "/city-tours"],
            ["Attractions", "/attractions"],
            ["Packages", "/packages"],
          ]}
        />
        <FooterCol
          title="Destinations"
          links={[
            ["Dubai", "/city-tours"],
            ["Abu Dhabi", "/city-tours"],
            ["Sharjah", "/city-tours"],
            ["Ras Al Khaimah", "/city-tours"],
            ["Fujairah", "/city-tours"],
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Tripscape Adventures. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <Link to="/" className="hover:text-gold-light">
              Privacy
            </Link>
            <Link to="/" className="hover:text-gold-light">
              Terms
            </Link>
            <Link to="/" className="hover:text-gold-light">
              Refund Policy
            </Link>
          </div>
          <a href={WHATSAPP} className="text-gold-light hover:text-gold">
            Trade License: DED-1234567
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-white font-display font-semibold text-sm tracking-wide mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-white/65 hover:text-gold-light transition">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
