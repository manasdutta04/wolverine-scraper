# Heal log

Every entry is a real Scraper Studio heal. Failed attempts stay in this file.

## 2026-08-19T00:56:00Z — SparkFun attempt 1 (partial)

- collector: `c_msywbl7b18fsthmxn` (sparkfun)
- what broke: every product returned the same price (`$739.95`) and the same stock status (`Backorder`) instead of per-card values
- heal prompt: `every product is returning the same price ($739.95) and same stock status (Backorder) instead of each product's actual price and stock — the extraction appears to be locked onto one element instead of iterating per product card`
- CLI: heal → awaiting_approval → approve → re-run (CLI requires approve before a live run can use the new template)
- before sample:
  ```json
  {
    "product_name": "SparkFun Pro Micro - RP2350",
    "price": { "value": 739.95, "currency": "USD", "symbol": "$" },
    "stock_status": "Backorder",
    "product_url": "https://www.sparkfun.com/sparkfun-pro-micro-rp2350.html"
  }
  ```
  (120/120 rows shared that price and stock)
- heal preview (looked fixed, but only 1 row):
  ```json
  {
    "product_name": "Raspberry Pi 5 - 1GB",
    "price": { "value": 50, "currency": "USD" },
    "stock_status": "In stock",
    "product_url": "https://www.sparkfun.com/raspberry-pi-5-1gb.html"
  }
  ```
- after re-run sample:
  ```json
  {
    "product_name": "Raspberry Pi 5 - 4GB",
    "price": { "value": 739.95, "currency": "USD", "symbol": "$" },
    "stock_status": "Backorder",
    "product_url": "https://www.sparkfun.com/raspberry-pi-5-4gb.html"
  }
  ```
- outcome: **not fixed on the listing page.** Preview extracted one product at `$50` / In stock; the full listing run was still 120/120 at `$739.95` / Backorder. Follow-up heal targets per-card iteration on the category listing.

## 2026-08-19T01:09:44Z — SparkFun attempt 2 (verified)

- collector: `c_msywbl7b18fsthmxn` (sparkfun)
- what broke: listing run still cloned one price/stock onto every card after attempt 1
- heal prompt: `The listing-page run still returns $739.95 and Backorder for all 120 products. Stay on the category listing; for EACH product card in the grid read THAT card's own price and stock (in stock / out of stock / backorder). Do not scrape a single product detail page and do not reuse one price/stock node for every row.`
- CLI: heal → awaiting_approval → approve --auto-save → re-run
- before sample (attempt 1 after-run):
  ```json
  {
    "product_name": "Raspberry Pi 5 - 4GB",
    "price": { "value": 739.95, "currency": "USD", "symbol": "$" },
    "stock_status": "Backorder",
    "product_url": "https://www.sparkfun.com/raspberry-pi-5-4gb.html"
  }
  ```
- after sample:
  ```json
  {
    "product_name": "Raspberry Pi 5 - 1GB",
    "price": { "value": 50, "currency": "USD", "symbol": "$" },
    "stock_status": "In stock",
    "product_url": "https://www.sparkfun.com/raspberry-pi-5-1gb.html"
  }
  ```
- confirmation: 120 products, 84 distinct prices, stock mix `{In stock: 58, Out of stock: 41, Discontinued: 13, Backorder: 8}`. Neighbor rows now differ (`$50` / In stock vs `$114.95` / Discontinued vs `$99.95` / Discontinued vs `$149.95` / Out of stock).

## 2026-08-19T01:14:00Z — Pimoroni attempt 1 (currency fixed; names still broken)

- collector: `c_msywj65f19rulm4cua` (pimoroni)
- what broke: currency returned as repeated `£` characters (`££££`); some product names grabbed variant option text instead of the base product name
- heal prompt: `currency symbol is returning as repeated £ characters (££££) instead of a single £ plus the numeric price, and some product names are grabbing variant option text instead of the base product name`
- CLI: heal → awaiting_approval → approve --auto-save → re-run
- before sample:
  ```json
  {
    "product_name": "United Kingdom Europe United States Australia",
    "price": 7.5,
    "currency": "££££",
    "stock_status": "in stock",
    "product_url": "https://shop.pimoroni.com/products/raspberry-pi-12-5w-micro-usb-power-supply"
  }
  ```
- after sample:
  ```json
  {
    "product_name": "United Kingdom",
    "price": 7.5,
    "currency": "£",
    "stock_status": "in stock",
    "product_url": "https://shop.pimoroni.com/products/raspberry-pi-12-5w-micro-usb-power-supply"
  }
  ```
- confirmation: **currency fixed** — 320/320 rows have a single `£`, 0 repeated-pound rows. **Names not fixed** — still variant labels (`United Kingdom`, `4.0"`, `No Disk`, `Red/White`). Follow-up heal targets the title on the card.

## 2026-08-19T01:30:28Z — Pimoroni attempt 2 (verified)

