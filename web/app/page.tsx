import { loadDashboardData } from "@/lib/db";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
