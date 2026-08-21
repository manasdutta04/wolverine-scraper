import Link from "next/link";
import { MarketingHeader } from "@/components/MarketingHeader";
import { GITHUB_REPO } from "@/lib/nav";
import "../landing.css";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="landing-root" style={{ background: "#000", minHeight: "100vh" }}>
      <div className="page hero-page" style={{ minHeight: "auto", paddingBottom: 24 }}>
        <MarketingHeader />
      </div>
      <main className="mkt-section" style={{ borderTop: "none", paddingTop: 12 }}>
        <p className="mkt-kicker">Public demo</p>
        <h1 className="mkt-title">Contact</h1>
        <p className="mkt-body">
          No account required. Get Started opens the Scar Feed app. Star the repo
          if this is useful for Scrape-Verse.
        </p>
        <ul className="contact-list">
          <li>
            <Link href="/app">Enter Scar Feed app</Link>
            <p>Overview, Feed, Heal Court, Catalog, Heals, Studio.</p>
          </li>
          <li>
            <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
              GitHub repository
            </a>
            <p>Source, heal log, and CI history.</p>
          </li>
          <li>
            <a
              href="https://hub.docker.com/r/manasdutta04/wolverine-dashboard"
              target="_blank"
              rel="noreferrer"
            >
              Docker Hub
            </a>
            <p>
              <code>docker pull manasdutta04/wolverine-dashboard:latest</code>
            </p>
          </li>
        </ul>
      </main>
    </div>
  );
}
