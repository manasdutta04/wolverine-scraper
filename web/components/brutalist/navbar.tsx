"use client";

import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/brutalist/theme-toggle";
import { GITHUB_REPO } from "@/lib/nav";

const NAV_LINKS = [
  { label: "Product", href: "#product", id: "product" },
  { label: "Problem", href: "#problem", id: "problem" },
  { label: "Studio", href: "#studio", id: "studio" },
  { label: "Proof", href: "#proof", id: "proof" },
] as const;

export function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let current = "";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 120) current = link.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full px-4 pt-4 lg:px-6 lg:pt-6 sticky top-0 z-40"
    >
      <nav className="w-full border-2 border-foreground bg-background px-3 py-2 lg:px-4">
        <div className="flex items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="min-w-0"
          >
            <Link href="/" className="flex items-center gap-0 group">
              <span className="flex h-9 w-9 items-center justify-center bg-[#ea580c] text-background shrink-0">
                <Cpu size={15} strokeWidth={2} />
              </span>
              <span className="flex h-9 items-center border-y-2 border-r-2 border-foreground px-3 bg-background">
                <span className="text-[11px] font-mono tracking-[0.18em] uppercase font-bold text-foreground">
                  SCAR.FEED
                </span>
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-0 border-2 border-foreground">
            {NAV_LINKS.map((link, i) => {
              const isActive = active === link.id;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + i * 0.05,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative px-4 py-2 text-[10px] font-mono tracking-[0.16em] uppercase transition-colors duration-150 border-r-2 border-foreground last:border-r-0 ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <span className="text-[#ea580c] mr-1.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </motion.a>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="hidden lg:inline-flex items-center gap-2 border border-foreground px-2 py-1.5">
              <span className="h-1.5 w-1.5 bg-[#ea580c] animate-blink" />
              <span className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-foreground">
                Live
              </span>
            </span>
            <ThemeToggle />
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex h-9 items-center border-2 border-foreground px-3 text-[10px] font-mono tracking-[0.16em] uppercase text-foreground hover:bg-foreground hover:text-background transition-colors duration-150"
            >
              GitHub
            </a>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/app"
                className="inline-flex items-center gap-0 bg-foreground text-background text-[10px] font-mono tracking-[0.16em] uppercase"
              >
                <span className="flex h-9 w-9 items-center justify-center bg-[#ea580c]">
                  <ArrowRight size={14} strokeWidth={2} className="text-background" />
                </span>
                <span className="px-3 py-2">Get Started</span>
              </Link>
            </motion.div>
            <button
              type="button"
              className="md:hidden h-9 w-9 border-2 border-foreground flex flex-col items-center justify-center gap-1"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="block w-3.5 h-0.5 bg-foreground" />
              <span className="block w-3.5 h-0.5 bg-foreground" />
              <span className="block w-3.5 h-0.5 bg-foreground" />
            </button>
          </motion.div>
        </div>

        {open ? (
          <div className="md:hidden mt-2 border-t-2 border-foreground pt-2 grid gap-0">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 text-[11px] font-mono tracking-[0.16em] uppercase border-b border-border last:border-b-0 ${
                  active === link.id
                    ? "bg-foreground text-background"
                    : "text-foreground"
                }`}
              >
                <span className="text-[#ea580c]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </nav>
    </motion.div>
  );
}
