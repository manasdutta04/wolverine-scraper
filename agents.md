# AGENTS.md

## Project: Wolverine
A self-healing price & stock tracker for niche electronics/hobby stores,
built on Bright Data Scraper Studio. Built for the Scrape-Verse Hackathon
(Aug 17-23, 2026), targeting the Web-Slinger grand prize: Best Use of
Bright Data.

Tagline: "It doesn't matter how badly the page gets cut up — it heals."

Grand prize judging looks at: the scraper built in Scraper Studio, how
it's driven from a coding agent, how it handles site changes (self-heal),
and what gets built with the structured output. Design every decision
around proving those four things clearly and visibly (ideally via git/CI
history, not just a staged demo).

## Stack
- Node.js for all pipeline/heal scripts (consistent with Bright Data CLI
  being an npx package)
- Bright Data CLI (`@brightdata/cli`) for scraper create/run/heal/approve
- SQLite for storing timestamped scrape snapshots
- GitHub Actions (cron) for scheduled runs + autonomous self-heal loop
- Next.js (or plain HTML/JS) for the dashboard: current prices/stock +
  history chart per product, per store

## Target stores (niche electronics/hobby — long tail, not in Bright
Data's 800+ prebuilt library)
- Adafruit — adafruit.com — product listing/detail pages
- SparkFun — sparkfun.com — product listing/detail pages
- Pimoroni — shop.pimoroni.com — product listing/detail pages
- The Pi Hut — thepihut.com — product listing/detail pages

Fields to extract per product: name, price, stock status (in stock /
out of stock / backorder), product URL.

## Collector IDs (pin as soon as created — do not regenerate)
- adafruit: c_msyvm0ar1gznj2dlrq
- sparkfun: c_msywbl7b18fsthmxn
- pimoroni: c_msywj65f19rulm4cua
- thepihut: c_msyx5sb61lfwvvvspd

## Rules for the agent
1. Confirm target URLs (specific category/product-listing pages) with
   the human before creating scrapers — don't guess a URL that returns
   nothing useful.
2. Always use `bdata scraper create <url> "<field description>"` — never
   hand-write CSS selectors or scraping logic from scratch.
3. Immediately record each collector's `c_*` ID in this file. Reuse it;
   never recreate a scraper for a store that already has one.
4. Every `bdata scraper run` output must be parsed and written to the
   SQLite DB (table: snapshots — store, product_name, price, stock,
   url, scraped_at), not just printed.
5. Self-heal loop (this is the core hackathon deliverable):
   - After each run, check for null/empty price or stock fields.
   - If broken: run `bdata scraper heal <collector_id> "<description of
     what looks wrong>"`, then `bdata scraper approve <collector_id>`,
     then re-run the scraper to confirm the fix.
   - Log every heal event to `heal-log.md` with timestamp, collector,
     what broke, and the outcome. This log is part of our judging
     evidence — keep it detailed and honest, including failed heal
     attempts if any occur.
6. Never commit `.env`, tokens, or credentials. Use GitHub Actions
   secrets for CI. Mask tokens in any terminal output that gets
   screen-recorded for the demo.
7. Keep the CLI/terminal as the primary workflow; the Bright Data
   dashboard is only for a glance, not the main interface.
8. Commit in small working increments: one scraper created & verified
   -> one commit. Pipeline writing to DB -> one commit. CI cron working
   -> one commit. Heal loop working -> one commit. Etc. This gives us a
   git history that itself demonstrates the project's evolution for
   judges.
9. If a target site turns out to be login-walled, paywalled, or already
   covered by Bright Data's prebuilt scraper library, stop and flag it
   to the human instead of proceeding.

## Current status
- [x] Bright Data account created, CLI logged in (`bdata login`)
- [x] Store target URLs confirmed (specific category pages, not just
      homepages)
- [x] Scraper: adafruit created & test-run
- [x] Scraper: sparkfun created & test-run
- [x] Scraper: pimoroni created & test-run
- [x] Scraper: thepihut created & test-run
- [ ] pipeline script: run all -> parse -> write to SQLite
- [ ] GitHub Actions workflow: scheduled run (cron)
- [ ] GitHub Actions workflow: auto-heal step on failed/empty fields
- [x] heal-log.md populated with at least one real heal event
- [ ] Dashboard: current prices/stock table
- [ ] Dashboard: price history chart per product
- [ ] Demo video script drafted (problem -> workflow -> live heal proof
      via CI history -> product)
- [ ] LinkedIn post drafted for Daily Bugle track