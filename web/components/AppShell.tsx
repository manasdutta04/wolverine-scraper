"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV, APP_NAV_GROUPS, GITHUB_REPO } from "@/lib/nav";
import type { ScarPayload } from "@/lib/types";
import { formatWhen } from "@/lib/format";

export function AppShell({
  children,
  data,
}: {
  children: React.ReactNode;
  data: ScarPayload;
}) {
  const pathname = usePathname();
  const trusted = (data.feed || []).filter((s) => s.trust).length;
  const bad = (data.pulse || []).filter((p) => !p.trust).length;

  return (
    <div className="app-frame">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/app">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.webp" alt="" width={40} height={40} />
          <div>
            <strong>Scar Feed</strong>
            <span>Wolverine · Studio</span>
          </div>
        </Link>

        {APP_NAV_GROUPS.map((group) => (
          <div key={group.label} className="app-nav-group">
            <p className="app-nav-label">{group.label}</p>
            <nav className="app-nav" aria-label={group.label}>
              {group.items.map((item) => {
                const active =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={active ? "active" : undefined}
                  >
                    <span className="app-nav-icon" aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="app-side-foot">
          <Link href="/">← Marketing</Link>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
            Star on GitHub
          </a>
        </div>
      </aside>

      <div className="app-main">
        <div className="app-mobile-bar" aria-label="App sections">
          {APP_NAV.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={active ? "active" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <header className="app-topbar">
          <span className="pill">
            scrape {formatWhen(data.lastScrapedAt)}
          </span>
          <span className="pill ok">{trusted} trusted</span>
          <span className={`pill ${bad ? "bad" : "ok"}`}>
            {bad ? `${bad} held` : "court clear"}
          </span>
          <div className="top-pulse">
            {(data.pulse || []).map((p) => (
              <span
                key={p.id}
                className={`pulse-dot ${p.trust ? "ok" : "bad"}`}
                title={`${p.name}: ${p.verdict}`}
              >
                {p.name.slice(0, 2)}
              </span>
            ))}
          </div>
        </header>

        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
