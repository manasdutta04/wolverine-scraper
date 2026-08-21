import { CourtView } from "@/components/CourtView";

export const metadata = { title: "Heal Court" };

export default function AppCourtPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Bright Data heal loop</p>
        <h1 className="page-title">Heal Court</h1>
        <p className="page-lede">
          Release trusted data. Repair runs <code>bdata scraper heal</code> then{" "}
          <code>approve</code> and re-run. Refuse rejects a still-cloned preview
          and suppresses that store&apos;s signals.
        </p>
      </section>
      <CourtView />
    </>
  );
}
