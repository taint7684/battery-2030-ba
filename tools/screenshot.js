// Chup anh mot trang HTML (file cuc bo hoac URL) bang Playwright.
// Chay: node tools/screenshot.js <file.html|url> <out.png> [rong] [cao] [selector]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [src, out, w = '1200', h = '800', sel] = process.argv.slice(2);
  const url = /^https?:/.test(src) ? src : 'file:///' + path.resolve(src).replace(/\\/g, '/');
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
  await pg.goto(url, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(600);
  if (sel) await pg.locator(sel).screenshot({ path: out });
  else await pg.screenshot({ path: out, fullPage: false });
  await b.close();
  console.log('saved', out);
})();
