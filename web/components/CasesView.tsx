import { formatWhen } from "@/lib/format";
import type { ScarPayload } from "@/lib/types";

export function CasesView({ data }: { data: ScarPayload }) {
  const events = data.heals || [];
  return (
    <>
      <p className="meta-line">{events.length} entries</p>
      <ul className="case-list">
        {events.length === 0 ? (
          <li className="empty">No heal events yet. See heal-log.md after a court run.</li>
        ) : (
          events.map((e, i) => (
            <li key={`${e.at}-${i}`} className="case-item">
              <span className="case-tag">{e.simulated ? "simulated" : "live"}</span>
              <div>
                <p>
                  <strong>{e.title || "Heal event"}</strong>
                </p>
                <p className="meta-line">
                  {formatWhen(e.at)}
                  {e.store ? ` · ${e.store}` : ""}
                </p>
                {e.whatBroke ? <p style={{ marginTop: 8 }}>{e.whatBroke}</p> : null}
                {e.outcome ? (
                  <p className="meta-line" style={{ marginTop: 6 }}>
                    {e.outcome}
                  </p>
                ) : null}
              </div>
              <span className={`trust-chip ${e.simulated ? "bad" : "ok"}`}>
                {e.simulated ? "test" : "field"}
              </span>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
