/**
 * Store registry. Collector IDs stay c_TBD until `bdata scraper create`
 * succeeds — then pin them here AND in AGENTS.md.
 *
 * `url` is null until the human confirms a specific listing page.
 * `proposedUrl` is a candidate, not an authorized target.
 */
export const stores = [
  {
    id: "adafruit",
    name: "Adafruit",
    domain: "adafruit.com",
    collectorId: "c_TBD",
    url: null,
    proposedUrl: "https://www.adafruit.com/category/105",
    proposedLabel: "Raspberry Pi category listing (prices + stock on cards)",
  },
  {
    id: "sparkfun",
    name: "SparkFun",
    domain: "sparkfun.com",
    collectorId: "c_TBD",
    url: null,
    proposedUrl:
      "https://www.sparkfun.com/development-boards/single-board-computers/raspberry-pi.html",
    proposedLabel: "Raspberry Pi listing (in stock / out of stock / backorder)",
  },
  {
    id: "pimoroni",
    name: "Pimoroni",
    domain: "shop.pimoroni.com",
    collectorId: "c_TBD",
    url: null,
    proposedUrl: "https://shop.pimoroni.com/collections/raspberry-pi",
    proposedLabel: "Raspberry Pi 5 & accessories collection (JS-heavy listing)",
  },
  {
    id: "thepihut",
    name: "The Pi Hut",
    domain: "thepihut.com",
    collectorId: "c_TBD",
    url: null,
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
