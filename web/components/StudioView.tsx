"use client";

import { useCallback, useState } from "react";
import { ACTIONS_WORKFLOW, COLLECTORS } from "@/lib/nav";
import { useScar } from "@/components/ScarProvider";

const STEPS = [
  {
    label: "create",
    cmd: 'bdata scraper create <url> "fields"',
  },
  {
    label: "run",
    cmd: "bdata scraper run <collector_id>",
  },
  {
    label: "heal",
    cmd: 'bdata scraper heal <collector_id> "what broke"',
  },
  {
    label: "approve",
    cmd: "bdata scraper approve <collector_id>",
  },
  {
    label: "export",
    cmd: "npm run scar:export",
  },
];

export function StudioView() {
  const { data } = useScar();
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const copy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  }, []);

  const dispatch = useCallback(async () => {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/field/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = (await res.json()) as {
        dispatched?: boolean;
        message?: string;
        reason?: string;
        actionsUrl?: string;
      };
      setNote(json.message || (json.dispatched ? "Dispatched." : "See Actions."));
      if (!json.dispatched && json.reason === "missing_pat" && json.actionsUrl) {
        window.open(json.actionsUrl, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      setNote(e instanceof Error ? e.message : "dispatch failed");
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Best Use of Bright Data</p>
        <h1 className="page-title">Scraper Studio</h1>
        <p className="page-lede">
          Four custom collectors for long-tail hobby stores — not the prebuilt
          library. Driven from a coding agent via the Bright Data CLI. This UI
          dispatches CI; the API key never leaves GitHub Actions.
        </p>
      </section>

      <div className="overview-card">
        <h3>Live pulse</h3>
        <div className="pulse-row" style={{ marginTop: 10 }}>
          {(data.pulse || []).map((p) => (
            <span
              key={p.id}
              className={`pill ${p.trust ? "ok" : "bad"}`}
              title={p.reason}
            >
              {p.name}: {p.verdict}
            </span>
          ))}
        </div>
        <div className="field-console-actions" style={{ marginTop: 14 }}>
          <button
            type="button"
            className="chip on"
            disabled={busy}
            onClick={() => void dispatch()}
          >
            {busy ? "Dispatching…" : "Run field scrape"}
          </button>
          <a className="chip" href={ACTIONS_WORKFLOW} target="_blank" rel="noreferrer">
            Actions workflow →
          </a>
        </div>
        {note ? <p className="field-console-status">{note}</p> : null}
      </div>

      <div className="overview-card" style={{ marginTop: 14 }}>
        <h3>Pinned collectors</h3>
        <ul className="collector-list" style={{ marginTop: 0 }}>
          {COLLECTORS.map((c) => (
            <li key={c.id}>
              <div>
                <strong>{c.name}</strong>
                <div className="meta-line" style={{ marginTop: 4 }}>
                  <a href={c.url} target="_blank" rel="noreferrer">
                    listing URL
                  </a>
                </div>
              </div>
              <div className="studio-copy-row">
                <code>{c.collectorId}</code>
                <button
                  type="button"
                  className="chip"
                  onClick={() => void copy(c.collectorId, c.id)}
                >
                  {copied === c.id ? "Copied" : "Copy id"}
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() =>
                    void copy(`bdata scraper run ${c.collectorId}`, `run-${c.id}`)
                  }
                >
                  {copied === `run-${c.id}` ? "Copied" : "Copy run"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="overview-card" style={{ marginTop: 14 }}>
        <h3>CLI verbs</h3>
        <ul className="studio-cmd-list">
          {STEPS.map((s) => (
            <li key={s.label}>
              <code>{s.cmd}</code>
              <button
                type="button"
                className="chip"
                onClick={() => void copy(s.cmd, s.label)}
              >
                {copied === s.label ? "Copied" : "Copy"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
