import { CasesView } from "@/components/CasesView";

export const metadata = { title: "Heals" };

export default function AppHealsPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Evidence</p>
        <h1 className="page-title">Heal journal</h1>
        <p className="page-lede">
          Live heal events from Scraper Studio, plus labeled simulated CI runs
          that prove detection without breaking a collector.
        </p>
      </section>
      <CasesView />
    </>
  );
}
