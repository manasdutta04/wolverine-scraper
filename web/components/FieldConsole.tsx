"use client";

import { useCallback, useEffect, useState } from "react";
import { ACTIONS_WORKFLOW } from "@/lib/nav";
import { formatAge, formatWhen } from "@/lib/format";
import { useScar } from "@/components/ScarProvider";

type DispatchResult = {
  ok: boolean;
  dispatched?: boolean;
  reason?: string;
  message?: string;
  actionsUrl?: string;
};

export function FieldConsole() {
  const {
    data,
    refreshing,
    autoRefresh,
    setAutoRefresh,
    lastOkAt,
    error,
    refresh,
  } = useScar();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const dispatch = useCallback(
    async (simulateFailure = "") => {
      setBusy(true);
      setStatus(null);
      try {
        const res = await fetch("/api/field/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ simulateFailure }),
        });
        const json = (await res.json()) as DispatchResult;
        if (json.dispatched) {
          setStatus(
            json.message ||
              "Field scrape dispatched. Poll will pick up scar.json after CI exports.",
          );
          window.setTimeout(() => void refresh(), 8_000);
        } else {
          setStatus(json.message || "Could not dispatch from this host.");
          if (json.reason === "missing_pat" && json.actionsUrl) {
            window.open(json.actionsUrl, "_blank", "noopener,noreferrer");
          }
        }
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "dispatch failed");
      } finally {
        setBusy(false);
      }
    },
    [refresh],
  );

  const snapshotAge = formatAge(data.generatedAt, now);
  const scrapeLabel = formatWhen(data.lastScrapedAt);
  const pollAge = lastOkAt
    ? formatAge(new Date(lastOkAt).toISOString(), now)
    : null;

  return (
    <section className="field-console" aria-label="Field console">
      <div className="field-console-head">
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>
            {"// FIELD_CONSOLE"}
          </p>
          <strong className="field-console-title">Live Scar Feed</strong>
          <p className="meta-line" style={{ marginTop: 6 }}>
            exported {snapshotAge}
            {" · "}
            last scrape {scrapeLabel}
            {refreshing ? " · polling…" : ""}
            {pollAge ? ` · poll ${pollAge}` : ""}
            {error ? ` · ${error}` : ""}
          </p>
        </div>
        <div className="field-console-actions">
          <button
            type="button"
            className={`chip${autoRefresh ? " on" : ""}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            Auto {autoRefresh ? "on" : "off"}
          </button>
          <button
            type="button"
            className="chip"
            disabled={refreshing || busy}
            onClick={() => void refresh()}
          >
            Poll now
          </button>
          <button
            type="button"
            className="chip on"
            disabled={busy}
            onClick={() => void dispatch("")}
            title="Dispatch scrape.yml (Bright Data runs in GitHub Actions)"
          >
            {busy ? "Dispatching…" : "Run field scrape"}
          </button>
          <button
            type="button"
            className="chip"
            disabled={busy}
            onClick={() => void dispatch("sparkfun")}
          >
            Simulate red-flag
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
      </div>
      {status ? <p className="field-console-status">{status}</p> : null}
    </section>
  );
}
