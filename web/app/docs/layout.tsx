import "../app.css";
import "../landing.css";
import { AppShell } from "@/components/AppShell";
import { loadScar } from "@/lib/scar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = loadScar();
  return <AppShell data={data}>{children}</AppShell>;
}
