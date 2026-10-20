// T6.3 - Slide trinh bay 11 trang (pptxgenjs). Chay: node 08-package/build_deck.js (NODE_PATH co pptxgenjs)
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = p => path.join(ROOT, p);
const THEME = { name: 'Battery 2030', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
  colors: { dk1: '16201C', lt1: 'FFFFFF', dk2: '1F3A33', lt2: 'EEF2F0', accent1: '1F6F5C', accent2: 'EB6834', accent3: '2A78D6',
    accent4: '1BAF7A', accent5: '6F6E69', accent6: 'B3261E', hlink: '2A78D6', folHlink: '6250D6' } };
const tests = JSON.parse(fs.readFileSync(P('06-test/test-results.json'), 'utf8'));
const ai = JSON.parse(fs.readFileSync(P('05-ai-soh/outputs/metrics.json'), 'utf8'));
const csvRow = l => (l.match(/("[^"]*"|[^,]+)(?=,|$)/g) || []).map(x => x.replace(/^"|"$/g, ''));
const npv = fs.readFileSync(P('07-business-case/outputs/npv_likely.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map(csvRow);
const pngSize = f => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };
function fit(f, maxW, maxH) { const s = pngSize(f), r = s.w / s.h; let w = maxW, h = w / r; if (h > maxH) { h = maxH; w = h * r; } return { w, h }; }

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'Battery 2030'; pres.author = 'taint7684';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
pres.defineSlideMaster({ title: 'DARK', background: { color: '16201C' }, objects: [
  { placeholder: { options: { name: 'title', type: 'title', x: 0.7, y: 2.2, w: 11.9, h: 1.6, fontSize: 44, bold: true, color: 'FFFFFF', valign: 'bottom' }, text: '' } },
  { placeholder: { options: { name: 'body', type: 'body', x: 0.7, y: 3.95, w: 11.9, h: 1.6, fontSize: 18, color: 'CFE3DC', valign: 'top' }, text: '' } }] });
pres.defineSlideMaster({ title: 'CONTENT', background: { color: 'FFFFFF' }, slideNumber: { x: 12.4, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: '6F6E69' },
  objects: [{ text: { text: 'Battery 2030 · VELIX (giả định) · 10/2026', options: { x: 0.6, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: '6F6E69', isTextBox: true } } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.9, fontSize: 32, bold: true, color: '16201C', valign: 'middle' }, text: '' } }] });

const body = (s, items, x, y, w, h, size = 16) => s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 8 } })),
  { x, y, w, h, fontSize: size, color: C.text1, valign: 'top', isTextBox: true, objectName: 'body-bullets' });
const img = (s, f, x, y, maxW, maxH, name) => { const d = fit(P(f), maxW, maxH); s.addImage({ path: P(f), x, y, w: d.w, h: d.h, objectName: name, altText: name }); return d; };
const stat = (s, x, y, big, small, color) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.85, h: 1.9, fill: { color: C.background2 }, line: { color: C.background2 }, rectRadius: 0.12, objectName: 'stat-card' });
  s.addText(big, { x: x + 0.2, y: y + 0.2, w: 2.45, h: 0.9, fontSize: 34, bold: true, color, fontFace: THEME.headFontFace, isTextBox: true, margin: 0 });
  s.addText(small, { x: x + 0.2, y: y + 1.05, w: 2.45, h: 0.75, fontSize: 13, color: C.text1, isTextBox: true, margin: 0, valign: 'top' });
};

// 1
pres.addSection({ title: 'Mở đầu' });
let s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Mở đầu' });
s.addText('Battery 2030', { placeholder: 'title' });
s.addText('Nền tảng quản lý vòng đời và trách nhiệm thu hồi pin xe điện tại Việt Nam\nDự báo làn sóng pin hết hạn 2030 · Thiết kế giải pháp · Business case', { placeholder: 'body' });
s.addNotes('Khách hàng giả định VELIX, hãng xe máy điện chịu nghĩa vụ EPR. Mọi dữ liệu doanh nghiệp là giả lập; số liệu thị trường có nguồn.');
// 2
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Mở đầu' });
s.addText('Làn sóng pin Li thật sự bắt đầu quanh 2029–2030', { placeholder: 'title' });
stat(s, 0.6, 1.6, '≈15 kt', 'pin Li hết hạn năm 2030 (P10–P90: 11–20 nghìn tấn)', C.accent3);
stat(s, 3.7, 1.6, '≈71 kt', 'năm 2035, gấp gần 5 lần 2030', C.accent3);
stat(s, 6.8, 1.6, '0% → 8%', 'tỷ lệ tái chế bắt buộc pin Li: hiện hành → dự thảo từ 2029', C.accent2);
stat(s, 9.9, 1.6, `${tests.passed}/${tests.total}`, 'test case tự động đạt trên prototype', C.accent1);
body(s, ['Mốc điều chỉnh 2029 của NĐ 110/2026 trùng năm pin Li hết hạn vượt 10 nghìn tấn/năm',
  'Ắc quy chì (≈33 nghìn tấn/năm) mới là bài toán hiện tại; nghĩa vụ 12% đã có',
  'Khuyến nghị: tự tổ chức thu hồi ắc quy chì ngay; quyết định hình thức EPR pin Li trước 30/6/2028'], 0.6, 3.9, 12.1, 2.8, 18);
