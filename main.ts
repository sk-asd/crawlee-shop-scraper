import { CheerioCrawler, Dataset, Configuration } from 'crawlee';
import { serve } from './mock-shop.ts';

// crawl the listing, follow the product links, pull name/price/sku off each
// product page. Crawlee handles the request queue, concurrency and retries;
// the requestHandler is just "what to do with each page".

export async function run(startUrl: string) {
  // keep Crawlee quiet and off the disk between runs
  Configuration.getGlobalConfig().set('persistStorage', false);
  Configuration.getGlobalConfig().set('logLevel', 'WARNING');

  const dataset = await Dataset.open();
  await dataset.drop().catch(() => {});

  const crawler = new CheerioCrawler({
    maxConcurrency: 5,
    maxRequestsPerCrawl: 50,
    async requestHandler({ request, $, enqueueLinks }) {
      if (request.url.includes('/product/')) {
        await Dataset.pushData({
          url: request.url,
          name: $('h1').text().trim(),
          price: $('.price').text().trim(),
          sku: $('[data-sku]').attr('data-sku') ?? null,
        });
      } else {
        await enqueueLinks({ globs: ['**/product/*'] });
      }
    },
  });

  await crawler.run([startUrl]);
  const { items } = await Dataset.getData();
  return items;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('main.ts')) {
  const server = serve(8123);
  try {
    const items = await run('http://localhost:8123/products');
    console.log(`scraped ${items.length} products:`);
    for (const p of items) console.log(' ', p.sku, p.name, p.price);
  } finally {
    server.close();
  }
}
