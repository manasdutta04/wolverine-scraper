import Link from "next/link";
import {
  ACTIONS,
  COLLECTORS,
  DOCKER_HUB,
  DOCKER_PULL,
  DOCKER_RUN,
  GITHUB_REPO,
  HEAL_LOG,
  LIVE_DEMO,
  SAMPLE_OUTPUT,
} from "@/lib/nav";

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "web", label: "Web / Vercel" },
  { id: "docker", label: "Docker" },
  { id: "local", label: "Local pipeline" },
  { id: "studio", label: "Scraper Studio" },
  { id: "heal", label: "Heal Court" },
  { id: "surfaces", label: "Repo map" },
] as const;

function DocCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overview-card docs-card">
      <h3>{title}</h3>
      <div className="docs-body">{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return <pre className="docs-code">{children}</pre>;
}

export function DocsPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{"// DOCS"}</p>
        <h1 className="page-title">Scar Feed docs</h1>
        <p className="page-lede">
          Web, Docker, local pipeline, Bright Data Scraper Studio, and Heal Court
          — same workspace chrome as the rest of the app.
        </p>
      </section>

      <nav className="docs-toc" aria-label="Docs sections">
        {TOC.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="docs-stack">
        <section id="overview" className="docs-section">
          <DocCard title="Overview">
            <p>
              Restock radar that will not cry wolf. Studio collectors scrape
              Adafruit, SparkFun, Pimoroni, and The Pi Hut. Heal Court decides{" "}
              <strong>release / repair / refuse</strong> before Scar Feed speaks.
            </p>
            <p className="meta-line">
              Live:{" "}
              <a href={LIVE_DEMO} target="_blank" rel="noreferrer">
                {LIVE_DEMO}
              </a>
            </p>
            <p className="meta-line">
              <Link href="/app">Open overview →</Link>
              {" · "}
              <a href={GITHUB_REPO} target="_blank" rel="noreferrer">
                GitHub →
              </a>
            </p>
          </DocCard>
        </section>

        <section id="web" className="docs-section">
          <DocCard title="Web / Vercel">
            <p>
              Next.js app in <code>web/</code>. Vercel Root Directory ={" "}
              <code>web</code>. Builds need no Bright Data key —{" "}
              <code>web/public/data/scar.json</code> is committed.
            </p>
            <ul className="collector-list" style={{ marginTop: 12 }}>
              {[
                ["/", "Marketing landing"],
                ["/app", "Product workspace"],
                ["/app/feed", "Scar Feed"],
                ["/app/court", "Heal Court"],
                ["/app/studio", "Collectors"],
                ["/docs", "This documentation"],
              ].map(([path, role]) => (
                <li key={path}>
                  <strong>
                    <code>{path}</code>
                  </strong>
                  <span>{role}</span>
                </li>
              ))}
            </ul>
            <CodeBlock>{`npx vercel login
npx vercel link --cwd web
npx vercel --prod --cwd web`}</CodeBlock>
            <p className="meta-line">
              After pipeline changes: <code>npm run scar:export</code>
            </p>
          </DocCard>
        </section>

        <section id="docker" className="docs-section">
          <DocCard title="Docker">
            <p>
              Image on{" "}
              <a href={DOCKER_HUB} target="_blank" rel="noreferrer">
                Docker Hub
              </a>
              . Same dashboard as the live demo.
            </p>
            <CodeBlock>{`${DOCKER_PULL}\n${DOCKER_RUN}`}</CodeBlock>
            <p className="meta-line">
              Then open <code>http://localhost:3000</code>
            </p>
          </DocCard>
        </section>

        <section id="local" className="docs-section">
          <DocCard title="Local pipeline">
            <p>
              Node 20+, Bright Data CLI login. Secrets stay in local/CI — never
              on the public site.
            </p>
            <CodeBlock>{`git clone ${GITHUB_REPO}.git
cd wolverine-scraper
npm install
cd web && npm install && cd ..

npm run scar:export
npm run web:dev`}</CodeBlock>
            <p className="meta-line">
              Also: <code>npm run scrape</code> · <code>npm run check</code> ·{" "}
              <code>npm run heal</code> · <code>npm test</code>
            </p>
          </DocCard>
        </section>

        <section id="studio" className="docs-section">
          <DocCard title="Scraper Studio">
            <p>Custom collectors — pin IDs, never recreate.</p>
            <ul className="collector-list" style={{ marginTop: 12 }}>
              {COLLECTORS.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong>
                  <code>{c.collectorId}</code>
                </li>
              ))}
            </ul>
            <CodeBlock>{`bdata scraper create <url> "<fields>"
bdata scraper run <collector_id>
bdata scraper heal <collector_id> "<what broke>"
bdata scraper approve <collector_id>`}</CodeBlock>
          </DocCard>
        </section>

        <section id="heal" className="docs-section">
          <DocCard title="Heal Court">
            <p>Empty/null price or stock → court verdict:</p>
            <ul className="studio-steps" style={{ marginTop: 12 }}>
              <li>
                <strong>release</strong> — batch clear, signals live
              </li>
              <li>
                <strong>repair</strong> — heal → approve → re-run
              </li>
              <li>
                <strong>refuse</strong> — still broken → suppress signals
              </li>
            </ul>
            <p className="meta-line" style={{ marginTop: 12 }}>
              <a href={HEAL_LOG} target="_blank" rel="noreferrer">
                heal-log.md
              </a>
              {" · "}
              <a href={SAMPLE_OUTPUT} target="_blank" rel="noreferrer">
                sample-output.json
              </a>
              {" · "}
              <a href={ACTIONS} target="_blank" rel="noreferrer">
                GitHub Actions
              </a>
            </p>
          </DocCard>
        </section>

        <section id="surfaces" className="docs-section">
          <DocCard title="Repo map">
            <ul className="collector-list" style={{ marginTop: 0 }}>
              {[
                ["scar/", "Match, diff, Heal Court, export, tests"],
                ["scrapers/", "Store registry + bdata runner"],
                ["pipeline/", "Scrape all → SQLite"],
                ["heal/", "Red-flag check + heal loop"],
                ["web/", "Next.js landing + /app"],
                ["docs/", "Architecture + deploy notes"],
                [".github/workflows/", "Cron scrape/heal"],
              ].map(([path, role]) => (
                <li key={path}>
                  <strong>
                    <code>{path}</code>
                  </strong>
                  <span>{role}</span>
                </li>
              ))}
            </ul>
            <p className="meta-line" style={{ marginTop: 12 }}>
              Keep <code>BRIGHTDATA_API_KEY</code> out of git. See{" "}
              <code>SECURITY.md</code>.
            </p>
          </DocCard>
        </section>
      </div>
    </>
  );
}
