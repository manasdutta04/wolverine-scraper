import { SiteHeader } from "@/components/SiteHeader";
import { ProductSubnav } from "@/components/ProductSubnav";
import { FeedClient } from "@/components/FeedClient";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "Feed" };

export default function FeedPage() {
  const data = loadScar();
  return (
    <div className="app-shell">
      <SiteHeader active="product" />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Product / Feed</p>
          <h1 className="page-title">Scar Feed</h1>
          <p className="page-lede">
            Plain-English signals from scrape batches and cross-store matches.
          </p>
          <ProductSubnav />
        </section>
        <FeedClient data={data} />
      </main>
    </div>
  );
}
