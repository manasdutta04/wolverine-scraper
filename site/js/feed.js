import { initChrome, loadScar, escapeHtml } from "./shared.js";

initChrome();

const state = {
  data: null,
  store: "all",
  trustedOnly: true,
  shown: 24,
};

const feedEl = document.getElementById("feed");
const countEl = document.getElementById("count");
const moreBtn = document.getElementById("more");
const storeSel = document.getElementById("store");
const trustedBtn = document.getElementById("trusted");
const suppressedBtn = document.getElementById("suppressed");

function filtered() {
  const all = [
    ...(state.data.feed || []),
    ...(state.trustedOnly ? [] : state.data.suppressed || []),
  ];
  return all.filter((s) => {
    if (state.store !== "all" && s.store !== state.store) return false;
    if (state.trustedOnly && !s.trust) return false;
    return true;
  });
}

function render() {
  const rows = filtered();
  countEl.textContent = `${rows.length} live signals`;
  feedEl.innerHTML = rows
    .slice(0, state.shown)
    .map(
      (s) => `
      <li class="feed-item">
        <span class="feed-type">${escapeHtml(String(s.type || "").replace("_", " "))}</span>
        <p>${escapeHtml(s.text || "")}</p>
        <span class="trust-chip ${s.trust ? "ok" : "bad"}">${
          s.trust ? "trusted" : escapeHtml(s.verdict || "held")
        }</span>
      </li>`,
    )
    .join("");
  moreBtn.hidden = state.shown >= rows.length;
}

trustedBtn.addEventListener("click", () => {
  state.trustedOnly = true;
  trustedBtn.classList.add("on");
  suppressedBtn.classList.remove("on");
  state.shown = 24;
  render();
});

suppressedBtn.addEventListener("click", () => {
  state.trustedOnly = false;
  suppressedBtn.classList.add("on");
  trustedBtn.classList.remove("on");
  state.shown = 24;
  render();
});

storeSel.addEventListener("change", () => {
  state.store = storeSel.value;
  state.shown = 24;
  render();
});

moreBtn.addEventListener("click", () => {
  state.shown += 24;
  render();
});

loadScar()
  .then((data) => {
    state.data = data;
    for (const p of data.pulse || []) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      storeSel.appendChild(opt);
    }
    render();
  })
  .catch(() => {
    countEl.textContent = "Could not load scar.json. Run npm run scar:export.";
  });
