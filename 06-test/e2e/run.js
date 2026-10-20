// Chay toan bo test case tren prototype, ghi 06-test/test-results.json va 06-test/test-cases.csv.
// Chay: node 06-test/e2e/run.js [TC-xxx ...]   (NODE_PATH tro toi node_modules co playwright)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const TESTS = require('./tests.js');
const ROOT = path.resolve(__dirname, '..', '..');
const URL = 'file:///' + path.join(ROOT, 'docs', 'prototype', 'index.html').split(path.sep).join('/');

(async () => {
  const only = process.argv.slice(2);
  const browser = await chromium.launch();
  const results = [];
  for (const t of TESTS.filter(x => !only.length || only.includes(x.id))) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    const t0 = Date.now();
    let status = 'Đạt', note = '';
    try {
      await page.goto(URL);
      await t.run(page);
      if (errs.length) throw new Error('Lỗi JavaScript: ' + errs.join(' | '));
    } catch (e) { status = 'Không đạt'; note = String(e.message || e).split('\n')[0].slice(0, 300); }
    results.push({ id: t.id, title: t.title, refs: t.refs, tech: t.tech, steps: t.steps, expected: t.expected, result: status, note, ms: Date.now() - t0 });
    console.log(`${status === 'Đạt' ? 'PASS' : 'FAIL'} ${t.id} ${t.title}${note ? ' :: ' + note : ''}`);
    await ctx.close();
  }
  await browser.close();
  if (!only.length) {
    const q = v => `"${String(v).replace(/"/g, '""')}"`;
    const head = ['id', 'title', 'refs', 'technique', 'steps', 'expected', 'result', 'note'];
    const csv = [head.join(',')].concat(results.map(r => [r.id, r.title, r.refs, r.tech, r.steps, r.expected, r.result, r.note].map(q).join(','))).join('\n') + '\n';
    fs.writeFileSync(path.join(ROOT, '06-test', 'test-cases.csv'), csv, 'utf8');
    fs.writeFileSync(path.join(ROOT, '06-test', 'test-results.json'), JSON.stringify({ run_at: new Date().toISOString(), total: results.length,
      passed: results.filter(r => r.result === 'Đạt').length, results }, null, 1), 'utf8');
  }
  const failed = results.filter(r => r.result !== 'Đạt').length;
  console.log(`\n${results.length - failed}/${results.length} đạt`);
  process.exit(failed ? 1 : 0);
})();
