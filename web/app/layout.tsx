import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wolverine · Scar Feed",
  description:
    "Restock radar for niche electronics that will not cry wolf when the scraper is lying.",
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
