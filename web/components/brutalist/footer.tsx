"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DOCKER_HUB, GITHUB_REPO, LIVE_DEMO } from "@/lib/nav";

const ease = [0.22, 1, 0.36, 1] as const;

const LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "/contact" },
  { label: "Live", href: LIVE_DEMO, external: true },
  { label: "Docker", href: DOCKER_HUB, external: true },
  { label: "GitHub", href: GITHUB_REPO, external: true },
] as const;

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
      className="w-full border-t-2 border-foreground px-6 py-8 lg:px-12"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold text-foreground">
            SCAR.FEED
          </span>
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
            WILL NOT CRY WOLF · BRIGHT DATA SCRAPER STUDIO
          </span>
          <a
            href={LIVE_DEMO}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-mono tracking-widest text-[#ea580c] mt-1 hover:underline break-all"
          >
            {LIVE_DEMO.replace("https://", "")}
          </a>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          {LINKS.map((link, i) => (
            <motion.span
              key={link.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
            >
              {"external" in link && link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
