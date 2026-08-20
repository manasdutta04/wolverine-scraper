import { initChrome, loadScar, escapeHtml, formatWhen } from "./shared.js";

initChrome();

loadScar()
  .then((data) => {
    const events = data.heals || [];
    document.getElementById("count").textContent = `${events.length} entries`;
    document.getElementById("cases").innerHTML = events.length
      ? events
          .map(
            (e) => `
        <li class="case-item">
          <span class="case-tag">${e.simulated ? "simulated" : "live"}</span>
          <div>
            <p><strong>${escapeHtml(e.title || "Heal event")}</strong></p>
            <p class="meta-line">${escapeHtml(formatWhen(e.at))}${
              e.store ? ` · ${escapeHtml(e.store)}` : ""
            }</p>
            ${e.whatBroke ? `<p style="margin-top:8px">${escapeHtml(e.whatBroke)}</p>` : ""}
            ${e.outcome ? `<p class="meta-line" style="margin-top:6px">${escapeHtml(e.outcome)}</p>` : ""}
          </div>
          <span class="trust-chip ${e.simulated ? "bad" : "ok"}">${
            e.simulated ? "test" : "field"
          }</span>
        </li>`,
          )
          .join("")
      : `<li class="empty">No heal events yet. See heal-log.md after a court run.</li>`;
  })
  .catch(() => {
    document.getElementById("count").textContent =
      "Could not load scar.json. Run npm run scar:export.";
  });
