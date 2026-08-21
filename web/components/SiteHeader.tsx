"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GITHUB_REPO, NAV } from "@/lib/nav";

export function SiteHeader({
  active,
  variant = "interior",
}: {
  active: "home" | "product" | "cases" | "contact";
  variant?: "landing" | "interior";
}) {
  const [open, setOpen] = useState(false);
  const headerClass = variant === "landing" ? "header" : "app-header";

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 720) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const links = NAV.map((item) => (
    <Link
      key={item.id}
      className={`nav-link${active === item.id ? " active" : ""}`}
      href={item.href}
      onClick={() => setOpen(false)}
    >
      {item.label}
    </Link>
  ));

  return (
    <>
      <header className={headerClass}>
        <Link className="logo" href="/" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.webp" alt="" width={52} height={52} />
        </Link>
        <nav className="nav-pill desktop-nav" aria-label="Primary">
          {links}
        </nav>
        <a
          className="sign-in desktop-signin"
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer"
        >
          Star on GitHub
        </a>
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
      </header>

      <div
        className="overlay"
        hidden={!open}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div className="mobile-menu" id="mobile-menu" hidden={!open}>
        {links}
        <a
          className="sign-in mobile-signin"
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
