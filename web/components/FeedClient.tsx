"use client";

import { useEffect, useMemo, useState } from "react";
import { useScar } from "@/components/ScarProvider";

export function FeedClient() {
  const { data, bump } = useScar();
  const [store, setStore] = useState("all");
  const [trustedOnly, setTrustedOnly] = useState(true);
  const [shown, setShown] = useState(24);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (bump === 0) return;
    setFlash(true);
    const id = window.setTimeout(() => setFlash(false), 2200);
    return () => window.clearTimeout(id);
  }, [bump]);

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
      <p className="meta-line">
        {rows.length} live signals
        {flash ? " · snapshot updated" : ""}
      </p>
      <ul className={`feed-list${flash ? " feed-flash" : ""}`}>
        {rows.slice(0, shown).map((s, i) => (
          <li
            key={`${s.type}-${s.store}-${s.product_name}-${i}`}
            className={`feed-item${flash && i < 8 ? " is-new" : ""}`}
          >
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
