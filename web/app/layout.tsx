import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wolverine — price & stock that heals",
  description:
    "Self-healing tracker for niche electronics stores. It doesn't matter how badly the page gets cut up — it heals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
