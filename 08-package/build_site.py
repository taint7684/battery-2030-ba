"""Sinh trang GitHub Pages: docs/index.html (case study) va docs/forecast.html (dashboard du bao).
Chay: .venv/Scripts/python 08-package/build_site.py"""
import json
import shutil
import sys
from pathlib import Path

import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
IMG = DOCS / "img"
IMG.mkdir(parents=True, exist_ok=True)
for src in ["03-forecast/outputs/fig-li-fan.png", "03-forecast/outputs/fig-eol-segments.png", "03-forecast/outputs/fig-sankey-2030.png",
            "03-forecast/outputs/fig-tornado.png", "04-solution/S13-bpmn/to-be.png", "01-discovery/S7-as-is/as-is.png",
            "05-ai-soh/outputs/fig-pred-b0006.png", "07-business-case/outputs/fig-npv.png", "07-business-case/outputs/fig-tornado-li.png",
            "04-solution/screens/01-tong-quan.png", "04-solution/screens/04-tiep-nhan.png", "04-solution/screens/10-bao-cao-epr.png"]:
    shutil.copy(ROOT / src, IMG / Path(src).name)

ms = pd.read_csv(ROOT / "03-forecast/outputs/eol_mc_summary.csv")
lk = pd.read_csv(ROOT / "03-forecast/outputs/eol_likely.csv")
fan = {sc: {m: g[g.metric == m][["year", "p10", "p50", "p90"]].round(1).to_dict("list") for m in ("Li_eol_t", "Chì_eol_t", "Li_eol_gwh")}
       for sc, g in ms[ms.year.between(2025, 2035)].groupby("scenario")}
seg = {sc: {s: g[g.segment == s][["year", "eol_t", "placed_t"]].round(1).to_dict("list") for s in g.segment.unique()}
       for sc, g in lk[lk.year.between(2025, 2035)].groupby("scenario")}
cross = pd.read_csv(ROOT / "03-forecast/outputs/crossover.csv").to_dict("records")
sankey = json.loads((ROOT / "03-forecast/outputs/sankey_2030.json").read_text(encoding="utf-8"))
m = json.loads((ROOT / "05-ai-soh/outputs/metrics.json").read_text(encoding="utf-8"))
tests = json.loads((ROOT / "06-test/test-results.json").read_text(encoding="utf-8"))

