"use client";

import { useMemo, useState } from "react";
import type { DashboardData, ScarSignal, Snapshot } from "@/lib/types";
import { HealTimeline } from "./HealTimeline";
import { PriceChart } from "./PriceChart";

function formatWhen(iso: string | null) {
  if (!iso) return "never";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatPrice(price: number | null, currency: string) {
  if (price == null || !Number.isFinite(price)) return "n/a";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

function signalKind(type: string) {
  switch (type) {
    case "restock":
      return "restock";
    case "scarcity":
      return "scar";
    case "price_cut":
      return "cut";
    case "cheapest":
      return "deal";
    case "oos":
      return "oos";
    case "suppressed":
      return "hold";
    default:
      return "deal";
  }
}

function productKey(row: Snapshot) {
  return `${row.store}::${row.product_url || row.product_name}`;
}

export function Dashboard({ data }: { data: DashboardData }) {
  const [store, setStore] = useState("all");
  const [trustedOnly, setTrustedOnly] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [shown, setShown] = useState(60);
  const [feedShown, setFeedShown] = useState(12);

  const feed = useMemo(() => {
    const all = [...data.feed, ...(trustedOnly ? [] : data.suppressed)];
    return all.filter((s) => {
      if (store !== "all" && s.store !== store) return false;
      if (trustedOnly && !s.trust) return false;
      return true;
    });
  }, [data.feed, data.suppressed, store, trustedOnly]);

  const catalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.current.filter((row) => {
      if (store !== "all" && row.store !== store) return false;
      if (!q) return true;
      return (
        row.product_name.toLowerCase().includes(q) ||
        (row.product_url || "").toLowerCase().includes(q)
      );
    });
  }, [data.current, store, query]);

  const visible = catalog.slice(0, shown);
  const selected =
    visible.find((row) => productKey(row) === selectedKey) ?? visible[0];

  const chartPoints = useMemo(() => {
    if (!selected || selected.price == null) return [];
    return [
      {
        x: 0,
        y: 0,
        price: selected.price,
        label: new Date(selected.scraped_at).toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
        }),
      },
    ];
  }, [selected]);

  const heals =
    store === "all" ? data.heals : data.heals.filter((h) => h.store === store);

  return (
    <div className="shell">
      <a className="skip" href="#feed">
        Skip to Scar Feed
      </a>

      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">scar feed</p>
          <h1 className="wordmark">Wolverine</h1>
          <p className="tag">{data.tagline}</p>
          <div className="cta-row">
            <button
              type="button"
              className={`cta ${trustedOnly ? "on" : ""}`}
              onClick={() => setTrustedOnly(true)}
            >
              Trusted only
            </button>
            <button
              type="button"
              className={`cta ghost ${!trustedOnly ? "on" : ""}`}
              onClick={() => setTrustedOnly(false)}
            >
              Show suppressed
            </button>
            <label className="store-filter">
              <span className="kicker">store</span>
              <select
                value={store}
                onChange={(e) => setStore(e.target.value)}
                aria-label="Filter by store"
              >
                <option value="all">All stores</option>
                {data.pulse.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="hero-meta">
          <div className={`pill ${data.dbExists ? "heal" : "warn"}`}>
            {data.dbExists ? "radar armed" : "no snapshot"}
          </div>
          <div className="pill">last scrape {formatWhen(data.lastScrapedAt)}</div>
          <div className="pill">
            {data.feed.length} signals · {data.clusterCount} matches
          </div>
        </div>
      </header>

      <section className="feed-panel" id="feed">
        <div className="panel-head">
          <span>Scar Feed</span>
          <span>{feed.length} live</span>
        </div>
        {feed.length === 0 ? (
          <div className="empty">
            <h2>No signals yet</h2>
            <p>
              Run <code>npm run scrape</code> then <code>npm run scar:export</code>.
              Cross-store scarcity appears from one batch; restocks need a second
              scrape.
            </p>
          </div>
        ) : (
          <ul className="feed-list">
            {feed.slice(0, feedShown).map((s: ScarSignal, i) => (
              <li
                key={`${s.type}-${s.store}-${s.product_name}-${i}`}
                className={`feed-item ${signalKind(s.type)}`}
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              >
                <span className="feed-type">{s.type.replace("_", " ")}</span>
                <p>{s.text}</p>
                <span className={`trust-chip ${s.trust ? "ok" : "bad"}`}>
                  {s.trust ? "trusted" : s.verdict}
                </span>
              </li>
            ))}
          </ul>
        )}
        {feedShown < feed.length ? (
          <button
            type="button"
            className="more"
            onClick={() => setFeedShown((n) => n + 12)}
          >
            More signals ({feed.length - feedShown} left)
          </button>
        ) : null}
      </section>

      <section className="court-panel">
        <div className="panel-head">
          <span>Heal Court</span>
          <span>release · repair · refuse</span>
        </div>
        <div className="court-grid">
          {data.pulse.map((p) => (
            <article key={p.id} className={`court-card ${p.verdict}`}>
              <h3>{p.name}</h3>
              <p className="verdict">{p.verdict}</p>
              <p className="reason">{p.reason}</p>
            </article>
          ))}
        </div>
        {data.suppressed.length > 0 ? (
          <p className="court-note">
            {data.suppressed.length} signal(s) held because a store failed court.
            False restocks never reach the feed.
          </p>
        ) : (
          <p className="court-note">
            All collectors clear. Scar Feed is allowed to speak.
          </p>
        )}
      </section>

      <section className="pulse-row" aria-label="Store pulse">
        {data.pulse.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pulse-card ${store === p.id ? "active" : ""} ${p.trust ? "ok" : "bad"}`}
            onClick={() => setStore(store === p.id ? "all" : p.id)}
          >
            <span className="kicker">{p.verdict}</span>
            <strong>{p.name}</strong>
            <span className="mono">
              {p.rows} rows · {p.collectorId.slice(0, 10)}…
            </span>
          </button>
        ))}
        <button
          type="button"
          className={`pulse-card ${store === "all" ? "active" : ""}`}
          onClick={() => setStore("all")}
        >
          <span className="kicker">scope</span>
          <strong>All stores</strong>
          <span className="mono">{data.current.length} live rows</span>
        </button>
      </section>

      <section className="panel catalog">
        <div className="panel-head">
          <span>Catalog</span>
          <span>
            {visible.length} of {catalog.length}
          </span>
        </div>
        <div className="filters">
          <label className="search">
            <span className="kicker">find</span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(60);
              }}
              placeholder="Filter products"
            />
          </label>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Store</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const key = productKey(row);
                const active = selected && productKey(selected) === key;
                return (
                  <tr
                    key={`${row.store}-${row.product_url}-${row.product_name}`}
                    className={`clickable ${active ? "selected" : ""}`}
                    onClick={() => setSelectedKey(key)}
                  >
                    <td>
                      {row.product_url ? (
                        <a
                          className="product-link"
                          href={row.product_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {row.product_name}
                        </a>
                      ) : (
                        row.product_name
                      )}
                    </td>
                    <td className="mono">
                      {formatPrice(row.price, row.currency)}
                    </td>
                    <td className="mono">{row.stock_status || "unknown"}</td>
                    <td className="mono">{row.store}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {visible.length < catalog.length ? (
          <button
            type="button"
            className="more"
            onClick={() => setShown((n) => n + 60)}
          >
            Show more
          </button>
        ) : null}
      </section>

      <PriceChart
        title={selected?.product_name || "no product pinned"}
        points={chartPoints}
        uniqueTimes={data.batchCount}
      />

      <HealTimeline events={heals} />
    </div>
  );
}
