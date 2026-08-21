"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { GITHUB_REPO } from "@/lib/nav";

const ease = [0.22, 1, 0.36, 1] as const;
const DOCKER_HUB =
  "https://hub.docker.com/r/manasdutta04/wolverine-dashboard";

function ScramblePrice({
  target,
  prefix = "$",
}: {
  target: string;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(target.replace(/[0-9]/g, "0"));

  useEffect(() => {
    let iterations = 0;
    const maxIterations = 18;
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        setDisplay(target);
        clearInterval(interval);
        return;
      }
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (!/[0-9]/.test(char)) return char;
            if (
              iterations > maxIterations - 5 &&
              i < iterations - (maxIterations - 5)
            )
              return char;
            return String(Math.floor(Math.random() * 10));
          })
          .join(""),
      );
      iterations++;
    }, 50);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <span
      className="font-mono font-bold"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {prefix}
      {display}
    </span>
  );
}

function StatusLine() {
  const [throughput, setThroughput] = useState("0.0");

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput((Math.random() * 40 + 20).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground uppercase font-mono">
      <span className="h-1.5 w-1.5 bg-[#ea580c]" />
      <span>live signals: {throughput} trusted/batch</span>
    </div>
  );
}

function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />;
}

interface Tier {
  id: string;
  name: string;
  price: string;
  period: string;
  tag: string | null;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  href: string;
  external?: boolean;
  highlighted: boolean;
}

const TIERS: Tier[] = [
  {
    id: "public",
    name: "PUBLIC_DEMO",
    price: "0",
    period: "/ forever",
    tag: null,
    description: "Live Scar Feed on Vercel. No Bright Data key on the site.",
    features: [
      { text: "Scar Feed signals", included: true },
      { text: "Heal Court pulse", included: true },
      { text: "Catalog + heals", included: true },
      { text: "Studio collector IDs", included: true },
      { text: "Self-host pipeline", included: false },
      { text: "CI secrets access", included: false },
    ],
    cta: "GET STARTED",
    href: "/app",
    highlighted: false,
  },
  {
    id: "docker",
    name: "DOCKER_RUN",
    price: "0",
    period: "/ pull",
    tag: "RECOMMENDED",
    description: "Ship the dashboard locally. Same structured export, zero setup drama.",
    features: [
      { text: "Full /app workspace", included: true },
      { text: "Bundled scar.json", included: true },
      { text: "Offline-friendly UI", included: true },
      { text: "Docker Hub image", included: true },
      { text: "Heal Court views", included: true },
      { text: "Live bdata CLI auth", included: false },
    ],
    cta: "PULL IMAGE",
    href: DOCKER_HUB,
    external: true,
    highlighted: true,
  },
  {
    id: "self-host",
    name: "SELF_HOST",
    price: "OPEN",
    period: "",
    tag: null,
    description: "Clone the repo. Pin collectors. Run scrape + heal + export.",
    features: [
      { text: "Pinned c_* collectors", included: true },
      { text: "SQLite pipeline", included: true },
      { text: "GitHub Actions cron", included: true },
      { text: "heal-log.md evidence", included: true },
      { text: "bdata create/run/heal", included: true },
      { text: "Full agent control", included: true },
    ],
    cta: "STAR ON GITHUB",
    href: GITHUB_REPO,
    external: true,
    highlighted: false,
  },
];

function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  const isOpen = tier.price === "OPEN";

  const ctaInner = (
    <>
      <span className="flex items-center justify-center w-9 h-9 bg-[#ea580c]">
        <ArrowRight size={14} strokeWidth={2} className="text-background" />
      </span>
      <span className="flex-1 py-2.5 text-center">{tier.cta}</span>
    </>
  );

  const ctaClass = `group w-full flex items-center justify-center gap-0 text-xs font-mono tracking-wider uppercase ${
    tier.highlighted
      ? "bg-background text-foreground"
      : "bg-foreground text-background"
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.12, duration: 0.6, ease }}
      className={`flex flex-col h-full ${
        tier.highlighted
          ? "border-2 border-foreground bg-foreground text-background"
          : "border-2 border-foreground bg-background text-foreground"
      }`}
    >
      <div
        className={`flex items-center justify-between px-5 py-3 border-b-2 ${
          tier.highlighted ? "border-background/20" : "border-foreground"
        }`}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono">
          {tier.name}
        </span>
        <div className="flex items-center gap-2">
          {tier.tag && (
            <span className="bg-[#ea580c] text-background text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 font-mono">
              {tier.tag}
            </span>
          )}
          <span className="text-[10px] tracking-[0.2em] font-mono opacity-50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="px-5 pt-6 pb-4">
        <div className="flex items-baseline gap-1">
          {isOpen ? (
            <span className="text-3xl lg:text-4xl font-mono font-bold tracking-tight">
              OPEN
            </span>
          ) : (
            <span className="text-3xl lg:text-4xl">
              <ScramblePrice target={tier.price} />
            </span>
          )}
          {tier.period && (
            <span
              className={`text-xs font-mono tracking-widest uppercase ${
                tier.highlighted ? "text-background/50" : "text-muted-foreground"
              }`}
            >
              {tier.period}
            </span>
          )}
        </div>
        <p
          className={`text-xs font-mono mt-3 leading-relaxed ${
            tier.highlighted ? "text-background/60" : "text-muted-foreground"
          }`}
        >
          {tier.description}
        </p>
      </div>

      <div
        className={`flex-1 px-5 py-4 border-t-2 ${
          tier.highlighted ? "border-background/20" : "border-foreground"
        }`}
      >
        <div className="flex flex-col gap-3">
          {tier.features.map((feature, fi) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.12 + 0.3 + fi * 0.04,
                duration: 0.35,
                ease,
              }}
              className="flex items-start gap-3"
            >
              {feature.included ? (
                <Check
                  size={12}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0 text-[#ea580c]"
                />
              ) : (
                <Minus
                  size={12}
                  strokeWidth={2}
                  className={`mt-0.5 shrink-0 ${
                    tier.highlighted
                      ? "text-background/30"
                      : "text-muted-foreground/40"
                  }`}
                />
              )}
              <span
                className={`text-xs font-mono leading-relaxed ${
                  feature.included
                    ? ""
                    : tier.highlighted
                      ? "text-background/30 line-through"
                      : "text-muted-foreground/40 line-through"
                }`}
              >
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5 pt-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          {tier.external ? (
            <a
              href={tier.href}
              target="_blank"
              rel="noreferrer"
              className={ctaClass}
            >
              {ctaInner}
            </a>
          ) : (
            <Link href={tier.href} className={ctaClass}>
              {ctaInner}
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  return (
    <section id="studio" className="w-full px-6 py-20 lg:px-12 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {"// SECTION: ACCESS_TIERS"}
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
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-foreground text-balance">
            Select your access path
          </h2>
          <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed max-w-md">
            Public demo, Docker dashboard, or full self-host with Bright Data
            Scraper Studio collectors pinned forever.
          </p>
        </div>
        <StatusLine />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {TIERS.map((tier, i) => (
          <PricingCard key={tier.id} tier={tier} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5, ease }}
        className="flex items-center gap-3 mt-6"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {
            "* Public site ships scar.json only. Keep BRIGHTDATA_API_KEY out of git."
          }
        </span>
        <div className="flex-1 border-t border-border" />
      </motion.div>
    </section>
  );
}
