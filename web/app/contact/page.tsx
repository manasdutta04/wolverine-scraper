import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { GITHUB_REPO } from "@/lib/nav";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="app-shell">
      <SiteHeader active="contact" />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Public demo</p>
          <h1 className="page-title">Contact</h1>
          <p className="page-lede">
            Public read-only demo - no account. Star the repo if Scar Feed is
            useful, or open the product pages below.
          </p>
        </section>
        <ul className="contact-list">
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
              Docker Hub image
            </a>
            <p>
              <code>docker pull manasdutta04/wolverine-dashboard:latest</code>
            </p>
          </li>
          <li>
            <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
              Star on GitHub
            </a>
            <p>Help the project get noticed for Scrape-Verse.</p>
          </li>
          <li>
            <Link href="/product">Open Scar Feed product</Link>
            <p>Feed, Heal Court, and catalog - no Bright Data key on the public site.</p>
          </li>
        </ul>
      </main>
    </div>
  );
}
