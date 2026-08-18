import { scrapeAdafruit } from "./adafruit.js";
import { scrapeSparkfun } from "./sparkfun.js";
import { scrapePimoroni } from "./pimoroni.js";
import { scrapeThePiHut } from "./thepihut.js";

export const storeScrapers = [
  { id: "adafruit", run: scrapeAdafruit },
  { id: "sparkfun", run: scrapeSparkfun },
  { id: "pimoroni", run: scrapePimoroni },
  { id: "thepihut", run: scrapeThePiHut },
];
