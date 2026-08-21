"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV, GITHUB_REPO } from "@/lib/nav";
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
          <img src="/assets/logo.webp" alt="" width={36} height={36} />
          <div>
            <strong>Scar Feed</strong>
            <span>product app</span>
          </div>
        </Link>
        <nav className="app-nav" aria-label="App">
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
        </nav>
        <div className="app-side-foot">
          <Link href="/">← Marketing site</Link>
          <br />
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
            last scrape {formatWhen(data.lastScrapedAt)}
          </span>
          <span className="pill ok">{trusted} trusted signals</span>
          <span className={`pill ${bad ? "bad" : "ok"}`}>
            {bad ? `${bad} store(s) held` : "all stores clear"}
          </span>
          <span className="pill">{(data.pulse || []).length} collectors</span>
        </header>

        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