CSS = """:root{--bg:#ffffff;--panel:#fff;--ink:#0f1e2b;--ink2:#46566a;--muted:#6b7a8c;--line:#e3e9f0;--accent:#059669;--accent-ink:#047857;--soft:#d8f5e8;--blue:#2563eb;--blue-soft:#e0eaff;--amber:#c2680a;--amber-soft:#fff1d6;--violet:#6d4ae0;--violet-soft:#ece7ff;--shadow:0 1px 2px rgba(15,30,43,.06),0 6px 18px rgba(15,30,43,.07);color-scheme:light}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 "Be Vietnam Pro",system-ui,"Segoe UI",Arial,sans-serif}
.wrap{max-width:1080px;margin:0 auto;padding:24px 16px 64px}
header.hero{padding:32px 32px 30px;border-radius:22px;color:var(--ink);background:linear-gradient(120deg,#ecfdf5 0%,#f0f9ff 60%,#eef2ff 100%);border:1px solid #d1fae5}
.eyebrow{display:inline-block;font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:var(--accent-ink);background:#fff;border:1px solid #a7f3d0;padding:4px 12px;border-radius:999px}
h1{font-size:clamp(28px,4.6vw,44px);line-height:1.12;margin:14px 0 10px;letter-spacing:-.02em;font-weight:800;text-wrap:balance}
header.hero p.lead{color:var(--ink2)}
h2{font-size:24px;margin:44px 0 12px;letter-spacing:-.01em;text-wrap:balance}h3{font-size:17px;margin:20px 0 6px}
p.lead{font-size:18px;color:var(--ink2);max-width:72ch;margin:0}
.links{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0 0}
.links a{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:12px;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;font-size:14.5px;box-shadow:0 4px 12px rgba(5,150,105,.25);transition:transform .12s}
.links a:hover{transform:translateY(-1px)}.links a.ghost{background:#fff;color:var(--accent-ink);border:1px solid #a7f3d0;box-shadow:none}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin:16px 0 10px}
.kpi{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px 18px;box-shadow:var(--shadow)}
.kpi b{display:block;font-size:28px;letter-spacing:-.02em;line-height:1.2}.kpi span{color:var(--ink2);font-size:14px}
.kpi:nth-child(1) b{color:var(--accent)}.kpi:nth-child(2) b{color:var(--blue)}.kpi:nth-child(3) b{color:var(--amber)}.kpi:nth-child(4) b{color:var(--violet)}
figure{margin:16px 0;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:12px;box-shadow:var(--shadow)}
figure img{width:100%;height:auto;display:block;border-radius:8px}figcaption{font-size:13px;color:var(--muted);margin-top:8px}
table{border-collapse:collapse;width:100%;font-size:14.5px;background:var(--panel)}th,td{border-bottom:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top}
th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);background:var(--bg)}tr:last-child td{border-bottom:0}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);background:var(--panel)}
ol.steps{padding-left:0;list-style:none;counter-reset:s;display:grid;gap:10px}ol.steps li{counter-increment:s;position:relative;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px 16px 14px 58px;box-shadow:var(--shadow)}
ol.steps li::before{content:counter(s);position:absolute;left:16px;top:14px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:14px;color:#fff;background:var(--accent)}
.note{font-size:13px;color:var(--muted)}a{color:var(--blue)}footer{margin-top:48px;font-size:13px;color:var(--muted)}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}.chart{background:var(--panel);border:1px solid var(--line);border-radius:16px;min-height:390px;box-shadow:var(--shadow);overflow:hidden}
.kpis.flat{margin:0 0 14px}
.bar{display:inline-flex;gap:4px;padding:4px;margin:22px 0 14px;background:var(--panel);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow)}
.bar button{font:inherit;font-size:14px;font-weight:600;padding:8px 18px;border:0;border-radius:9px;background:transparent;color:var(--ink2);cursor:pointer}
.bar button[aria-pressed=true]{background:var(--accent);color:#fff}.bar button:focus-visible{outline:2px solid var(--blue);outline-offset:2px}"""
REPO = "https://github.com/taint7684/battery-2030-ba/blob/main/"

index = f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Battery 2030 — Case study</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap"><style>{CSS}</style></head><body><div class="wrap">
<header class="hero"><div class="eyebrow">Case study · Business Analysis · Kinh tế tuần hoàn</div>
<h1>Battery 2030: pin xe điện hết hạn ở Việt Nam đi đâu, và doanh nghiệp nên chuẩn bị gì?</h1>
<p class="lead">Thiết kế nền tảng quản lý vòng đời và trách nhiệm thu hồi pin cho một hãng xe máy điện giả định (VELIX), từ văn bản luật đến dự báo, đặc tả, prototype kiểm thử tự động và business case.</p>
<div class="links"><a href="forecast.html">Dashboard dự báo →</a><a href="prototype/index.html">Prototype click được →</a><a class="ghost" href="{REPO}08-package/S22-executive-summary.md">Tóm tắt điều hành</a><a class="ghost" href="https://github.com/taint7684/battery-2030-ba">Mã nguồn và tài liệu</a></div></header>
<div class="kpis">
<div class="kpi"><b>≈15 nghìn tấn</b><span>pin Li hết hạn năm 2030 (P10–P90: 11–20)</span></div>
<div class="kpi"><b>≈71 nghìn tấn</b><span>năm 2035 — gấp gần 5 lần 2030</span></div>
<div class="kpi"><b>0% → 8%?</b><span>tỷ lệ tái chế bắt buộc pin Li hiện hành → dự thảo từ 2029</span></div>
<div class="kpi"><b>{tests['passed']}/{tests['total']}</b><span>test case tự động đạt trên prototype</span></div></div>

