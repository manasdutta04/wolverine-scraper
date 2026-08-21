"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ACTIONS,
  COLLECTORS,
  GITHUB_REPO,
  HEAL_LOG,
  SAMPLE_OUTPUT,
  SHOWCASE_VIDEO,
} from "@/lib/nav";
import { MarketingHeader } from "./MarketingHeader";

const METRICS = [
  { value: "4", label: "Studio collectors" },
  { value: "60+", label: "Trusted signals" },
  { value: "3", label: "Court verdicts" },
  { value: "1.1k", label: "Catalog rows" },
];

const VERDICTS = [
  {
    name: "Release",
    copy: "Batch clears. Signals go live in Scar Feed.",
  },
  {
    name: "Repair",
    copy: "Bright Data heal → approve → re-run until fields hold.",
  },
  {
    name: "Refuse",
    copy: "Still cloned or empty? Suppress the noise. Stay quiet.",
  },
];

export function LandingPage() {
  useEffect(() => {
    document.body.classList.add("is-landing");
    return () => document.body.classList.remove("is-landing");
  }, []);

  return (
    <div className="landing-root">
      <div className="hero-atmosphere" aria-hidden="true" />
      <MarketingHeader />

      <section className="hero-page">
        <div className="rail hero-rail">
          <p className="hero-eyebrow anim" style={{ ["--d" as string]: "0.04s" }}>
            Wolverine · Bright Data Scraper Studio
          </p>
          <h1 className="headline">
            <span className="headline-line" style={{ ["--d" as string]: "0.1s" }}>
              Scar Feed
            </span>
            <span className="headline-line" style={{ ["--d" as string]: "0.24s" }}>
              Will Not Cry Wolf
            </span>
          </h1>
          <p className="subhead anim" style={{ ["--d" as string]: "0.34s" }}>
            Restock radar for niche electronics. Studio collectors heal when pages
            change. Heal Court blocks false restocks before they hit the feed.
          </p>
          <div className="cta-row anim" style={{ ["--d" as string]: "0.42s" }}>
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
        </div>
      </section>

      <section className="showcase" id="showcase" aria-label="Field showcase">
        <div className="showcase-frame">
          <video className="showcase-video" autoPlay muted loop playsInline>
            <source src={SHOWCASE_VIDEO} type="video/mp4" />
          </video>
          <div className="rail showcase-caption-rail">
            <div className="showcase-caption">
              <span>Field feed</span>
              <p>Studio collectors healing in the field</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-problem" id="problem">
        <div className="rail split">
          <div className="split-label">
            <p className="mkt-kicker">Problem</p>
            <h2 className="mkt-title">Broken scrapers invent restocks</h2>
          </div>
          <div className="split-body">
            <p className="mkt-body">
              Makers hunt scarce boards across Adafruit, SparkFun, Pimoroni, and
              The Pi Hut. A clone price or empty stock field looks like “back in
              stock” and wastes a buy.
            </p>
            <p className="mkt-body emphasis">
              Silence is better than a false alarm.
            </p>
          </div>
        </div>
      </section>

      <section className="band band-product" id="product">
        <div className="rail">
          <div className="section-head">
            <p className="mkt-kicker">Product</p>
            <h2 className="mkt-title">Scar Feed + Heal Court</h2>
            <p className="mkt-lede">
              Trusted signals only. Court decides what the feed is allowed to say.
            </p>
          </div>

          <div className="metric-strip" role="list">
            {METRICS.map((m) => (
              <div key={m.label} className="metric-chip" role="listitem">
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>

          <div className="feature-pair">
            <article className="feature-block">
              <h3>Scar Feed</h3>
              <p>
                Plain-English signals: scarcity across stores, cheapest in-stock,
                restocks and price cuts — trusted only when the batch clears court.
              </p>
            </article>
            <article className="feature-block">
              <h3>Heal Court</h3>
              <p>
                Every red-flag run gets a verdict before noise reaches the feed.
              </p>
            </article>
          </div>

          <ul className="verdict-row">
            {VERDICTS.map((v) => (
              <li key={v.name}>
                <strong>{v.name}</strong>
                <span>{v.copy}</span>
              </li>
            ))}
          </ul>

          <div className="inline-cta">
            <Link className="cta" href="/app">
              Get Started
            </Link>
            <p>Open the live workspace — Feed, Court, Studio.</p>
          </div>
        </div>
      </section>

      <section className="band band-studio" id="studio">
        <div className="rail">
          <div className="section-head">
            <p className="mkt-kicker">Bright Data Scraper Studio</p>
            <h2 className="mkt-title">Custom collectors. Agent CLI. Real heals.</h2>
            <p className="mkt-lede">
              Not a prebuilt dataset. Four Studio collectors, pinned forever,
              driven by{" "}
              <code>bdata scraper create / run / heal / approve</code>, written to
              SQLite, exported into the app. CI cron keeps the loop honest.
            </p>
          </div>

          <ul className="collector-table">
            {COLLECTORS.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>
                <code>{c.collectorId}</code>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band band-proof" id="proof">
        <div className="rail">
          <div className="section-head">
            <p className="mkt-kicker">Proof</p>
            <h2 className="mkt-title">Evidence for judges — not a staged dump</h2>
            <p className="mkt-lede">
              Git history, heal journal, Actions cron, and sample structured
              output. The demo is the product.
            </p>
          </div>
          <div className="proof-links">
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
        </div>
      </section>

      <section className="band band-close" aria-label="Get started">
        <div className="rail close-panel">
          <div>
            <p className="mkt-kicker">Enter the feed</p>
            <h2 className="mkt-title close-title">Ready when the page gets cut up</h2>
            <p className="mkt-lede">
              Public demo — no Bright Data key on the site. Jump into Scar Feed
              or star the repo.
            </p>
          </div>
          <div className="cta-row close-ctas">
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
        </div>
      </section>

      <footer className="site-footer">
        <div className="rail footer-rail">
          <p className="footer-brand">Wolverine · Scar Feed</p>
          <nav className="footer-links" aria-label="Footer">
            <Link href="/app">Get Started</Link>
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
          </nav>
        </div>
      </footer>
    </div>
  );
}
