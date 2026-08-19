/**
 * Store registry. Collector IDs are pinned after `bdata scraper create`
 * and must match AGENTS.md. Never recreate a store that already has a c_*.
 *
 * `url` is the confirmed listing page for `bdata scraper run`.
 */
export const stores = [
  {
    id: "adafruit",
    name: "Adafruit",
    domain: "adafruit.com",
    collectorId: "c_msyvm0ar1gznj2dlrq",
    currency: "USD",
    url: "https://www.adafruit.com/category/105",
    proposedUrl: "https://www.adafruit.com/category/105",
    proposedLabel: "Raspberry Pi category listing (prices + stock on cards)",
  },
  {
    id: "sparkfun",
    name: "SparkFun",
    domain: "sparkfun.com",
    collectorId: "c_msywbl7b18fsthmxn",
    currency: "USD",
    url: "https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html",
    proposedUrl:
      "https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html",
    proposedLabel: "Raspberry Pi listing (in stock / out of stock / backorder)",
  },
  {
    id: "pimoroni",
    name: "Pimoroni",
    domain: "shop.pimoroni.com",
    collectorId: "c_msywj65f19rulm4cua",
    currency: "GBP",
    url: "https://shop.pimoroni.com/collections/raspberry-pi",
    proposedUrl: "https://shop.pimoroni.com/collections/raspberry-pi",
    proposedLabel: "Raspberry Pi 5 & accessories collection (JS-heavy listing)",
  },
  {
    id: "thepihut",
    name: "The Pi Hut",
    domain: "thepihut.com",
    collectorId: "c_msyx5sb61lfwvvvspd",
    currency: "GBP",
    url: "https://thepihut.com/collections/raspberry-pi",
    proposedUrl: "https://thepihut.com/collections/raspberry-pi",
    proposedLabel: "Official Raspberry Pi products (126 items, prices + cart/notify)",
  },
];

export function getStore(id) {
  const store = stores.find((s) => s.id === id);
  if (!store) {
    throw new Error(`Unknown store: ${id}`);
  }
  return store;
}

export function isStoreReady(store) {
  return Boolean(
    store.collectorId &&
      !store.collectorId.includes("TBD") &&
      store.url,
  );
}
