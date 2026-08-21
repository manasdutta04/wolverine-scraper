import { CatalogClient } from "@/components/CatalogClient";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "Catalog" };

export default function AppCatalogPage() {
  const data = loadScar();
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Structured output</p>
        <h1 className="page-title">Catalog</h1>
        <p className="page-lede">
          Latest scrape rows from all four Studio collectors — what gets built
          on top of Bright Data&apos;s JSON.
        </p>
      </section>
      <CatalogClient data={data} />
    </>
  );
}
