import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_GROUPS, PRIMARY_LINKS } from "@/lib/tnic";

export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <nav
        className={cn(
          "glass-card mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5",
          solid ? "bg-surface/70" : "bg-surface/40",
        )}
        aria-label="Primary"
      >
        <Link to="/" data-magnetic className="flex min-h-11 items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-accent/15 text-[0.7rem] font-semibold tracking-wide text-accent">
            TN
          </span>
          <span className="text-sm font-medium tracking-wide text-fg">TNiC</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              data-magnetic
              className={cn(
                "inline-flex min-h-11 items-center px-3 text-sm transition-colors duration-150",
                pathname === link.href ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/nico"
            data-magnetic
            className="inline-flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            NICO Starter
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="site-explore"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Explore</span>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="site-explore"
          className="glass-card mx-auto mt-2 max-h-[70dvh] max-w-6xl overflow-y-auto p-5 lg:hidden"
        >
          <ExploreGroups pathname={pathname} />
        </div>
      ) : null}

      <div className="mx-auto hidden max-w-6xl justify-end px-2 pt-2 lg:flex">
        <details className="group">
          <summary
            data-magnetic
            className="cursor-pointer list-none px-3 py-1 text-xs tracking-[0.16em] text-muted uppercase marker:content-none"
          >
            Explore the map
          </summary>
          <div className="glass-card mt-2 p-5">
            <ExploreGroups pathname={pathname} />
          </div>
        </details>
      </div>
    </header>
  );
}

function ExploreGroups({ pathname }: { pathname: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[0.68rem] tracking-[0.18em] text-accent uppercase">{group.label}</p>
          <ul className="mt-3 space-y-1">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  data-magnetic
                  className={cn(
                    "inline-flex min-h-11 items-center text-sm",
                    pathname === link.href ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