<h2>1. Bài toán</h2>
<p>Xe điện ở Việt Nam tăng mạnh từ 2025, nên khoảng 5–10 năm sau sẽ có một làn sóng pin hết hạn. Nhưng chưa ai biết bao nhiêu pin đã bán ra, pin nào sắp hết hạn và đi qua kênh nào. Nghị định 110/2026/NĐ-CP (hiệu lực 25/5/2026) đặt tỷ lệ tái chế bắt buộc <b>0%</b> cho pin Li của phương tiện giao thông và <b>12%</b> cho ắc quy chì; tỷ lệ được điều chỉnh lần đầu năm 2029.</p>

<h2>2. Phát hiện chính</h2>
<ol class="steps">
<li><b>Mốc 2029 của chính sách trùng với năm pin Li hết hạn vượt 10 nghìn tấn/năm</b> (P10–P90: 2029–2030, cả 3 kịch bản). Lập luận "chưa đủ pin thải để vận hành nhà máy" đúng đến khoảng 2028, sau đó hết đúng.</li>
<li><b>Ắc quy chì mới là bài toán hiện tại:</b> ≈33 nghìn tấn/năm đến 2030, lớn hơn pin Li cho tới 2033.</li>
<li><b>Khoảng 70% pin hết hạn năm 2030 đi kênh không có chứng từ</b> (ước lượng theo khoảng). Muốn tăng đời thứ hai, đòn bẩy là thu hồi chính thức: 45% pin Li đủ điều kiện kỹ thuật, nhưng chỉ ≈16% thực sự đến được đời thứ hai.</li>
<li><b>Việt Nam đo "khối lượng đã tái chế", EU đo "tỷ lệ thu gom":</b> 6 khoảng trống ⛔ (thu hồi, chỉ tiêu thu gom, đời thứ hai, dữ liệu SoH, passport, chi phí đầy đủ).</li>
<li><b>Business case:</b> tự tổ chức thu hồi thắng cho ắc quy chì ở 100% lượt mô phỏng; với pin Li, kết quả phụ thuộc giá pin đời thứ hai (theo dự thảo, dưới ≈0,53 triệu đ/kWh thì ủy quyền PRO rẻ hơn).</li></ol>
<figure><img src="img/fig-li-fan.png" alt="Dự báo pin Li hết hạn 2025–2035, ba kịch bản"><figcaption>Dự báo cohort × Weibull, 1.000 lượt Monte Carlo mỗi kịch bản.</figcaption></figure>

<h2>3. Phương pháp</h2>
<div class="tw"><table><tr><th>Bước</th><th>Kỹ thuật</th><th>Sản phẩm</th></tr>
<tr><td>Pháp lý</td><td>Bóc tách yêu cầu nguyên văn; ma trận khoảng trống VN × EU</td><td>31 REQ-VN, 28 REQ-EU, 18 GAP</td></tr>
<tr><td>Discovery</td><td>BACCM, PESTLE/SWOT, stakeholder/RACI, persona, phỏng vấn giả lập, BPMN As-Is, 5 Whys</td><td>S1–S7</td></tr>
<tr><td>Dự báo</td><td>Cohort × Weibull có thay pin và thải bỏ xe; Monte Carlo; phân tích dòng vật chất</td><td>S8–S10</td></tr>
<tr><td>Phản biện</td><td>Tuổi thọ ±2 năm, tornado, đối chiếu VinFast 20-F và World Bank, phần không quan sát được</td><td>S11</td></tr>
<tr><td>Thiết kế</td><td>BPMN To-Be, SRS 29148, 30 BR theo EARS, bảng quyết định, ERD, OpenAPI, story map</td><td>S12–S16</td></tr>
<tr><td>AI</td><td>Ước lượng SoH (NASA PCoE), khoảng tin cậy CQR, yêu cầu AI có người duyệt</td><td>S17–S18</td></tr>
<tr><td>Kiểm thử</td><td>73 test case Playwright (EP, BVA, bảng quyết định, chuyển trạng thái), RTM kiểm bằng máy</td><td>S19–S20</td></tr>
<tr><td>Business case</td><td>NPV 3 phương án × 3 chính sách, Monte Carlo, điểm hòa vốn, ma trận quyết định</td><td>S21</td></tr></table></div>

