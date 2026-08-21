import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductSubnav } from "@/components/ProductSubnav";
import { formatWhen } from "@/lib/format";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "Product" };

export default function ProductPage() {
  const data = loadScar();
  return (
    <div className="app-shell">
      <SiteHeader active="product" />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Scar Feed</p>
          <h1 className="page-title">Restock radar that will not cry wolf</h1>
          <p className="page-lede">
            Four Bright Data Scraper Studio collectors watch niche electronics
            stores. Scar Feed turns batches into plain-English signals. Heal Court
            decides release, repair, or refuse before a broken scrape can invent a
            restock.
          </p>
          <ProductSubnav />
        </section>
        <div className="route-cards">
          <Link className="route-card" href="/feed">
            <strong>Scar Feed</strong>
            <span>
              Scarcity, cheapest in-stock, restocks, and price cuts - trusted only
              by default.
            </span>
          </Link>
          <Link className="route-card" href="/court">
            <strong>Heal Court</strong>
            <span>Per-store verdicts. False restocks never reach the feed.</span>
          </Link>
          <Link className="route-card" href="/catalog">
            <strong>Catalog</strong>
            <span>
              Search live rows across Adafruit, SparkFun, Pimoroni, and The Pi Hut.
            </span>
          </Link>
        </div>
        <p className="meta-line" style={{ marginTop: 24 }}>
          {data.feed?.length || 0} signals · {data.current?.length || 0} rows ·
          last scrape {formatWhen(data.lastScrapedAt)}
        </p>
      </main>
    </div>
  );
}
