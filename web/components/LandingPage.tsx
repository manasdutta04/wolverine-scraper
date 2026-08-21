"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SiteHeader } from "./SiteHeader";

const STATS = [
  { icon: "#", target: 4, decimals: 0, suffix: "", label: "Stores Tracked", delay: "0.5s" },
  { icon: "*", target: 60, decimals: 0, suffix: "", label: "Live Signals", delay: "0.58s" },
  { icon: "%", target: 3, decimals: 0, suffix: "", label: "Court Verdicts", delay: "0.66s" },
  { icon: "<", target: 1150, decimals: 0, suffix: "", label: "Catalog Rows", delay: "0.74s" },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function LandingPage() {
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.classList.add("is-landing");
    return () => document.body.classList.remove("is-landing");
  }, []);

  useEffect(() => {
    const root = statsRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".stat"));

    const run = () => {
      nodes.forEach((el, index) => {
        const target = Number(el.dataset.target);
        const decimals = Number(el.dataset.decimals || 0);
        const suffix = el.dataset.suffix || "";
        const valueEl = el.querySelector(".stat-value");
        if (!valueEl || Number.isNaN(target)) return;
        const duration = 1500 + index * 80;
        const startOffset = 480 + index * 90;
        const start = performance.now() + startOffset;
        const frame = (now: number) => {
          if (now < start) {
            requestAnimationFrame(frame);
            return;
          }
          const t = Math.min(1, (now - start) / duration);
          valueEl.textContent = `${(target * easeOutCubic(t)).toFixed(decimals)}${suffix}`;
          if (t < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => {
        const target = Number(el.dataset.target);
        const decimals = Number(el.dataset.decimals || 0);
        const suffix = el.dataset.suffix || "";
        const valueEl = el.querySelector(".stat-value");
        if (valueEl) valueEl.textContent = `${target.toFixed(decimals)}${suffix}`;
      });
      return;
    }

    let started = false;
    const kick = () => {
      if (started) return;
      started = true;
      run();
    };
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && kick()),
      { threshold: 0.25 },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="bg" aria-hidden="true">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="page">
        <SiteHeader active="home" variant="landing" />

        <main className="hero">
          <div className="trust anim" style={{ ["--d" as string]: "0.05s" }}>
            <div className="trust-avatars" aria-hidden="true">
              <span className="trust-avatar a1">
                <i className="fa-solid fa-microchip" />
              </span>
              <span className="trust-avatar a2">
                <i className="fa-brands fa-raspberry-pi" />
              </span>
              <span className="trust-avatar a3">
                <i className="fa-solid fa-bolt" />
              </span>
            </div>
            <div className="trust-pill">4 niche electronics stores</div>
          </div>

          <h1 className="headline">
            <span className="headline-line" style={{ ["--d" as string]: "0.12s" }}>
              Scar Feed
            </span>
            <span className="headline-line" style={{ ["--d" as string]: "0.3s" }}>
              Will Not Cry Wolf
            </span>
          </h1>

          <p className="subhead anim" style={{ ["--d" as string]: "0.28s" }}>
            Restock radar for niche electronics. Bright Data scrapers heal when
            the page changes - Heal Court blocks false restocks before they hit
            the feed.
          </p>

          <Link
            className="cta anim"
            style={{ ["--d" as string]: "0.4s" }}
            href="/product"
          >
            Open Scar Feed
          </Link>
        </main>

        <footer className="stats" ref={statsRef}>
          {STATS.map((s) => (
            <div
              key={s.label}
              className="stat anim"
              style={{ ["--d" as string]: s.delay }}
              data-target={s.target}
              data-decimals={s.decimals}
              data-suffix={s.suffix}
            >
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">0</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </footer>
      </div>
    </>
  );
}
