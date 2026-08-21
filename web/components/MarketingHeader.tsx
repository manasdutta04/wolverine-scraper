"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GITHUB_REPO, MARKETING_ANCHORS } from "@/lib/nav";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

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

  const anchors = MARKETING_ANCHORS.map((item) => (
    <a
      key={item.href}
      className="nav-link"
      href={item.href}
      onClick={() => setOpen(false)}
    >
      {item.label}
    </a>
  ));

  return (
    <>
      <header className="header marketing-header">
        <Link className="logo" href="/" aria-label="Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.webp" alt="" width={52} height={52} />
        </Link>
        <nav className="nav-pill desktop-nav" aria-label="Primary">
          {anchors}
        </nav>
        <div className="header-actions desktop-signin">
          <a
            className="sign-in"
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
          </a>
          <Link className="cta-mini" href="/app">
            Get Started
          </Link>
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
          className="sign-in mobile-signin"
          href={GITHUB_REPO}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          Star on GitHub
        </a>
        <Link
          className="sign-in mobile-signin"
          href="/app"
          onClick={() => setOpen(false)}
          style={{ background: "#fff", color: "#000" }}
        >
          Get Started
        </Link>
      </div>
    </>
  );
}
