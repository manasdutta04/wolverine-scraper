import { loadDashboardData } from "@/lib/db";
import { Dashboard } from "@/components/Dashboard";

export default function HomePage() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
