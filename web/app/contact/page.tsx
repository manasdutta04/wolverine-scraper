"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Navbar } from "@/components/brutalist/navbar";
import { Footer } from "@/components/brutalist/footer";
import { GITHUB_REPO } from "@/lib/nav";

export default function ContactPage() {
  useEffect(() => {
    document.body.classList.add("is-landing");
    return () => document.body.classList.remove("is-landing");
  }, []);

  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main className="w-full px-6 py-16 lg:px-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            {"// SECTION: CONTACT"}
          </span>
          <div className="flex-1 border-t border-border" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
            009
          </span>
        </div>

        <div className="border-2 border-foreground max-w-3xl">
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              CONTACT.md
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#ea580c] font-mono">
              PUBLIC
            </span>
          </div>
          <div className="px-5 py-8 flex flex-col gap-6">
            <h1 className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase">
              Public demo — no account
            </h1>
            <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed max-w-xl">
              Get Started opens the Scar Feed app. Star the repo if this is useful
              for Scrape-Verse. No Bright Data key on the site.
            </p>
            <ul className="flex flex-col gap-0 border-2 border-foreground">
              <li className="border-b-2 border-foreground px-4 py-4">
                <Link
                  href="/app"
                  className="text-sm font-mono font-bold uppercase tracking-wide hover:text-[#ea580c] transition-colors"
                >
                  Enter Scar Feed app
                </Link>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Overview, Feed, Heal Court, Catalog, Heals, Studio.
                </p>
              </li>
              <li className="border-b-2 border-foreground px-4 py-4">
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-mono font-bold uppercase tracking-wide hover:text-[#ea580c] transition-colors"
                >
                  GitHub repository
                </a>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  Source, heal log, and CI history.
                </p>
              </li>
              <li className="px-4 py-4">
                <a
                  href="https://hub.docker.com/r/manasdutta04/wolverine-dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-mono font-bold uppercase tracking-wide hover:text-[#ea580c] transition-colors"
                >
                  Docker Hub
                </a>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  docker pull manasdutta04/wolverine-dashboard:latest
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
