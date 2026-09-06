import { Link } from "@tanstack/react-router";
import { NAV_GROUPS } from "@/lib/tnic";

const EXTRA = [
  { href: "/nico", label: "NICO Starter" },
  { href: "/elite-8", label: "Elite 8" },
  { href: "/hallmarks", label: "Hallmarks" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/trust", label: "Trust" },
  { href: "/faq", label: "FAQ" },
  { href: "/partnerships", label: "Partnerships" },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="max-w-2xl font-display text-2xl tracking-tight text-fg">
          Independent longevity intelligence — built on evidence, designed for privacy.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[0.68rem] tracking-[0.18em] text-accent uppercase">{group.label}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} data-magnetic className="text-sm text-muted hover:text-fg">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-[0.68rem] tracking-[0.18em] text-accent uppercase">Site</p>
            <ul className="mt-3 space-y-2">
              {EXTRA.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} data-magnetic className="text-sm text-muted hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted">TNiC · Cell-Health Library · tnic.help</p>
          <p className="text-xs text-muted">Educational only. Not medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
