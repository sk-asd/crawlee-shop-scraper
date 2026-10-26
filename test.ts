import assert from 'node:assert/strict';
import { serve } from './mock-shop.ts';
import { run } from './main.ts';

const server = serve(8124);
try {
  const items = await run('http://localhost:8124/products');
  assert.equal(items.length, 3, 'all three products scraped');
  assert.ok(items.every((p: any) => p.name && p.price && p.sku), 'each has name/price/sku');
  const lamp = items.find((p: any) => p.sku === 'LAMP-01');
  assert.equal(lamp?.price, '24.00');
  console.log('ok');
} finally {
  server.close();
}
