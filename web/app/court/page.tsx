import { SiteHeader } from "@/components/SiteHeader";
import { ProductSubnav } from "@/components/ProductSubnav";
import { CourtView } from "@/components/CourtView";
import { loadScar } from "@/lib/scar";

export const metadata = { title: "Heal Court" };

export default function CourtPage() {
  const data = loadScar();
  return (
    <div className="app-shell">
      <SiteHeader active="product" />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Product / Court</p>
          <h1 className="page-title">Heal Court</h1>
          <p className="page-lede">
            Release, repair, or refuse. Repair runs Bright Data heal + approve.
            Refuse rejects a still-cloned preview and suppresses that store’s
            signals.
          </p>
          <ProductSubnav />
        </section>
        <CourtView data={data} />
      </main>
    </div>
  );
}
