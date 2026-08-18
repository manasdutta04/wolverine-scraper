import { fileURLToPath } from "node:url";
import path from "node:path";
import { getStore } from "./config.js";
import { runStoreScraper } from "./run-bdata.js";

export async function scrapeAdafruit() {
  return runStoreScraper(getStore("adafruit"));
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  scrapeAdafruit()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
