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

function stockClass(stock: string | null): string {
  switch (stock) {
    case "in_stock":
      return "in";
    case "out_of_stock":
    case "discontinued":
      return "out";
    case "backorder":
      return "out";
    case "unknown":
    case null:
      return "broken";
    default:
      return "";
  }
}

function stockLabel(stock: string | null, raw: string | null): string {
  if (!stock) return raw || "missing";
  return stock.replaceAll("_", " ");
}

function productKey(row: Snapshot) {
  return `${row.store}::${row.product_url || row.product_name || row.id}`;
}

function formatWhen(iso: string | null) {
  if (!iso) return "never";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatPrice(price: number | null, currency: string) {
  if (price == null || !Number.isFinite(price)) return "—";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

export function Dashboard({ data }: { data: DashboardData }) {
  const [store, setStore] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const current = useMemo(() => {
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

  const visible = current.slice(0, 250);
  const selected =
    visible.find((row) => productKey(row) === selectedKey) ?? visible[0];

  const chartPoints = useMemo(() => {
    if (!selected) return [];
    return data.history
      .filter((row) => {
        if (row.store !== selected.store) return false;
        if (selected.product_url) return row.product_url === selected.product_url;
        return row.product_name === selected.product_name;
      })
      .map((row) => {
        if (row.price == null || !Number.isFinite(row.price)) return null;
        return {
          x: 0,
          y: 0,
          price: row.price,
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
              <span>
                {store === "all" ? "all collectors" : store}
                {current.length > visible.length
                  ? ` · showing ${visible.length} of ${current.length}`
                  : ` · ${current.length} rows`}
              </span>
            </div>
            {data.dbExists && data.current.length > 0 ? (
              <label className="search">
                <span className="kicker">find</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by product name or URL"
                />
              </label>
            ) : null}
            {visible.length === 0 ? (
              <div className="empty">
                <h2>{data.dbExists ? "No matching products" : "No snapshots"}</h2>
                <p>
                  {data.dbExists
                    ? "Try another store filter or clear the search."
                    : "Run `npm run scrape` so snapshots land in db/wolverine.db. This table fills from the latest batch per store."}
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
                    {visible.map((row) => {
                      const key = productKey(row);
                      const active = selected && productKey(selected) === key;
                      return (
                        <tr
                          key={row.id}
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
                              >
                                {row.product_name || "untitled"}
                              </a>
                            ) : (
                              row.product_name || "untitled"
                            )}
                          </td>
                          <td className="mono">
                            {formatPrice(row.price, row.currency)}
                          </td>
                          <td>
                            <span className={`stock ${stockClass(row.stock_status)}`}>
                              {stockLabel(row.stock_status, row.stock_status_raw)}
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
