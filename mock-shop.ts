import http from 'node:http';

// a tiny shop to crawl locally so this runs with no real target: a listing page
// that links to product pages, each with a name, price and sku in the markup.
const PRODUCTS: Record<string, { name: string; price: string; sku: string }> = {
  '1': { name: 'Blue Mug', price: '9.90', sku: 'MUG-BL' },
  '2': { name: 'Green Notebook', price: '4.50', sku: 'NB-GR' },
  '3': { name: 'Desk Lamp', price: '24.00', sku: 'LAMP-01' },
};

function page(path: string): string | null {
  if (path === '/' || path === '/products') {
    const links = Object.keys(PRODUCTS)
      .map((id) => `<a href="/product/${id}">product ${id}</a>`)
      .join(' ');
    return `<html><body><h1>Shop</h1>${links}</body></html>`;
  }
  const id = path.split('/product/')[1];
  const p = id && PRODUCTS[id];
  if (!p) return null;
  return `<html><body>
    <h1>${p.name}</h1>
    <span class="price">${p.price}</span>
    <div data-sku="${p.sku}"></div>
  </body></html>`;
}

export function serve(port = 8123): http.Server {
  const server = http.createServer((req, res) => {
    const body = page(new URL(req.url ?? '/', 'http://x').pathname);
    if (body === null) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html' }).end(body);
  });
  server.listen(port);
  return server;
}
