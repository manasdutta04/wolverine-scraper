export async function loadScar() {
  const res = await fetch("./data/scar.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`scar.json ${res.status}`);
  return res.json();
}

export function formatWhen(iso) {
  if (!iso) return "never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatPrice(price, currency) {
  if (price == null || !Number.isFinite(price)) return "n/a";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  } catch {
    return `${price} ${currency || ""}`.trim();
  }
}

export function initChrome() {
  const burger = document.querySelector(".burger");
  const overlay = document.querySelector(".overlay");
  const menu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (!burger || !overlay || !menu) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    overlay.hidden = true;
    menu.hidden = true;
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!burger || !overlay || !menu) return;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    overlay.hidden = false;
    menu.hidden = false;
    document.body.classList.add("menu-open");
  }

  burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    if (open) closeMenu();
    else openMenu();
  });
  overlay?.addEventListener("click", closeMenu);
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
