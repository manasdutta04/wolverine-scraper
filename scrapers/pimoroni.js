import { fileURLToPath } from "node:url";
import path from "node:path";
import { getStore } from "./config.js";
import { runStoreScraper } from "./run-bdata.js";

export async function scrapePimoroni() {
  return runStoreScraper(getStore("pimoroni"));
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  scrapePimoroni()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
