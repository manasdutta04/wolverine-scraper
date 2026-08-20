import {
  initChrome,
  loadScar,
  escapeHtml,
  formatPrice,
} from "./shared.js";

initChrome();

const state = {
  data: null,
  store: "all",
  query: "",
  shown: 60,
  selected: null,
};

const tbody = document.getElementById("tbody");
const countEl = document.getElementById("count");
const moreBtn = document.getElementById("more");
const storeSel = document.getElementById("store");
const qInput = document.getElementById("q");
const chartTitle = document.getElementById("chart-title");
const chartNote = document.getElementById("chart-note");
const chartEl = document.getElementById("chart");

function key(row) {
  return `${row.store}::${row.product_url || row.product_name}`;
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  return (state.data.current || []).filter((row) => {
    if (state.store !== "all" && row.store !== state.store) return false;
    if (!q) return true;
    return (
      String(row.product_name || "").toLowerCase().includes(q) ||
      String(row.product_url || "").toLowerCase().includes(q)
    );
  });
}

function drawChart(row) {
  chartTitle.textContent = row?.product_name || "none selected";
  if (!row || row.price == null) {
    chartNote.textContent = "Select a product with a price.";
    chartEl.innerHTML = "";
    return;
  }

  const batches = state.data.batchCount || 1;
  chartNote.textContent =
    batches <= 1
      ? "One snapshot so far. The line fills in after the next scrape batch."
      : `${batches} scrape batches in SQLite. Showing live price for this SKU.`;

  const width = 920;
  const height = 220;
  const pad = { top: 24, right: 24, bottom: 36, left: 56 };
  const x = pad.left + (width - pad.left - pad.right) / 2;
  const y = pad.top + (height - pad.top - pad.bottom) / 2;
  const label = formatPrice(row.price, row.currency);

  chartEl.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img">
      <title>${escapeHtml(row.product_name)} price</title>
      <line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" stroke="#2a2a2c" stroke-dasharray="3 6" />
      <circle cx="${x}" cy="${y}" r="7" fill="#000" stroke="#fff" stroke-width="2" />
      <text x="${x}" y="${height - 12}" text-anchor="middle" fill="#8e8e8e" font-size="11" font-family="Inter, sans-serif">${escapeHtml(label)}</text>
    </svg>`;
}

function render() {
  const rows = filtered();
  countEl.textContent = `Showing ${Math.min(state.shown, rows.length)} of ${rows.length}`;
  const visible = rows.slice(0, state.shown);
  if (!state.selected && visible[0]) state.selected = key(visible[0]);

  tbody.innerHTML = visible
    .map((row) => {
      const k = key(row);
      const selected = state.selected === k ? "selected" : "";
      const name = row.product_url
        ? `<a class="product-link" href="${escapeHtml(row.product_url)}" target="_blank" rel="noreferrer">${escapeHtml(row.product_name)}</a>`
        : escapeHtml(row.product_name);
      return `
        <tr class="clickable ${selected}" data-key="${escapeHtml(k)}">
          <td>${name}</td>
          <td class="mono">${escapeHtml(formatPrice(row.price, row.currency))}</td>
          <td class="mono">${escapeHtml(row.stock_status || "unknown")}</td>
          <td class="mono">${escapeHtml(row.store)}</td>
        </tr>`;
    })
    .join("");

  moreBtn.hidden = state.shown >= rows.length;

  const selectedRow =
    visible.find((r) => key(r) === state.selected) || visible[0];
  drawChart(selectedRow);
}

tbody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr[data-key]");
  if (!tr) return;
  if (e.target.closest("a")) return;
  state.selected = tr.getAttribute("data-key");
  render();
});

storeSel.addEventListener("change", () => {
  state.store = storeSel.value;
  state.shown = 60;
  state.selected = null;
  render();
});

qInput.addEventListener("input", () => {
  state.query = qInput.value;
  state.shown = 60;
  state.selected = null;
  render();
});

moreBtn.addEventListener("click", () => {
  state.shown += 60;
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
