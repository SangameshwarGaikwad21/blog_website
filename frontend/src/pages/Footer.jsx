import { Github, Linkedin, Home, PenLine, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

// Uses the Inter font (add once in index.html):
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

const ACCENT = "#ff6b0a";

const quickLinks = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/createblog", label: "Create blog", icon: PenLine },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/SangameshwarGaikwad21",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sangameshwar-gaikwad-a83426340",
    icon: Linkedin,
  },
];

const linkClass =
  "inline-flex items-center gap-2 rounded-md text-sm text-zinc-400 transition hover:text-orange-400 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-[#08080a] text-zinc-300"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* glowing top edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,107,10,0.6), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[200px] w-[120%] max-w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,107,10,0.12), transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
        {/* brand */}
        <div>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-md text-lg font-extrabold tracking-tight text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: ACCENT, boxShadow: "0 0 12px rgba(255,107,10,0.8)" }}
            />
            Sangam Blog_Website
          </Link>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
            Sharing thoughts, tutorials, and real-world web development experiences.
          </p>
        </div>

        {/* quick links */}
        <nav aria-label="Quick links">
          <h3 className="mb-4 text-sm font-semibold text-zinc-100">Quick links</h3>
          <ul className="grid gap-3">
            {quickLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className={`${linkClass} group`}>
                  <Icon size={16} className="text-zinc-600 transition group-hover:text-orange-500" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-zinc-100">Follow me</h3>
          <div className="flex gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-4 py-4 text-center text-xs text-zinc-600 sm:py-5">
        &copy; {new Date().getFullYear()} Sangam Gaikwad. All rights reserved.
      </div>
    </footer>
  );
}