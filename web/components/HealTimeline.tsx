import type { HealEvent } from "@/lib/types";

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso || "undated";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function HealTimeline({ events }: { events: HealEvent[] }) {
  return (
    <section className="panel heal-panel">
      <div className="panel-head">
        <span>Heal log</span>
        <span>{events.length} entries</span>
      </div>
      {events.length === 0 ? (
        <div className="chart-empty">No heal events recorded yet</div>
      ) : (
        <ol className="heal-list">
          {events.map((event, i) => (
            <li
              key={`${event.at}-${i}`}
              className={`heal-item ${event.simulated ? "simulated" : ""}`}
            >
              <div className="heal-meta">
                <time dateTime={event.at}>{formatWhen(event.at)}</time>
                {event.simulated ? (
                  <span className="scar sim">simulated test run</span>
                ) : (
                  <span className="scar">live</span>
                )}
                {event.store ? <span className="heal-store">{event.store}</span> : null}
              </div>
              <p className="heal-title">{event.title}</p>
              {event.whatBroke ? <p className="heal-broke">{event.whatBroke}</p> : null}
              {event.outcome ? <p className="heal-out">{event.outcome}</p> : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
