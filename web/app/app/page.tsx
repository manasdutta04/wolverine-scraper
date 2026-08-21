import Link from "next/link";
import { COLLECTORS } from "@/lib/nav";
import { formatWhen } from "@/lib/format";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "App" };

export default function AppOverviewPage() {
  const data = loadScar();
  const preview = (data.feed || []).filter((s) => s.trust).slice(0, 5);

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Workspace</p>
        <h1 className="page-title">Scar Feed</h1>
        <p className="page-lede">
          Live structured output from Bright Data Scraper Studio. Heal Court
          gates trust before any restock signal can cry wolf.
        </p>
      </section>

      <div className="overview-grid">
        <div className="overview-card">
          <h3>Store pulse</h3>
          <div className="pulse-row">
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
          <p className="meta-line" style={{ marginTop: 12 }}>
            {data.feed?.length || 0} signals · {data.current?.length || 0} rows ·
            last scrape {formatWhen(data.lastScrapedAt)}
          </p>
        </div>

        <div className="overview-card">
          <h3>Studio collectors</h3>
          <ul className="collector-list" style={{ marginTop: 0 }}>
            {COLLECTORS.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>
                <code>{c.collectorId}</code>
              </li>
            ))}
          </ul>
          <p className="meta-line" style={{ marginTop: 12 }}>
            <Link href="/app/studio">Open Studio →</Link>
          </p>
        </div>

        <div className="overview-card" style={{ gridColumn: "1 / -1" }}>
          <h3>Latest trusted signals</h3>
          {preview.length === 0 ? (
            <p className="empty">No trusted signals yet. Run scar:export.</p>
          ) : (
            <ul className="feed-list">
              {preview.map((s, i) => (
                <li
                  key={`${s.type}-${s.store}-${i}`}
                  className="feed-item"
                >
                  <span className="feed-type">
                    {String(s.type || "").replace("_", " ")}
                  </span>
                  <p>{s.text}</p>
                  <span className="trust-chip ok">trusted</span>
                </li>
              ))}
            </ul>
          )}
          <p className="meta-line" style={{ marginTop: 12 }}>
            <Link href="/app/feed">Open full feed →</Link>
            {" · "}
            <Link href="/app/court">Heal Court →</Link>
          </p>
        </div>
      </div>
    </>
  );
}
