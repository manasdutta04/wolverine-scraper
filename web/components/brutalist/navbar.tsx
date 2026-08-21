"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/brutalist/theme-toggle";
import { GITHUB_REPO } from "@/lib/nav";

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Product", href: "#product" },
  { label: "Studio", href: "#studio" },
  { label: "Proof", href: "#proof" },
] as const;

export function Navbar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full px-4 pt-4 lg:px-6 lg:pt-6"
    >
      <nav className="w-full border border-foreground/20 bg-background/80 backdrop-blur-sm px-6 py-3 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <Cpu size={16} strokeWidth={1.5} />
              <span className="text-xs font-mono tracking-[0.15em] uppercase font-bold">
                SCAR.FEED
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + i * 0.06,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:block text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              GitHub
            </a>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/app"
                className="bg-foreground text-background px-4 py-2 text-xs font-mono tracking-widest uppercase inline-block"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </nav>
    </motion.div>
  );
}
