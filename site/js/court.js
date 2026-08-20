import { initChrome, loadScar, escapeHtml } from "./shared.js";

initChrome();

loadScar()
  .then((data) => {
    const court = document.getElementById("court");
    court.innerHTML = (data.pulse || [])
      .map(
        (p) => `
      <article class="court-card ${escapeHtml(p.verdict || "release")}">
        <h3>${escapeHtml(p.name || p.id)}</h3>
        <p class="verdict">${escapeHtml(p.verdict || "release")}</p>
        <p class="reason">${escapeHtml(p.reason || "")}</p>
        <p class="meta-line" style="margin-top:10px">${p.rows || 0} rows · ${escapeHtml(
          (p.collectorId || "").slice(0, 14),
        )}…</p>
      </article>`,
      )
      .join("");

    const held = (data.suppressed || []).length;
    document.getElementById("note").textContent = held
      ? `${held} signal(s) held because a store failed court.`
      : "All collectors clear. Scar Feed is allowed to speak.";
  })
  .catch(() => {
    document.getElementById("note").textContent =
      "Could not load scar.json. Run npm run scar:export.";
  });