- collector: `c_msywj65f19rulm4cua` (pimoroni)
- what broke: names still used variant labels after attempt 1; currency was already a single `£`
- heal prompt: `Keep currency as a single pound symbol. Product names are still grabbing variant option text such as United Kingdom, 4.0 inch, No Disk, Red/White, Standard, 8GB RAM instead of the base product title on the listing card (for example Raspberry Pi 12.5W Micro USB Power Supply). Extract the product title, not the selected variant label.`
- CLI: heal → awaiting_approval → approve --auto-save → re-run
- before sample:
  ```json
  {
    "product_name": "United Kingdom",
    "price": 7.5,
    "currency": "£",
    "stock_status": "in stock",
    "product_url": "https://shop.pimoroni.com/products/raspberry-pi-12-5w-micro-usb-power-supply"
  }
  ```
- after sample:
  ```json
  {
    "product_name": "Raspberry Pi Camera Module 3 (Autofocus, HDR)",
    "price": 27.5,
    "currency": "£",
    "stock_status": "ships today",
    "product_url": "https://shop.pimoroni.com/products/raspberry-pi-camera-module-3"
  }
  ```
- confirmation: 320 products, currency still single `£` on all rows. Names now look like product titles (`Raspberry Pi 5 Official Case with Fan`, `HyperPixel 4.0 Square…`) instead of plug-region / size variants.

## 2026-08-19T01:42:00Z — The Pi Hut (verified)

- collector: `c_msyx5sb61lfwvvvspd` (thepihut)
- what broke: currency symbol returned as repeated `£` characters (`££££££££`) instead of a single `£` plus numeric price
- heal prompt: `currency symbol is returning as repeated pound characters instead of a single pound plus the numeric price`
- CLI: heal → awaiting_approval → approve --auto-save → re-run
- before sample:
  ```json
  {
    "product_name": "Raspberry Pi MicroSD Adapter",
    "price": 0.2,
    "currency": "££££££££",
    "stock_status": "In stock",
    "product_url": "https://thepihut.com/products/official-raspberry-pi-microsd-adapter"
  }
  ```
- after sample:
  ```json
  {
    "product_name": "Raspberry Pi Pico",
    "price": 3.8,
    "currency": "£",
    "stock_status": "In stock",
    "product_url": "https://thepihut.com/products/raspberry-pi-pico"
  }
  ```
- confirmation: 48/48 rows have a single `£`, 0 repeated-pound rows, 29 distinct prices.

## 2026-08-19T01:46:00Z — Adafruit (verified)

- collector: `c_msyvm0ar1gznj2dlrq` (adafruit)
- what broke: 53 of 836 products missing price; stock status was noisy variant/description text instead of a clean enum
- heal prompt: `53 of 836 products are missing price entirely, and stock status is returning noisy variant description text instead of a clean in stock / out of stock / backorder / unknown value`
- CLI: heal → awaiting_approval → approve --auto-save → re-run
- before sample:
  ```json
  {
    "product_name": "Raspberry Pi Pico W",
    "price": 6,
    "stock_status": "There are multiple versions of this item. Please select one from the options below: Pico without Headers Out of stock Pico with Loose Unsoldered Headers Out of stock Pico with Pre-Soldered Headers Out of stock Pico Wireless without Headers $6.00 Pico Wireless with Pre-Soldered Headers $7.00 1 in stock Add to Cart Add to Wishlist",
    "product_url": "https://www.adafruit.com/product/5526%205526"
  }
  ```
  (also 53/836 rows had empty `price`)
- after sample:
  ```json
  {
    "product_name": "Official Raspberry Pi 45W USB-C Power Supply",
    "price": 16.5,
    "stock_status": "in stock",
    "product_url": "https://www.adafruit.com/product/6320"
  }
  ```
- confirmation: 662 products (listing coverage dropped vs 836). **0/662 missing price.** Stock is a clean enum on every row: `{in stock: 276, out of stock: 74, unknown: 312}`. No leftover variant-blob stock strings.


## 2026-08-19T16:03:58.790Z — SIMULATED TEST RUN (not a real site failure)
- collector: `c_msywbl7b18fsthmxn` (sparkfun)
- what broke: SIMULATED fixture (cloned $739.95 / backorder). Detection: sparkfun: 100.0% of rows share price=739.95 stock=backorder (20/20) — extraction looks locked onto one element
- **label: SIMULATED TEST RUN** — fixture data only; not a live site failure
- heal prompt: `SparkFun listing scrape looks broken: sparkfun: 100.0% of rows share price=739.95 stock=backorder (20/20) — extraction looks locked onto one element. Re-extract each product card's own name, numeric price, currency, stock status, and URL. Do not reuse one price/stock node for every row.`
- outcome: simulated fixture, heal call attempted, studio confirmed no live extraction issue (preview still had distinct per-card prices); rejected the proposal so the live collector is unchanged