<h2>4. Quy trình mục tiêu</h2>
<figure><img src="img/to-be.png" alt="BPMN quy trình To-Be"><figcaption>Thu hồi → đánh giá SoH → điều phối → bàn giao → báo cáo EPR; mỗi bước gắn mã quy tắc nghiệp vụ.</figcaption></figure>

<h2>5. Prototype</h2>
<div class="grid2"><figure><img src="img/04-tiep-nhan.png" alt="Màn tiếp nhận pin"><figcaption>Tiếp nhận pin: nhận mọi hãng, miễn phí, checklist an toàn.</figcaption></figure>
<figure><img src="img/10-bao-cao-epr.png" alt="Màn báo cáo EPR"><figcaption>Báo cáo EPR: V, R × V, kết quả, bảo lưu, F theo tham số năm.</figcaption></figure></div>

<h2>6. AI có kiểm soát</h2>
<p>Mô hình ước lượng SoH đạt sai số trung bình {m['mae']:.2f} điểm % và độ phủ khoảng tin cậy {m['coverage_90']*100:.1f}%, nhưng <b>chưa đạt yêu cầu vận hành</b>: {m['manual_rate']*100:.1f}% pin vẫn phải đo tay ở ngưỡng 70%. Quyết định: MVP chạy mô hình song song, chỉ bật tự động khi đạt yêu cầu trên dữ liệu pack thật.</p>
<figure><img src="img/fig-pred-b0006.png" alt="Dự đoán SoH và khoảng tin cậy"><figcaption>Cell để riêng khi huấn luyện; khoảng tin cậy 90% bằng Conformalized Quantile Regression.</figcaption></figure>

<h2>7. Business case</h2>
<figure><img src="img/fig-npv.png" alt="NPV chi phí theo phương án"><figcaption>Âm = có lãi. Giá trị likely, chính sách dự thảo.</figcaption></figure>
<p>Khuyến nghị: ắc quy chì chọn tự tổ chức tái chế ngay từ năm trách nhiệm 2026; pin Li xây nền tảng và mạng thu hồi ngay, quyết định hình thức 2029–2031 trước 30/6/2028 dựa trên giá pin đời thứ hai đo thực tế.</p>

