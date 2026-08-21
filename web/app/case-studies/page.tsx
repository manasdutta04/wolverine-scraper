import { SiteHeader } from "@/components/SiteHeader";
import { CasesView } from "@/components/CasesView";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "Case Studies" };

export default function CaseStudiesPage() {
  const data = loadScar();
  return (
    <div className="app-shell">
      <SiteHeader active="cases" />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Heal journal</p>
          <h1 className="page-title">Case Studies</h1>
          <p className="page-lede">
            Real heal events from Bright Data Scraper Studio, plus labeled
            simulated CI runs that prove detection without breaking a live
            collector.
          </p>
        </section>
        <CasesView data={data} />
      </main>
    </div>
  );
}
