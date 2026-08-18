"use client";

import { useMemo, useState } from "react";
import type { DashboardData, Snapshot } from "@/lib/types";
import { PriceChart } from "./PriceChart";

const STORES = [
  { id: "all", name: "All stores" },
  { id: "adafruit", name: "Adafruit" },
  { id: "sparkfun", name: "SparkFun" },
  { id: "pimoroni", name: "Pimoroni" },
  { id: "thepihut", name: "The Pi Hut" },
];

function parsePrice(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function stockClass(stock: string | null): string {
  if (!stock) return "broken";
  const s = stock.toLowerCase();
  if (s.includes("out") || s.includes("backorder")) return "out";
  if (s.includes("in stock") || s.includes("add to cart")) return "in";
  return "";
}

function productKey(row: Snapshot) {
  return `${row.store}::${row.url || row.product_name || row.id}`;
}

function formatWhen(iso: string | null) {
  if (!iso) return "never";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function Dashboard({ data }: { data: DashboardData }) {
  const [store, setStore] = useState("all");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const current = useMemo(
    () =>
      data.current.filter((row) => (store === "all" ? true : row.store === store)),
    [data.current, store],
  );

  const selected = current.find((row) => productKey(row) === selectedKey) ?? current[0];

  const chartPoints = useMemo(() => {
    if (!selected) return [];
    return data.history
      .filter((row) => {
        if (row.store !== selected.store) return false;
        if (selected.url) return row.url === selected.url;
        return row.product_name === selected.product_name;
      })
      .map((row) => {
        const price = parsePrice(row.price);
        if (price == null) return null;
        return {
          x: 0,
          y: 0,
          price,
          label: new Date(row.scraped_at).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
          }),
        };
      })
      .filter((p): p is NonNullable<typeof p> => p != null);
  }, [data.history, selected]);

  const counts = Object.fromEntries(
    STORES.map((s) => [
      s.id,
      s.id === "all"
        ? data.current.length
        : data.current.filter((row) => row.store === s.id).length,
    ]),
  );

  return (
    <div className="shell">
      <header className="mast">
        <div>
          <h1 className="wordmark">Wolverine</h1>
          <p className="tag">
            It doesn&apos;t matter how badly the page gets cut up — it heals.
          </p>
        </div>
        <div className="status-stack">
          <div className={`pill ${data.current.length ? "heal" : "warn"}`}>
            heal loop {data.current.length ? "armed" : "standby"}
          </div>
          <div className="pill">last scrape {formatWhen(data.lastScrapedAt)}</div>
          <div className="pill">{data.current.length} live rows</div>
        </div>
      </header>

      <div className="layout">
        <aside className="rail">
          {STORES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`plate ${store === s.id ? "active" : ""}`}
              onClick={() => {
                setStore(s.id);
                setSelectedKey(null);
              }}
            >
              <span className="kicker">store</span>
              {s.name}
              <span className="count">{counts[s.id]}</span>
            </button>
          ))}
          <p className="note">
            Snapshots land in SQLite after `npm run scrape`. Empty price or stock
            trips `npm run heal`.
          </p>
        </aside>

        <main className="stage">
          <section className="panel">
            <div className="panel-head">
              <span>Current prices / stock</span>
              <span>{store === "all" ? "all collectors" : store}</span>
            </div>
            {current.length === 0 ? (
              <div className="empty">
                <h2>No snapshots</h2>
                <p>
                  Target listing URLs still need confirmation. No Bright Data
                  scrapers have been created yet — this table fills after the
                  first pipeline run.
                </p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Store</th>
                      <th>Scraped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.map((row) => {
                      const key = productKey(row);
                      const active = selected && productKey(selected) === key;
                      return (
                        <tr
                          key={row.id}
                          className={`clickable ${active ? "selected" : ""}`}
                          onClick={() => setSelectedKey(key)}
                        >
                          <td>
                            {row.url ? (
                              <a
                                className="product-link"
                                href={row.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {row.product_name || "untitled"}
                              </a>
                            ) : (
                              row.product_name || "untitled"
                            )}
                          </td>
                          <td className="mono">{row.price || "—"}</td>
                          <td>
                            <span className={`stock ${stockClass(row.stock)}`}>
                              {row.stock || "missing"}
                            </span>
                          </td>
                          <td className="mono">{row.store}</td>
                          <td className="mono">{formatWhen(row.scraped_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <PriceChart
            title={selected?.product_name || "no product pinned"}
            points={chartPoints}
          />
        </main>
      </div>
    </div>
  );
}
