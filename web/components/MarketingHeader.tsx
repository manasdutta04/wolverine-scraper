"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GITHUB_REPO, MARKETING_ANCHORS } from "@/lib/nav";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 820) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const ids = MARKETING_ANCHORS.map((a) => a.href.slice(1));
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current ? `#${current}` : "");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const anchors = MARKETING_ANCHORS.map((item) => (
    <a
      key={item.href}
      className={`nav-link${active === item.href ? " active" : ""}`}
      href={item.href}
      onClick={() => setOpen(false)}
    >
      {item.label}
    </a>
  ));

  return (
    <>
      <header
        className={`site-nav sticky-header${scrolled ? " scrolled" : ""}`}
      >
        <div className="site-nav-inner">
          <Link className="logo" href="/" aria-label="Scar Feed home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.webp" alt="" width={40} height={40} />
            <span className="logo-word">Scar Feed</span>
          </Link>

          <nav className="nav-pill desktop-nav" aria-label="Primary">
            {anchors}
          </nav>

          <div className="header-actions desktop-signin">
            <a
              className="nav-github"
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
            >
              Star on GitHub
            </a>
          </div>

          <button
            className="burger"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className="overlay"
        hidden={!open}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        {anchors}
        <a
          className="nav-github mobile-signin"
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          Star on GitHub
        </a>
      </div>
    </>
  );
}
