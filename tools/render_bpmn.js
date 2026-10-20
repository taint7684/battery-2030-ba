// Ve anh PNG/SVG tu file .bpmn bang bpmn-js (Playwright).
// Chay: node tools/render_bpmn.js <file.bpmn> [rong] [cao]   (NODE_PATH tro toi node_modules co playwright)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const src = path.resolve(process.argv[2]);
  const W = +(process.argv[3] || 2600), H = +(process.argv[4] || 900);
  const xml = fs.readFileSync(src, 'utf8');
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await pg.setContent(`<!doctype html><html><head><meta charset="utf-8">
    <link rel="stylesheet" href="https://unpkg.com/bpmn-js@17.11.1/dist/assets/bpmn-js.css">
    <style>body{margin:0;background:#fff}#c{width:${W}px;height:${H}px}</style></head>
    <body><div id="c"></div><script src="https://unpkg.com/bpmn-js@17.11.1/dist/bpmn-viewer.development.js"></script></body></html>`);
  await pg.waitForFunction(() => window.BpmnJS);
  const svg = await pg.evaluate(async (x) => {
    const v = new BpmnJS({ container: '#c' });
    const r = await v.importXML(x);
    v.get('canvas').zoom('fit-viewport');
    const { svg } = await v.saveSVG();
    return JSON.stringify({ svg, warnings: r.warnings.length });
  }, xml);
  const o = JSON.parse(svg);
  fs.writeFileSync(src.replace(/\.bpmn$/, '.svg'), o.svg);
  await pg.waitForTimeout(500);
  await pg.locator('#c').screenshot({ path: src.replace(/\.bpmn$/, '.png') });
  console.log('warnings:', o.warnings);
  await b.close();
})();
