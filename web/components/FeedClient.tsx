"use client";

import { useMemo, useState } from "react";
import type { ScarPayload } from "@/lib/types";

export function FeedClient({ data }: { data: ScarPayload }) {
  const [store, setStore] = useState("all");
  const [trustedOnly, setTrustedOnly] = useState(true);
  const [shown, setShown] = useState(24);

  const rows = useMemo(() => {
    const all = [...(data.feed || []), ...(trustedOnly ? [] : data.suppressed || [])];
    return all.filter((s) => {
      if (store !== "all" && s.store !== store) return false;
      if (trustedOnly && !s.trust) return false;
      return true;
    });
  }, [data, store, trustedOnly]);

  return (
    <>
      <div className="toolbar">
        <select
          aria-label="Filter by store"
          value={store}
          onChange={(e) => {
            setStore(e.target.value);
            setShown(24);
          }}
        >
          <option value="all">All stores</option>
          {(data.pulse || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          className={`chip${trustedOnly ? " on" : ""}`}
          type="button"
          onClick={() => {
            setTrustedOnly(true);
            setShown(24);
          }}
        >
          Trusted only
        </button>
        <button
          className={`chip${!trustedOnly ? " on" : ""}`}
          type="button"
          onClick={() => {
            setTrustedOnly(false);
            setShown(24);
          }}
        >
          Show suppressed
        </button>
      </div>
      <p className="meta-line">{rows.length} live signals</p>
      <ul className="feed-list">
        {rows.slice(0, shown).map((s, i) => (
          <li key={`${s.type}-${s.store}-${s.product_name}-${i}`} className="feed-item">
            <span className="feed-type">{String(s.type || "").replace("_", " ")}</span>
            <p>{s.text}</p>
            <span className={`trust-chip ${s.trust ? "ok" : "bad"}`}>
              {s.trust ? "trusted" : s.verdict || "held"}
            </span>
          </li>
        ))}
      </ul>
      {shown < rows.length ? (
        <button className="more" type="button" onClick={() => setShown((n) => n + 24)}>
          More signals
        </button>
      ) : null}
    </>
  );
}
