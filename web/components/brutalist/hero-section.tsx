"use client";

import Link from "next/link";
import { WorkflowDiagram } from "@/components/brutalist/workflow-diagram";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  return (
    <section className="relative flex w-full flex-1 flex-col justify-center px-5 py-3 sm:px-10 lg:px-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mb-2 inline-flex items-center gap-2 border-2 border-foreground bg-background px-2.5 py-1 sm:mb-3"
        >
          <span className="h-1.5 w-1.5 bg-[#ea580c] animate-blink" />
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-bold text-foreground sm:text-[10px]">
           Wolverine
          </span>
          
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease }}
          className="font-pixel text-[clamp(1.85rem,5.5vh,4.5rem)] leading-[0.9] tracking-tight text-foreground select-none"
        >
          HEAL. <span className="text-[#ea580c]">FEED.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="my-2 w-full max-w-lg sm:my-3 lg:max-w-xl [&_svg]:max-h-[min(22vh,168px)] [&_svg]:w-full"
        >
          <WorkflowDiagram />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, delay: 0.18, ease }}
          className="font-pixel mb-2 text-[clamp(1.7rem,5vh,4rem)] leading-[0.9] tracking-tight text-foreground select-none sm:mb-3"
        >
          TRUST.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32, ease }}
          className="mb-3 max-w-md text-[11px] leading-snug font-mono text-muted-foreground sm:mb-4 sm:text-xs sm:leading-relaxed"
        >
          Restock radar that will not cry wolf. Studio scrapes niche electronics;
          Heal Court decides release, repair, or refuse.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42, ease }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/app"
              className="group flex items-center gap-0 bg-foreground text-background text-xs font-mono tracking-wider uppercase sm:text-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center bg-[#ea580c] sm:h-10 sm:w-10">
                <ArrowRight size={15} strokeWidth={2} className="text-background" />
              </span>
              <span className="px-4 py-2 sm:px-5 sm:py-2.5">Open app</span>
            </Link>
          </motion.div>
          <Link
            href="#deploy"
            className="inline-flex h-9 items-center border-2 border-foreground px-4 text-[10px] font-mono tracking-[0.16em] uppercase text-foreground transition-colors hover:bg-foreground hover:text-background sm:h-10 sm:px-5 sm:text-[11px]"
          >
            Docker
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
