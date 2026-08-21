import { SiteHeader } from "@/components/SiteHeader";
import { ProductSubnav } from "@/components/ProductSubnav";
import { CatalogClient } from "@/components/CatalogClient";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "Catalog" };

export default function CatalogPage() {
  const data = loadScar();
  return (
    <div className="app-shell">
      <SiteHeader active="product" />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Product / Catalog</p>
          <h1 className="page-title">Catalog</h1>
          <p className="page-lede">
            Live rows from the latest scrape batch. Select a product for price
            context.
          </p>
          <ProductSubnav />
        </section>
        <CatalogClient data={data} />
      </main>
    </div>
  );
}
