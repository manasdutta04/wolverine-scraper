"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MarketingHeader } from "./MarketingHeader";
import {
  ACTIONS,
  COLLECTORS,
  GITHUB_REPO,
  HEAL_LOG,
  SAMPLE_OUTPUT,
} from "@/lib/nav";

const STATS = [
  { icon: "#", target: 4, decimals: 0, suffix: "", label: "Studio collectors", delay: "0.5s" },
  { icon: "*", target: 60, decimals: 0, suffix: "", label: "Live signals", delay: "0.58s" },
  { icon: "%", target: 3, decimals: 0, suffix: "", label: "Court verdicts", delay: "0.66s" },
  { icon: "<", target: 1150, decimals: 0, suffix: "", label: "Catalog rows", delay: "0.74s" },
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
    <div className="landing-root">
      <div className="bg" aria-hidden="true">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
        <div className="bg-veil" />
      </div>

      <div className="page hero-page">
        <MarketingHeader />

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
            Restock radar for niche electronics. Bright Data Scraper Studio heals
            when pages change — Heal Court blocks false restocks before they hit
            the feed.
          </p>

          <div className="cta-row anim" style={{ ["--d" as string]: "0.4s" }}>
            <Link className="cta" href="/app">
              Get Started
            </Link>
            <a
              className="cta ghost"
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
            >
              Star on GitHub
            </a>
          </div>
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

      <section className="mkt-section" id="problem">
        <p className="mkt-kicker">Problem</p>
        <h2 className="mkt-title">Broken scrapers invent restocks</h2>
        <p className="mkt-body">
          Makers hunt scarce boards across Adafruit, SparkFun, Pimoroni, and The
          Pi Hut. A clone price or empty stock field looks like “back in stock”
          and wastes a buy. Silence is better than a false alarm.
        </p>
      </section>

      <section className="mkt-section" id="product">
        <p className="mkt-kicker">Product</p>
        <h2 className="mkt-title">Scar Feed + Heal Court</h2>
        <div className="mkt-grid">
          <article>
            <h3>Scar Feed</h3>
            <p>
              Plain-English signals: scarcity across stores, cheapest in-stock,
              restocks and price cuts — trusted only when the batch clears court.
            </p>
          </article>
          <article>
            <h3>Heal Court</h3>
            <p>
              Every red-flag run gets a verdict: <strong>release</strong>,{" "}
              <strong>repair</strong> (Bright Data heal → approve → re-run), or{" "}
              <strong>refuse</strong> (still cloned → suppress signals).
            </p>
          </article>
        </div>
      </section>

      <section className="mkt-section" id="studio">
        <p className="mkt-kicker">Bright Data Scraper Studio</p>
        <h2 className="mkt-title">Custom collectors. Agent-driven CLI. Real heals.</h2>
        <p className="mkt-body">
          Not a prebuilt dataset. Four Studio collectors, pinned forever, driven
          by <code>bdata scraper create / run / heal / approve</code>, written to
          SQLite, then exported into the app. CI cron keeps the loop honest.
        </p>
        <ul className="collector-list">
          {COLLECTORS.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              <code>{c.collectorId}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="mkt-section" id="proof">
        <p className="mkt-kicker">Proof</p>
        <h2 className="mkt-title">Evidence for judges — not a staged feed dump</h2>
        <div className="mkt-links">
          <a href={HEAL_LOG} target="_blank" rel="noreferrer">
            heal-log.md
          </a>
          <a href={SAMPLE_OUTPUT} target="_blank" rel="noreferrer">
            sample structured output
          </a>
          <a href={ACTIONS} target="_blank" rel="noreferrer">
            GitHub Actions cron + heal
          </a>
        </div>
        <Link className="cta mkt-cta" href="/app">
          Enter Scar Feed
        </Link>
      </section>

      <footer className="mkt-footer" id="contact">
        <p>
          Wolverine · Scar Feed — public demo, no Bright Data key on the site.
        </p>
        <div className="mkt-links">
          <Link href="/contact">Contact</Link>
          <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://hub.docker.com/r/manasdutta04/wolverine-dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Docker Hub
          </a>
        </div>
      </footer>
    </div>
  );
}
