"""S10 - Sinh trang Sankey dong vat chat nam 2030 (3 kich ban) tu outputs/sankey_2030.json.
Chay: .venv/Scripts/python 03-forecast/model/sankey.py -> 03-forecast/outputs/mfa-sankey.html
Anh: node tools/screenshot.js 03-forecast/outputs/mfa-sankey.html 03-forecast/outputs/fig-sankey-2030.png 1100 560 #chart"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parents[1] / "outputs"
data = json.loads((OUT / "sankey_2030.json").read_text(encoding="utf-8"))

HTML = """<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dòng pin hết hạn 2030</title>
<script src="https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js"></script>
<style>
:root{--surface:#ffffff;--ink:#0f1e2b;--ink2:#46566a;--line:#e3e9f0;color-scheme:light}
body{margin:0;background:var(--surface);color:var(--ink);font:14px "Be Vietnam Pro",system-ui,Segoe UI,Arial,sans-serif;padding:16px}
h1{font-size:18px;margin:0 0 4px} p{color:var(--ink2);margin:0 0 12px;max-width:80ch}
.bar{display:flex;gap:8px;margin:8px 0}
button{font:inherit;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:#fff;cursor:pointer}
button[aria-pressed=true]{background:#059669;color:#fff;border-color:#059669}
#chart{width:100%;max-width:1060px;height:500px}
table{border-collapse:collapse;font-size:13px;margin-top:12px} td,th{border-bottom:1px solid var(--line);padding:4px 10px;text-align:left} td.n{text-align:right}
</style></head><body>
<h1>Pin hết hạn năm 2030 đi đâu? (nghìn tấn, giá trị likely)</h1>
<p>Nguồn: mô hình S9 (03-forecast/model/forecast.py). Tỷ lệ thu hồi chính thức theo ASM-11, tỷ lệ đời thứ hai theo ASM-10. Phần phi chính thức là ước lượng theo khoảng, không quan sát được trực tiếp.</p>
<div class="bar" role="group" aria-label="Kịch bản">__BTN__</div>
<div id="chart"></div>
<table id="tbl"><thead><tr><th>Dòng</th><th>Từ</th><th>Đến</th><th>nghìn tấn</th></tr></thead><tbody></tbody></table>
<script>
const DATA = __DATA__;
const COLOR = {"Hết hạn: e2W-Li":"#2563eb","Hết hạn: e2W-Chì":"#ea580c","Hết hạn: Ô tô-Li":"#0d9488",
  "Thu hồi chính thức":"#059669","Phi chính thức / thất thoát":"#94a3b8","Đời thứ hai":"#16a34a","Tái chế có phép":"#0e7490"};
const POS = {"Hết hạn: e2W-Chì":[0.001,0.2],"Hết hạn: e2W-Li":[0.001,0.62],"Hết hạn: Ô tô-Li":[0.001,0.88],
  "Thu hồi chính thức":[0.42,0.72],"Phi chính thức / thất thoát":[0.999,0.25],"Tái chế có phép":[0.999,0.74],"Đời thứ hai":[0.999,0.95]};
const LABEL = s => s.replace("e2W-Li","Xe máy pin Li").replace("e2W-Chì","Xe máy ắc quy chì").replace("Ô tô-Li","Ô tô pin Li");
function draw(sc){
  const d = DATA[sc];
  document.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed', b.dataset.sc===sc));
  const lab = d.nodes.map(LABEL);
  Plotly.react('chart',[{type:'sankey',arrangement:'fixed',
    node:{label:lab,x:d.nodes.map(n=>POS[n][0]),y:d.nodes.map(n=>POS[n][1]),color:d.nodes.map(n=>COLOR[n]||'#52514e'),pad:18,thickness:16,line:{width:0}},
    link:{source:d.links.map(l=>l.source),target:d.links.map(l=>l.target),value:d.links.map(l=>l.value/1000),
      color:d.links.map(l=>{const t=d.nodes[l.target],h=COLOR[t==='Phi chính thức / thất thoát'?t:d.nodes[l.source]]||'#94a3b8';return 'rgba('+[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',')+',0.35)'}),
      hovertemplate:'%{source.label} → %{target.label}<br>%{value:.1f} nghìn tấn<extra></extra>'}}],
    {margin:{l:8,r:8,t:8,b:8},font:{size:13,color:'#0f1e2b'},paper_bgcolor:'#ffffff'},{displayModeBar:false,responsive:true});
  document.querySelector('#tbl tbody').innerHTML = d.links.map((l,i)=>`<tr><td>${i+1}</td><td>${lab[l.source]}</td><td>${lab[l.target]}</td><td class="n">${(l.value/1000).toFixed(1).replace('.',',')}</td></tr>`).join('');
}
document.querySelectorAll('button').forEach(b=>b.onclick=()=>draw(b.dataset.sc));
draw('Cơ sở');
</script></body></html>"""

btn = "".join(f'<button type="button" data-sc="{s}" aria-pressed="false">{s}</button>' for s in data)
(OUT / "mfa-sankey.html").write_text(HTML.replace("__BTN__", btn).replace("__DATA__", json.dumps(data, ensure_ascii=False)), encoding="utf-8")
print("ok")
