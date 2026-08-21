"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DOCKER_HUB, DOCKER_PULL, DOCKER_RUN } from "@/lib/nav";

const ease = [0.22, 1, 0.36, 1] as const;

function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-[#ea580c] animate-blink" />;
}

export function DeploySection() {
  return (
    <section id="deploy" className="w-full px-6 pb-20 lg:px-12 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
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

      <div className="border-2 border-foreground max-w-3xl">
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
        <div className="px-5 py-6 flex flex-col gap-4">
          <h3 className="text-lg font-mono font-bold uppercase tracking-tight">
            Run locally with Docker
          </h3>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            Pull the dashboard image and open localhost:3000 — same Scar Feed
            workspace as this site.
          </p>
          <div className="border-2 border-foreground bg-foreground text-background p-4 overflow-x-auto">
            <pre className="text-[11px] sm:text-xs font-mono leading-relaxed m-0 whitespace-pre">
              {`${DOCKER_PULL}\n${DOCKER_RUN}`}
            </pre>
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
