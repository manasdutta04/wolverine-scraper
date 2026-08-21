export const GITHUB_REPO = "https://github.com/manasdutta04/wolverine-scraper";
export const LIVE_DEMO = "https://wolverine-scraper.vercel.app";
export const DOCKER_HUB =
  "https://hub.docker.com/r/manasdutta04/wolverine-dashboard";
export const DOCKER_IMAGE = "manasdutta04/wolverine-dashboard:latest";
export const DOCKER_PULL = `docker pull ${DOCKER_IMAGE}`;
export const DOCKER_RUN =
  "docker run --rm -p 3000:3000 manasdutta04/wolverine-dashboard:latest";
export const HEAL_LOG =
  "https://github.com/manasdutta04/wolverine-scraper/blob/main/heal-log.md";
export const SAMPLE_OUTPUT =
  "https://github.com/manasdutta04/wolverine-scraper/blob/main/examples/sample-output.json";
export const ACTIONS =
  "https://github.com/manasdutta04/wolverine-scraper/actions";
export const SHOWCASE_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";

export const MARKETING_ANCHORS = [
  { href: "#product", label: "Product" },
  { href: "#problem", label: "Problem" },
  { href: "#studio", label: "Studio" },
  { href: "#proof", label: "Proof" },
] as const;

export const APP_NAV_GROUPS = [
  {
    label: "Radar",
    items: [
      { href: "/app", label: "Overview", id: "overview", icon: "◈" },
      { href: "/app/feed", label: "Feed", id: "feed", icon: "◎" },
      { href: "/app/catalog", label: "Catalog", id: "catalog", icon: "☰" },
    ],
  },
  {
    label: "Studio",
    items: [
      { href: "/app/court", label: "Heal Court", id: "court", icon: "⚖" },
      { href: "/app/heals", label: "Heals", id: "heals", icon: "✦" },
      { href: "/app/studio", label: "Collectors", id: "studio", icon: "⬡" },
    ],
  },
  {
    label: "Guide",
    items: [{ href: "/docs", label: "Docs", id: "docs", icon: "▤" }],
  },
] as const;

export type AppNavItem = {
  href: string;
  label: string;
  id: string;
  icon: string;
};

export const APP_NAV: AppNavItem[] = APP_NAV_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ ...item })),
);

/** Pinned Bright Data Scraper Studio collectors — never recreate. */
export const COLLECTORS = [
  {
    id: "adafruit",
    name: "Adafruit",
    collectorId: "c_msyvm0ar1gznj2dlrq",
    url: "https://www.adafruit.com/category/105",
  },
  {
    id: "sparkfun",
    name: "SparkFun",
    collectorId: "c_msywbl7b18fsthmxn",
    url: "https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html",
  },
  {
    id: "pimoroni",
    name: "Pimoroni",
    collectorId: "c_msywj65f19rulm4cua",
    url: "https://shop.pimoroni.com/collections/raspberry-pi",
  },
  {
    id: "thepihut",
    name: "The Pi Hut",
    collectorId: "c_msyx5sb61lfwvvvspd",
    url: "https://thepihut.com/collections/raspberry-pi",
  },
] as const;
