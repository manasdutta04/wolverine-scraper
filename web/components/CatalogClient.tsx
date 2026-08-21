"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ScarPayload, Snapshot } from "@/lib/types";

function key(row: Snapshot) {
  return `${row.store}::${row.product_url || row.product_name}`;
}

export function CatalogClient({ data }: { data: ScarPayload }) {
  const [store, setStore] = useState("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(60);
  const [selected, setSelected] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data.current || []).filter((row) => {
      if (store !== "all" && row.store !== store) return false;
      if (!q) return true;
      return (
        String(row.product_name || "").toLowerCase().includes(q) ||
        String(row.product_url || "").toLowerCase().includes(q)
      );
    });
  }, [data, store, query]);

  const visible = rows.slice(0, shown);
  const selectedRow =
    visible.find((r) => key(r) === selected) || visible[0] || null;

  return (
    <>
      <div className="toolbar">
        <select
          aria-label="Filter by store"
          value={store}
          onChange={(e) => {
            setStore(e.target.value);
            setShown(60);
            setSelected(null);
          }}
        >
          <option value="all">All stores</option>
          {(data.pulse || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Filter products"
          aria-label="Search products"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShown(60);
            setSelected(null);
          }}
        />
      </div>
      <p className="meta-line">
        Showing {Math.min(shown, rows.length)} of {rows.length}
      </p>
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
              const k = key(row);
              const on = selectedRow && key(selectedRow) === k;
              return (
                <tr
                  key={k}
                  className={`clickable${on ? " selected" : ""}`}
                  onClick={() => setSelected(k)}
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
                  <td className="mono">{formatPrice(row.price, row.currency)}</td>
                  <td className="mono">{row.stock_status || "unknown"}</td>
                  <td className="mono">{row.store}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {shown < rows.length ? (
        <button className="more" type="button" onClick={() => setShown((n) => n + 60)}>
          Show more
        </button>
      ) : null}

      <section className="chart-panel">
        <div className="chart-head">
          <span>Price</span>
          <span>{selectedRow?.product_name || "none selected"}</span>
        </div>
        <p className="chart-note">
          {(data.batchCount || 1) <= 1
            ? "One snapshot so far. The line fills in after the next scrape batch."
            : `${data.batchCount} scrape batches in SQLite. Showing live price for this SKU.`}
        </p>
        {selectedRow && selectedRow.price != null ? (
          <svg className="chart-svg" viewBox="0 0 920 220" role="img">
            <title>{selectedRow.product_name} price</title>
            <line
              x1={56}
              x2={896}
              y1={110}
              y2={110}
              stroke="#2a2a2c"
              strokeDasharray="3 6"
            />
            <circle cx={476} cy={110} r={7} fill="#000" stroke="#fff" strokeWidth={2} />
            <text
              x={476}
              y={208}
              textAnchor="middle"
              fill="#8e8e8e"
              fontSize={11}
              fontFamily="Inter, sans-serif"
            >
              {formatPrice(selectedRow.price, selectedRow.currency)}
            </text>
          </svg>
        ) : (
          <p className="empty">Select a product with a price.</p>
        )}
      </section>
    </>
  );
}
