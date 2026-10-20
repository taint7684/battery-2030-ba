// Chup anh cac man hinh prototype cho tai lieu (S19). Chay: node tools/shots.js  -> 04-solution/screens/*.png
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const URL = 'file:///' + path.join(ROOT, 'docs', 'prototype', 'index.html').split(path.sep).join('/');
const OUT = path.join(ROOT, '04-solution', 'screens');
const SHOTS = [
  ['01-tong-quan', 'u-lan', 'dashboard'],
  ['02-so-dang-ky', 'u-lan', 'registry'],
  ['03-model-erp', 'u-lan', 'models'],
  ['04-tiep-nhan', 'u-hung', 'intake', async p => { await p.fill('[data-testid=i-uid]', await p.evaluate(() => App.state.batteries.find(b => b.model === 'LF60' && b.status === 'Đang lưu hành').uid)); await p.fill('[data-testid=i-kg]', '16.2'); await p.check('[data-testid="chk-Phồng"]'); await p.click('[data-testid=i-save]'); }],
  ['05-diem-thu-hoi', 'u-tuan', 'points'],
  ['06-danh-gia-soh', 'u-quan', 'soh'],
  ['07-dieu-phoi', 'u-quan', 'routing', async p => { const u = await p.evaluate(() => App.state.fixtures['FX-SOH-OK']); await p.evaluate(u => { location.hash = '#/soh'; App.render(); }, u); await p.locator(`tr[data-uid="${u}"] [data-testid=soh-confirm]`).click(); await p.evaluate(() => { location.hash = '#/routing'; App.render(); }); }],
  ['08-lo-chung-tu', 'u-tuan', 'batches', async p => { await p.selectOption('[data-testid=b-partner]', 'R03'); await p.locator('[data-testid=b-item]').first().check(); await p.click('[data-testid=b-create]'); }],
  ['09-doi-tac', 'u-lan', 'partners'],
  ['10-bao-cao-epr', 'u-lan', 'epr'],
  ['11-tham-so', 'u-lan', 'params'],
  ['12-cong-cong-khai', 'u-lan', 'public', async p => { await p.selectOption('[data-testid=pub-prov]', 'Hà Nội'); }],
  ['13-ho-so-pin', 'u-lan', 'registry', async p => { const u = await p.evaluate(() => App.state.batteries.find(b => b.status === 'Đã tái chế').uid); await p.evaluate(u => { location.hash = '#/battery/' + u; App.render(); }, u); }],
];
(async () => {
  const b = await chromium.launch();
  for (const [name, user, route, act] of SHOTS) {
    const ctx = await b.newContext({ viewport: { width: 1360, height: 860 }, deviceScaleFactor: 1.5 });
    const p = await ctx.newPage();
    await p.goto(URL);
    await p.evaluate(([u, r]) => { App.reset(); App.state.user = u; App.save(); location.hash = '#/' + r; App.render(); }, [user, route]);
    if (act) await act(p);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(OUT, name + '.png'), fullPage: false });
    await ctx.close();
    console.log('ok', name);
  }
  // Ban mobile 360px cua man tiep nhan
  const ctx = await b.newContext({ viewport: { width: 360, height: 760 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage(); await p.goto(URL);
  await p.evaluate(() => { App.reset(); App.state.user = 'u-hung'; App.save(); location.hash = '#/intake'; App.render(); });
  await p.screenshot({ path: path.join(OUT, '14-tiep-nhan-mobile.png') });
  await b.close();
})();
