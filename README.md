# crawlee-shop-scraper

A small crawler built with [Crawlee](https://crawlee.dev) (the scraping library
behind Apify): crawl a shop's listing page, follow the product links, and pull
`name`, `price` and `sku` off each product page. TypeScript, run directly on Node.

Crawlee gives you the request queue, concurrency and retries; the `requestHandler`
is just "what to do with each page" - enqueue product links on the listing,
extract fields on a product page.

## Run

```
npm install
npm start
```

It starts a local mock shop and crawls it:

```
scraped 3 products:
  MUG-BL   Blue Mug        9.90
  NB-GR    Green Notebook  4.50
  LAMP-01  Desk Lamp       24.00
```

Point it at a real listing instead by passing a URL to `run()` in `main.ts`.

## Files

- `main.ts` - the `CheerioCrawler`: `maxConcurrency`, `maxRequestsPerCrawl`, and a
  `requestHandler` that enqueues `**/product/*` links and extracts fields.
- `mock-shop.ts` - a local listing + product pages so it runs with no real target.
- `test.ts` - crawls the mock and checks all three products come back with fields.

## Test

```
npm test
```

Runs on Node 22+ (TypeScript executed directly, no build step).
