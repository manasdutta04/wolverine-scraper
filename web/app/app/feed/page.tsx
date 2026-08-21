import { FeedClient } from "@/components/FeedClient";

export const metadata = { title: "Feed" };

export default function AppFeedPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Scar Feed</p>
        <h1 className="page-title">Signals</h1>
        <p className="page-lede">
          Plain-English scarcity, deals, restocks, and price cuts — suppressed
          when Heal Court refuses a store.
        </p>
      </section>
      <FeedClient />
    </>
  );
}
