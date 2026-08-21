import type { ScarPayload } from "@/lib/types";

export function CourtView({ data }: { data: ScarPayload }) {
  const held = (data.suppressed || []).length;
  return (
    <>
      <div className="court-grid">
        {(data.pulse || []).map((p) => (
          <article key={p.id} className={`court-card ${p.verdict || "release"}`}>
            <h3>{p.name || p.id}</h3>
            <p className="verdict">{p.verdict || "release"}</p>
            <p className="reason">{p.reason || ""}</p>
            <p className="meta-line" style={{ marginTop: 10 }}>
              {p.rows || 0} rows · {(p.collectorId || "").slice(0, 14)}…
            </p>
          </article>
        ))}
      </div>
      <p className="meta-line" style={{ marginTop: 18 }}>
        {held
          ? `${held} signal(s) held because a store failed court.`
          : "All collectors clear. Scar Feed is allowed to speak."}
      </p>
    </>
  );
}
