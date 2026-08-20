(() => {
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

  function toggleMenu() {
    if (!burger) return;
    const open = burger.getAttribute("aria-expanded") === "true";
    if (open) closeMenu();
    else openMenu();
  }

  burger?.addEventListener("click", toggleMenu);
  overlay?.addEventListener("click", closeMenu);
  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(el, index) {
    const target = Number(el.dataset.target);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const valueEl = el.querySelector(".stat-value");
    if (!valueEl || Number.isNaN(target)) return;

    const duration = 1500 + index * 80;
    const startOffset = 480 + index * 90;
    const start = performance.now() + startOffset;

    function frame(now) {
      if (now < start) {
        requestAnimationFrame(frame);
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      const value = target * easeOutCubic(t);
      valueEl.textContent = `${value.toFixed(decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  const stats = Array.from(document.querySelectorAll(".stat"));
  if (!stats.length) return;

  let started = false;
  const kick = () => {
    if (started) return;
    started = true;
    stats.forEach((stat, i) => animateStat(stat, i));
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stats.forEach((stat) => {
      const target = Number(stat.dataset.target);
      const decimals = Number(stat.dataset.decimals || 0);
      const suffix = stat.dataset.suffix || "";
      const valueEl = stat.querySelector(".stat-value");
      if (valueEl) valueEl.textContent = `${target.toFixed(decimals)}${suffix}`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) kick();
      });
    },
    { threshold: 0.25 },
  );

  const footer = document.querySelector(".stats");
  if (footer) observer.observe(footer);
  else kick();
})();
