"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  ACTIONS,
  COLLECTORS,
  GITHUB_REPO,
  HEAL_LOG,
  SAMPLE_OUTPUT,
} from "@/lib/nav";

const ease = [0.22, 1, 0.36, 1] as const;

function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />;
}

const CLI_STEPS = [
  { cmd: "bdata scraper create", note: "Custom collectors for long-tail stores" },
  { cmd: "bdata scraper run", note: "Structured JSON → SQLite snapshots" },
  { cmd: "bdata scraper heal", note: "Self-heal when selectors break" },
  { cmd: "bdata scraper approve", note: "Confirm fix, re-run, prove it" },
];

const PROOF_LINKS = [
  { href: HEAL_LOG, label: "heal-log.md", desc: "Real heal events, honest outcomes" },
  {
    href: SAMPLE_OUTPUT,
    label: "sample-output.json",
    desc: "Structured product fields judges can inspect",
  },
  {
    href: ACTIONS,
    label: "GitHub Actions",
    desc: "Cron scrape + autonomous heal loop",
  },
];

export function StudioProofSection() {
  return (
    <>
      <section id="studio" className="w-full px-6 py-20 lg:px-12 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"// SECTION: SCRAPER_STUDIO"}
          </span>
          <div className="flex-1 border-t border-border" />
          <BlinkDot />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            006
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col gap-3 mb-10 max-w-2xl"
        >
          <h2 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-foreground text-balance">
            Best Use of Bright Data — pinned collectors, agent CLI, real heals
          </h2>
          <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed">
            Not a prebuilt dataset. Four Studio collectors for Adafruit, SparkFun,
            Pimoroni, and The Pi Hut — driven by coding agent +{" "}
            <code className="text-foreground">bdata</code>, written to SQLite,
            gated by Heal Court, exported into Scar Feed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-foreground">
          <div className="border-b-2 lg:border-b-0 lg:border-r-2 border-foreground">
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                collectors.pin
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#ea580c] font-mono">
                NEVER RECREATE
              </span>
            </div>
            <ul className="list-none m-0 p-0">
              {COLLECTORS.map((c, i) => (
                <li
                  key={c.id}
                  className={`flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 ${
                    i < COLLECTORS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <strong className="text-sm font-mono uppercase tracking-wide">
                    {c.name}
                  </strong>
                  <code className="text-[11px] font-mono text-muted-foreground">
                    {c.collectorId}
                  </code>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                agent.cli
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                LOOP
              </span>
            </div>
            <ul className="list-none m-0 p-0">
              {CLI_STEPS.map((step, i) => (
                <li
                  key={step.cmd}
                  className={`flex items-start gap-3 px-5 py-4 ${
                    i < CLI_STEPS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="mt-0.5 shrink-0 text-[#ea580c]"
                  />
                  <div>
                    <code className="text-xs font-mono text-foreground block">
                      {step.cmd}
                    </code>
                    <span className="text-[11px] font-mono text-muted-foreground mt-1 block">
                      {step.note}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="proof" className="w-full px-6 pb-20 lg:px-12 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"// SECTION: JUDGE_EVIDENCE"}
          </span>
          <div className="flex-1 border-t border-border" />
          <BlinkDot />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            007
          </span>
        </motion.div>

        <div className="border-2 border-foreground">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 px-5 py-6 border-b-2 border-foreground">
            <div className="max-w-xl">
              <h2 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-balance">
                Evidence over a staged feed dump
              </h2>
              <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed mt-3">
                Git history, heal journal, Actions cron, and sample structured
                output. The demo is the product — public UI ships{" "}
                <code className="text-foreground">scar.json</code>, never your
                Bright Data key.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/app"
                className="inline-flex items-center gap-0 bg-foreground text-background text-xs font-mono tracking-wider uppercase"
              >
                <span className="flex items-center justify-center w-9 h-9 bg-[#ea580c]">
                  <ArrowRight size={14} strokeWidth={2} className="text-background" />
                </span>
                <span className="px-5 py-2.5">Enter Scar Feed</span>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {PROOF_LINKS.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={`block px-5 py-5 hover:bg-foreground/5 transition-colors ${
                  i < PROOF_LINKS.length - 1
                    ? "border-b md:border-b-0 md:border-r border-border"
                    : ""
                }`}
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#ea580c] font-mono">
                  OPEN
                </span>
                <strong className="block mt-2 text-sm font-mono uppercase tracking-wide">
                  {item.label}
                </strong>
                <span className="block mt-2 text-xs font-mono text-muted-foreground leading-relaxed">
                  {item.desc}
                </span>
              </a>
            ))}
          </div>

          <div className="px-5 py-4 border-t-2 border-foreground flex flex-wrap gap-4 items-center justify-between">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              SOURCE · {GITHUB_REPO.replace("https://", "")}
            </span>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase font-mono text-foreground hover:text-[#ea580c] transition-colors"
            >
              Star on GitHub →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
