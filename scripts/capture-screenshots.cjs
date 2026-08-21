const { chromium } = require("playwright");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "docs", "screenshots");
const base = "http://127.0.0.1:3456";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(out, "scar-feed-desktop.png"),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(out, "landing-hero-showcase.png"),
    fullPage: false,
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/app`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(out, "scar-feed-app.png"),
    fullPage: false,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(out, "scar-feed-mobile.png"),
    fullPage: false,
  });

  await browser.close();
  console.log("screenshots ok ->", out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