<footer><p>Dữ liệu doanh nghiệp là giả lập; VELIX là tên hư cấu. Đây là phân tích nghiệp vụ, không phải tư vấn pháp lý. Nguồn: Nghị định 110/2026/NĐ-CP, Luật BVMT 2020, Regulation (EU) 2023/1542, ICCT, VinFast Form 20-F, NASA PCoE, Battery Pass consortium (CC BY 4.0).</p></footer>
</div></body></html>"""
(DOCS / "index.html").write_text(index, encoding="utf-8")

forecast = f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Battery 2030 — Dashboard dự báo</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap"><script src="https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js"></script><style>{CSS}</style></head><body><div class="wrap">
<header class="hero"><div class="eyebrow">S9 · S10 · Dashboard dự báo</div><h1>Pin xe điện hết hạn tại Việt Nam 2025–2035</h1>
<p class="lead">Chọn kịch bản doanh số. Khoảng màu là P10–P90 của 1.000 lượt Monte Carlo. Rê chuột để xem số.</p>
<div class="links"><a class="ghost" href="index.html">← Case study</a><a class="ghost" href="{REPO}03-forecast/S9-forecast-results.md">Phương pháp và bảng số</a></div></header>
<div class="bar" role="group" aria-label="Kịch bản">{''.join(f'<button type="button" data-sc="{s}" aria-pressed="false">{s}</button>' for s in ['Chậm', 'Cơ sở', 'Nhanh'])}</div>
<div class="kpis flat" id="stats"></div>
<div class="grid2"><div id="fan" class="chart"></div><div id="seg" class="chart"></div></div>
<h2>Năm vượt ngưỡng công suất tái chế pin Li</h2><div class="tw"><table id="cross"></table></div>
<h2>Dòng pin hết hạn năm 2030</h2><p class="note" style="margin:-4px 0 10px">Cam: ắc quy chì · xanh dương: pin Li xe máy · xanh ngọc: pin Li ô tô · xám: kênh phi chính thức / thất thoát. Đơn vị nghìn tấn.</p><div id="sankey" class="chart" style="min-height:480px"></div>
<p class="note">Nguồn: 03-forecast/outputs (forecast.py, seed 2030). Phần phi chính thức là ước lượng theo khoảng, không quan sát được trực tiếp.</p></div>
<script>
const FAN={json.dumps(fan, ensure_ascii=False)},SEG={json.dumps(seg, ensure_ascii=False)},CROSS={json.dumps(cross, ensure_ascii=False)},SK={json.dumps(sankey, ensure_ascii=False)};
const C={{"e2W-Li":"#2a78d6","e2W-Chì":"#eb6834","Ô tô-Li":"#1baf7a"}},L={{"e2W-Li":"Xe máy pin Li","e2W-Chì":"Xe máy ắc quy chì","Ô tô-Li":"Ô tô pin Li"}};
const dark=false,ink=dark?'#e7eef6':'#0f1e2b',grid=dark?'#25344a':'#e9eef4',bg=dark?'#141f2c':'#ffffff';
const lay=t=>({{title:{{text:t,x:0.02,font:{{size:15}}}},paper_bgcolor:bg,plot_bgcolor:bg,font:{{color:ink,size:12}},margin:{{l:56,r:16,t:48,b:40}},xaxis:{{gridcolor:grid}},yaxis:{{gridcolor:grid,title:'nghìn tấn / năm'}},legend:{{orientation:'h',y:-0.15}},hovermode:'x unified'}});
const kt=a=>a.map(v=>v/1000);
function draw(sc){{
 document.querySelectorAll('.bar button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.sc===sc));
 const f=FAN[sc].Li_eol_t;
 Plotly.react('fan',[{{x:f.year,y:kt(f.p90),mode:'lines',line:{{width:0}},hoverinfo:'skip',showlegend:false}},
  {{x:f.year,y:kt(f.p10),mode:'lines',fill:'tonexty',fillcolor:'rgba(16,185,129,0.20)',line:{{width:0}},name:'P10–P90',hovertemplate:'P10 %{{y:.1f}}<extra></extra>'}},
  {{x:f.year,y:kt(f.p50),mode:'lines',line:{{color:'#059669',width:3}},name:'Trung vị P50',hovertemplate:'P50 %{{y:.1f}} nghìn tấn<extra></extra>'}}],lay('Pin Li hết hạn — '+sc),{{displayModeBar:false,responsive:true}});
 const s=SEG[sc];
 Plotly.react('seg',['e2W-Chì','e2W-Li','Ô tô-Li'].map(k=>({{type:'bar',x:s[k].year,y:kt(s[k].eol_t),name:L[k],marker:{{color:C[k],line:{{color:bg,width:1}}}},hovertemplate:L[k]+': %{{y:.1f}}<extra></extra>'}})),Object.assign(lay('Theo phân khúc (likely)'),{{barmode:'stack'}}),{{displayModeBar:false,responsive:true}});
 const d=SK[sc],NC={{"Hết hạn: e2W-Chì":"#ea580c","Hết hạn: e2W-Li":"#2563eb","Hết hạn: Ô tô-Li":"#0d9488","Thu hồi chính thức":"#059669","Phi chính thức / thất thoát":"#94a3b8","Tái chế có phép":"#0e7490","Đời thứ hai":"#16a34a"}},
   POS={{"Hết hạn: e2W-Chì":[0.001,0.2],"Hết hạn: e2W-Li":[0.001,0.62],"Hết hạn: Ô tô-Li":[0.001,0.88],"Thu hồi chính thức":[0.42,0.72],"Phi chính thức / thất thoát":[0.999,0.25],"Tái chế có phép":[0.999,0.74],"Đời thứ hai":[0.999,0.95]}},
   hex2=(h,a)=>'rgba('+[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',')+','+a+')',
   lab=d.nodes.map(n=>n.replace('Hết hạn: e2W-Li','Xe máy pin Li hết hạn').replace('Hết hạn: e2W-Chì','Xe máy ắc quy chì hết hạn').replace('Hết hạn: Ô tô-Li','Ô tô pin Li hết hạn'));
 Plotly.react('sankey',[{{type:'sankey',arrangement:'fixed',node:{{label:lab,x:d.nodes.map(n=>POS[n][0]),y:d.nodes.map(n=>POS[n][1]),color:d.nodes.map(n=>NC[n]),pad:18,thickness:16,line:{{width:0}}}},
   link:{{source:d.links.map(l=>l.source),target:d.links.map(l=>l.target),value:d.links.map(l=>l.value/1000),
   color:d.links.map(l=>hex2(NC[d.nodes[l.target]==='Phi chính thức / thất thoát'?d.nodes[l.target]:d.nodes[l.source]],0.35)),
   hovertemplate:'%{{source.label}} → %{{target.label}}: %{{value:.1f}} nghìn tấn<extra></extra>'}}}}],{{paper_bgcolor:'#ffffff',font:{{color:'#0f1e2b',size:13}},margin:{{l:10,r:10,t:10,b:10}}}},{{displayModeBar:false,responsive:true}});
 const at=(o,y)=>o.p50[o.year.indexOf(y)]/1000, fmt=v=>v.toFixed(1).replace('.',','), c10=CROSS.find(r=>r.scenario===sc&&r.threshold_kt===10);
 document.getElementById('stats').innerHTML=`<div class="kpi"><b>${{fmt(at(f,2030))}} nghìn t</b><span>pin Li hết hạn năm 2030 (P50)</span></div><div class="kpi"><b>${{fmt(at(f,2035))}} nghìn t</b><span>pin Li hết hạn năm 2035 (P50)</span></div><div class="kpi"><b>${{c10.year_p10}}–${{c10.year_p90}}</b><span>năm vượt 10 nghìn tấn/năm (P10–P90)</span></div><div class="kpi"><b>${{fmt(at(FAN[sc]['Chì_eol_t'],2030))}} nghìn t</b><span>ắc quy chì hết hạn năm 2030 (P50)</span></div>`;
 document.getElementById('cross').innerHTML='<tr><th>Ngưỡng (nghìn tấn/năm)</th><th>Năm (likely)</th><th>P10–P90</th></tr>'+CROSS.filter(r=>r.scenario===sc).map(r=>`<tr><td>${{r.threshold_kt}}</td><td>${{r.year_likely}}</td><td>${{r.year_p10}}–${{r.year_p90}}</td></tr>`).join('');
}}
document.querySelectorAll('.bar button').forEach(b=>b.onclick=()=>draw(b.dataset.sc));draw('Cơ sở');
</script></body></html>"""
(DOCS / "forecast.html").write_text(forecast, encoding="utf-8")
print("ok")
