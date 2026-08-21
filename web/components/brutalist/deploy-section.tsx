"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { DOCKER_HUB, DOCKER_PULL, DOCKER_RUN } from "@/lib/nav";

const ease = [0.22, 1, 0.36, 1] as const;

function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />;
}

function CopyCommand({ command, label }: { command: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [command]);

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      aria-label={`Copy ${label}`}
      title="Click to copy"
      className="group relative w-full border-2 border-background/30 bg-transparent px-8 py-4 text-center transition-colors hover:bg-background/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
    >
      <code className="block text-[11px] sm:text-xs font-mono leading-relaxed break-all text-center">
        {command}
      </code>
      <span className="pointer-events-none absolute right-3 top-3 text-background/70 group-hover:text-[#ea580c]">
        {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
      </span>
      <span className="mt-2 block text-[9px] font-mono tracking-[0.18em] uppercase text-background/50 group-hover:text-background/80">
        {copied ? "Copied" : "Click to copy"}
      </span>
    </button>
  );
}

export function DeploySection() {
  return (
    <section id="deploy" className="w-full px-6 pb-20 lg:px-12 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8 max-w-3xl mx-auto"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          {"// SECTION: RUN_IT"}
        </span>
        <div className="flex-1 border-t border-border" />
        <BlinkDot />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
          008
        </span>
      </motion.div>

      <div className="border-2 border-foreground max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            docker.hub
          </span>
          <a
            href={DOCKER_HUB}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase text-[#ea580c] font-mono hover:underline"
          >
            IMAGE
          </a>
        </div>
        <div className="px-5 py-8 flex flex-col items-center gap-5">
          <h3 className="text-lg font-mono font-bold uppercase tracking-tight">
            Run locally with Docker
          </h3>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed max-w-md">
            Pull the dashboard image and open localhost:3000 — same Scar Feed
            workspace as this site.
          </p>
          <div className="w-full border-2 border-foreground bg-foreground text-background p-3 sm:p-4 flex flex-col gap-2">
            <CopyCommand command={DOCKER_PULL} label="docker pull" />
            <CopyCommand command={DOCKER_RUN} label="docker run" />
          </div>
          <Link
            href="/docs#docker"
            className="text-[10px] font-mono tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground"
          >
            Full docs →
          </Link>
        </div>
      </div>
    </section>
  );
}