s.addNotes('Thông điệp chính trước, chi tiết sau. Mọi số là trung vị Monte Carlo, kịch bản Cơ sở.');
// 3
pres.addSection({ title: 'Phát hiện' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Phát hiện' });
s.addText('Việt Nam đo khối lượng đã tái chế, EU đo tỷ lệ thu gom', { placeholder: 'title' });
const hdr = t => ({ text: t, options: { bold: true, color: 'FFFFFF', fill: { color: '1F6F5C' } } });
s.addTable([[hdr('Chủ đề'), hdr('Việt Nam (NĐ 110/2026)'), hdr('EU 2023/1542'), hdr('Mức')],
  ['Chỉ tiêu', 'Tái chế theo khối lượng bán cùng năm; pin Li 0%, chì 12%', 'Thu gom pin LMT 51% (2028), 61% (2031)', '⛔'],
  ['Mạng thu hồi', 'Không bắt buộc', 'Miễn phí, mọi hãng, phủ toàn lãnh thổ', '⛔'],
  ['Đời thứ hai', 'Chưa có quy định', 'Bằng chứng SoH + hợp đồng chuyển giao', '⛔'],
  ['Định danh', 'Chưa có', 'Battery passport từ 18/2/2027', '⛔'],
  ['Chứng từ giao nhận', 'Theo dõi riêng, mẫu CTNH', 'Báo cáo lượng giao xử lý, xuất khẩu', '✏️']],
  { x: 0.6, y: 1.5, w: 12.1, colW: [2.2, 4.3, 4.6, 1.0], fontSize: 14, color: '16201C', border: { type: 'solid', color: 'D9DED9', pt: 0.75 }, valign: 'middle', rowH: 0.62, objectName: 'gap-table' });
s.addText('18 chủ đề: 6 ⛔ · 7 ⚠️ · 5 ✏️ — chi tiết ở S6. Phân tích nghiệp vụ, không phải tư vấn pháp lý.', { x: 0.6, y: 5.6, w: 12.1, h: 0.5, fontSize: 13, color: C.accent5, isTextBox: true, margin: 0 });
s.addNotes('Trích nguyên văn ở req-extraction-vn.csv và req-extraction-eu.csv. ⛔ = Việt Nam chưa có quy định tương ứng, nền tảng tự đặt yêu cầu.');
// 4
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Phát hiện' });
s.addText('Pin Li hết hạn tăng gần 5 lần trong 2030–2035', { placeholder: 'title' });
img(s, '03-forecast/outputs/fig-li-fan.png', 0.6, 1.4, 7.9, 5.4, 'chart-fan');
body(s, ['Cohort × Weibull, có thay pin và thải bỏ xe; 1.000 lượt Monte Carlo/kịch bản', 'Mốc 10 nghìn tấn/năm: 2029–2030 ở cả 3 kịch bản', 'Tuổi thọ ±2 năm: mốc dịch ~1 năm, lượng 2030 đổi −32% đến +69%', 'Khớp VinFast 20-F (5/5 phép kiểm) và World Bank (lệch 1%)'], 8.8, 1.5, 3.9, 5.2, 15);
s.addNotes('Nguồn: ICCT, VinFast Form 20-F, IEA (Unverified). Sai số chủ yếu đến từ thông số pin, không phải doanh số.');
// 5
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Phát hiện' });
s.addText('70% pin hết hạn năm 2030 đi kênh không chứng từ', { placeholder: 'title' });
img(s, '03-forecast/outputs/fig-sankey-2030.png', 0.6, 1.4, 8.3, 5.3, 'sankey');
stat(s, 9.5, 1.5, '45%', 'pin Li đủ điều kiện kỹ thuật cho đời thứ hai', C.accent4);
stat(s, 9.5, 3.6, '16%', 'thực sự đến đời thứ hai — đòn bẩy là thu hồi', C.accent2);
s.addNotes('Phần phi chính thức là phần còn lại, ước lượng theo khoảng 50–80% với pin Li; không có số đo trực tiếp.');
// 6
pres.addSection({ title: 'Giải pháp' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Giải pháp' });
s.addText('Quy trình To-Be: mỗi điểm chạm của pin đều có dữ liệu', { placeholder: 'title' });
img(s, '04-solution/S13-bpmn/to-be.png', 0.6, 1.4, 12.1, 3.9, 'bpmn');
body(s, ['8 phân hệ · 33 FR · 11 NFR · 30 quy tắc nghiệp vụ theo EARS', 'Hai chặng chứng từ: điểm thu hồi → trung tâm kiểm định → đối tác', 'R, Fs, hạn nộp là tham số theo năm trách nhiệm — không sửa mã khi luật đổi'], 0.6, 5.45, 12.1, 1.5, 15);
s.addNotes('Chi tiết ở S13 và SRS S14.');
// 7
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Giải pháp' });
s.addText('Prototype 14 màn hình, kiểm thử tự động 100%', { placeholder: 'title' });
img(s, '04-solution/screens/04-tiep-nhan.png', 0.6, 1.5, 6.0, 3.9, 'screen-intake');
img(s, '04-solution/screens/10-bao-cao-epr.png', 6.8, 1.5, 6.0, 3.9, 'screen-epr');
body(s, [`${tests.passed}/${tests.total} test case Playwright đạt; 64/64 AC và 30/30 quy tắc được phủ`, 'Kỹ thuật: phân vùng tương đương, giá trị biên, bảng quyết định, chuyển trạng thái', '6 lỗi thật phát hiện và sửa trong quá trình kiểm thử, có test hồi quy'], 0.6, 5.55, 12.1, 1.4, 15);
// 8
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Giải pháp' });
s.addText('AI ước lượng SoH: đủ chính xác, chưa đủ chắc để tự quyết', { placeholder: 'title' });
img(s, '05-ai-soh/outputs/fig-pred-b0006.png', 0.6, 1.4, 7.4, 4.0, 'soh-chart');
const okc = v => (v ? 'Đạt' : 'Không đạt');
s.addTable([[hdr('Yêu cầu'), hdr('Đo được'), hdr('Kết quả')],
  ['AIR-01 MAE ≤ 3 điểm', ai.mae.toFixed(2).replace('.', ','), okc(ai.pass['AIR-01 MAE'])],
  ['AIR-02 độ phủ ≥ 85%', (ai.coverage_90 * 100).toFixed(1).replace('.', ',') + '%', okc(ai.pass['AIR-02 coverage'])],
  ['AIR-03 tự động đúng ≥ 97%', (ai.auto_accuracy * 100).toFixed(1).replace('.', ',') + '%', okc(ai.pass['AIR-03 auto accuracy'])],
  ['AIR-04 đo tay ≤ 30%', (ai.manual_rate * 100).toFixed(1).replace('.', ',') + '%', okc(ai.pass['AIR-04 manual rate'])]],
  { x: 8.3, y: 1.5, w: 4.4, colW: [2.2, 1.1, 1.1], fontSize: 13, color: '16201C', border: { type: 'solid', color: 'D9DED9', pt: 0.75 }, rowH: 0.55, objectName: 'air-table' });
s.addText('Quyết định DEC-11: MVP chạy mô hình song song, mọi pin đo tay; bật tự động khi đạt AIR-03/04 trên 500 pin VELIX', { x: 0.6, y: 5.65, w: 12.1, h: 0.9, fontSize: 16, color: C.text1, isTextBox: true, margin: 0 });
s.addNotes('Dữ liệu NASA PCoE, 4 cell 18650; kiểm định leave-one-battery-out; khoảng tin cậy bằng Conformalized Quantile Regression.');
// 9
pres.addSection({ title: 'Business case' });
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Business case' });
s.addText('Tự tổ chức thắng cho ắc quy chì; pin Li phụ thuộc giá đời thứ hai', { placeholder: 'title' });
const pol = npv.filter(r => r[0].startsWith('Dự thảo'));
const val = (g, k) => +(pol.find(r => r[1] === g)[{ A: 2, B: 3, C: 4 }[k]]) / 1000;
s.addChart(pres.charts.BAR, [
  { name: 'A Tự tổ chức', labels: ['Ắc quy chì', 'Pin Li'], values: [val('Chì', 'A'), val('Li', 'A')] },
  { name: 'B Đóng quỹ', labels: ['Ắc quy chì', 'Pin Li'], values: [val('Chì', 'B'), val('Li', 'B')] },
  { name: 'C Ủy quyền PRO', labels: ['Ắc quy chì', 'Pin Li'], values: [val('Chì', 'C'), val('Li', 'C')] }],
  { x: 0.6, y: 1.4, w: 7.6, h: 5.3, barDir: 'col', barGrouping: 'clustered', chartColors: ['2A78D6', 'EB6834', '1BAF7A'],
    showTitle: true, title: 'NPV chi phí 2027–2035, tỷ đồng (âm = có lãi) — chính sách dự thảo', titleFontSize: 13, titleFontFace: '+mn-lt', titleColor: '16201C',
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 11, dataLabelFormatCode: '0.0', dataLabelColor: '16201C', dataLabelFontFace: '+mn-lt',
    showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: '+mn-lt', catAxisLabelColor: '52514E', valAxisLabelColor: '52514E', catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
    valGridLine: { color: 'E4E3DF', size: 0.5 }, catGridLine: { style: 'none' }, objectName: 'npv-chart' });
stat(s, 8.8, 1.5, '100%', 'lượt mô phỏng A rẻ nhất cho ắc quy chì', C.accent3);
stat(s, 8.8, 3.6, '0,53 tr', 'đ/kWh — giá pin đời thứ hai hòa vốn A = C cho pin Li (dự thảo)', C.accent2);
s.addText('Giả định giá trị kinh tế có mức tin cậy Thấp, trình bày theo khoảng', { x: 8.8, y: 5.7, w: 3.9, h: 0.8, fontSize: 13, color: C.accent5, isTextBox: true, margin: 0 });
s.addNotes('2.000 lượt Monte Carlo. Pin Li theo dự thảo: A rẻ nhất 97,0%, C 3,0%. Fs pin sạc 54.876 đ/kg theo TT 07/2025. Theo chính sách 0%: A 60%, B 40%.');
// 10
s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: 'Business case' });
s.addText('Ba quyết định và lộ trình', { placeholder: 'title' });
const steps = [['Q4/2026', 'Hợp đồng đơn vị tái chế chì; hồ sơ chủ nguồn thải 3 điểm thí điểm'], ['31/3/2027', 'Đăng ký "Tổ chức tái chế" cho ắc quy chì, năm trách nhiệm 2026'],
  ['Q1/2027', 'MVP nền tảng: 25 story, 5 sprint'], ['2028', 'Thí điểm đời thứ hai, đo giá bán thật'], ['30/6/2028', 'Chọn hình thức EPR pin Li cho 2029–2031']];
steps.forEach(([d, t], i) => {
  const x = 0.6 + i * 2.48;
  s.addShape(pres.shapes.OVAL, { x: x + 0.85, y: 1.9, w: 0.6, h: 0.6, fill: { color: i === 1 || i === 4 ? C.accent2 : C.accent1 }, line: { color: 'FFFFFF' }, objectName: 'step-dot' });
  s.addText(String(i + 1), { x: x + 0.85, y: 1.9, w: 0.6, h: 0.6, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
  s.addText(d, { x, y: 2.7, w: 2.3, h: 0.5, fontSize: 18, bold: true, color: C.text1, align: 'center', isTextBox: true, margin: 0 });
  s.addText(t, { x, y: 3.25, w: 2.3, h: 1.6, fontSize: 14, color: C.text1, align: 'center', valign: 'top', isTextBox: true, margin: 0 });
});
s.addShape(pres.shapes.LINE, { x: 1.75, y: 2.2, w: 9.9, h: 0, line: { color: 'C9D1CD', width: 1.5 }, objectName: 'timeline' });
s.addText('Quy tắc đổi hướng: giá pin đời thứ hai < ~0,5 triệu đ/kWh hoặc tỷ lệ đủ điều kiện < 20% → pin Li chuyển sang PRO', { x: 0.6, y: 5.3, w: 12.1, h: 0.9, fontSize: 16, color: C.text1, isTextBox: true, margin: 0 });
// 11
pres.addSection({ title: 'Kết' });
s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Kết' });
s.addText('Dữ liệu từng pin là điều kiện của mọi phương án', { placeholder: 'title' });
s.addText('Tài liệu, dữ liệu, mã nguồn: github.com/taint7684/battery-2030-ba\nDashboard và prototype: taint7684.github.io/battery-2030-ba', { placeholder: 'body' });

(async () => {
  const out = P('08-package/S23-deck.pptx');
  await pres.writeFile({ fileName: out });
  const { applyTheme } = require(process.env.APPLY_THEME);
  await applyTheme(out, THEME);
  console.log('ok', out);
})();
