"use client";

import { useCallback, useState } from "react";
import { ACTIONS_WORKFLOW } from "@/lib/nav";
import type { Pulse } from "@/lib/types";
import { useScar } from "@/components/ScarProvider";

export function CourtView() {
  const { data, refresh } = useScar();
  const [selected, setSelected] = useState<Pulse | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const held = (data.suppressed || []).length;

  const dispatchRepair = useCallback(
    async (storeId: string) => {
      setBusy(true);
      setNote(null);
      try {
        const res = await fetch("/api/field/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ simulateFailure: storeId }),
        });
        const json = (await res.json()) as {
          dispatched?: boolean;
          message?: string;
          actionsUrl?: string;
        };
        setNote(
          json.dispatched
            ? json.message || "Repair scrape dispatched."
            : json.message ||
                `Open Actions to run simulate_failure=${storeId}`,
        );
        if (json.dispatched) {
          window.setTimeout(() => void refresh(), 8_000);
        }
      } catch (e) {
        setNote(e instanceof Error ? e.message : "dispatch failed");
      } finally {
        setBusy(false);
      }
    },
    [refresh],
  );

  return (
    <>
      <div className="court-grid">
        {(data.pulse || []).map((p) => (
          <button
            key={p.id}
            type="button"
            className={`court-card ${p.verdict || "release"}`}
            onClick={() => {
              setSelected(p);
              setNote(null);
            }}
          >
            <h3>{p.name || p.id}</h3>
            <p className="verdict">{p.verdict || "release"}</p>
            <p className="reason">{p.reason || ""}</p>
            <p className="meta-line" style={{ marginTop: 10 }}>
              {p.rows || 0} rows · {(p.collectorId || "").slice(0, 14)}…
            </p>
          </button>
        ))}
      </div>
      <p className="meta-line" style={{ marginTop: 18 }}>
        {held
          ? `${held} signal(s) held because a store failed court.`
          : "All collectors clear. Scar Feed is allowed to speak."}
      </p>

      {selected ? (
        <div
          className="court-drawer-backdrop"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <aside
            className="court-drawer"
            role="dialog"
            aria-label={`${selected.name} court detail`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="court-drawer-head">
              <h2>{selected.name || selected.id}</h2>
              <button type="button" className="chip" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
            <p className={`verdict ${selected.trust ? "ok" : "bad"}`}>
              {selected.verdict || "release"}
            </p>
            <p className="reason">{selected.reason || "No red flags."}</p>
            <dl className="court-dl">
              <div>
                <dt>Store id</dt>
                <dd>
                  <code>{selected.id}</code>
                </dd>
              </div>
              <div>
                <dt>Collector</dt>
                <dd>
                  <code>{selected.collectorId}</code>
                </dd>
              </div>
              <div>
                <dt>Rows</dt>
                <dd>{selected.rows || 0}</dd>
              </div>
              <div>
                <dt>Scraped</dt>
                <dd>{selected.scrapedAt || "—"}</dd>
              </div>
            </dl>
            <div className="field-console-actions" style={{ marginTop: 16 }}>
              <button
                type="button"
                className="chip on"
                disabled={busy}
                onClick={() => void dispatchRepair(selected.id)}
              >
                {busy ? "Dispatching…" : "Dispatch repair scrape"}
              </button>
              <a
                className="chip"
                href={ACTIONS_WORKFLOW}
                target="_blank"
                rel="noreferrer"
              >
                Actions →
              </a>
            </div>
            {note ? <p className="field-console-status">{note}</p> : null}
            <p className="meta-line" style={{ marginTop: 12 }}>
              Dispatches CI with <code>simulate_failure={selected.id}</code> so
              Heal Court can move without breaking live collectors. Real heals
              still run on cron with Bright Data in Actions secrets.
            </p>
          </aside>
        </div>
      ) : null}
    </>
  );
}
