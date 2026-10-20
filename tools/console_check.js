// In loi console/JS cua mot trang HTML cuc bo. Chay: node tools/console_check.js <file.html>
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('requestfailed', r => errs.push('requestfailed: ' + r.url()));
  await p.goto('file:///' + path.resolve(process.argv[2]).split(path.sep).join('/'), { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  console.log(errs.length ? errs.join('\n') : 'khong co loi');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
