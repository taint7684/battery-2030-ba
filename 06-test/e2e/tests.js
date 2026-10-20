// Bo test case tu dong cho prototype (S20). Moi TC: id, tieu de, ma truy vet, ky thuat thiet ke, buoc, ket qua mong doi, ham chay.
// Ky thuat: EP = phan vung tuong duong, BVA = gia tri bien, DT = bang quyet dinh, ST = chuyen trang thai, UC = luong use case, NFR = phi chuc nang.
const assert = (c, m) => { if (!c) throw new Error(m); };

async function go(page, user, route) {
  await page.evaluate(([u, r]) => { App.reset(); App.state.user = u; App.save(); location.hash = '#/' + r; App.render(); }, [user, route]);
}
const st = page => page.evaluate(() => App.state);
const fx = async (page, k) => (await st(page)).fixtures[k];
async function nav(page, route) { await page.evaluate(r => { location.hash = '#/' + r; App.render(); }, route); }
async function asUser(page, user, route) { await page.evaluate(([u, r]) => { App.state.user = u; App.save(); location.hash = '#/' + r; App.render(); }, [user, route]); }
const text = (page, sel) => page.locator(sel).first().innerText();

// Dua pin fixture qua SoH -> Da danh gia, tra ve uid
async function evaluated(page, key, user = 'u-quan') {
  const uid = await fx(page, key);
  await asUser(page, user, 'soh');
  await page.locator(`tr[data-uid="${uid}"] [data-testid=soh-confirm]`).click();
  return uid;
}
// Tao pin Cho tai che tai Trung tam (chi): dung pin chi tai TT co san
async function waitingAtTT(page) {
  const s = await st(page);
  return s.batteries.filter(b => b.status === 'Chờ tái chế' && b.loc === 'TT').map(b => b.uid);
}

module.exports = [
  // ---------- EP-01 So dang ky ----------
  { id: 'TC-001', title: 'Model LFP 11,5 kg → B.2.1 và LMT', refs: 'AC-01; BR-03', tech: 'EP',
    steps: 'Đăng nhập Cán bộ tuân thủ; mở Model pin; xem dòng LF48', expected: 'Nhóm VN B.2.1; nhóm EU LMT',
    run: async p => { await go(p, 'u-lan', 'models'); assert((await text(p, '[data-testid=vn-LF48]')).startsWith('B.2.1'), 'VN'); assert((await text(p, '[data-testid=eu-LF48]')) === 'LMT', 'EU'); } },
  { id: 'TC-002', title: 'Model chì 28 kg → B.1.1 và pin xe điện hạng L', refs: 'AC-02; BR-03', tech: 'EP',
    steps: 'Mở Model pin; xem dòng PB48', expected: 'B.1.1 Ắc quy chì; Pin xe điện (hạng L >25 kg)',
    run: async p => { await go(p, 'u-lan', 'models'); assert((await text(p, '[data-testid=vn-PB48]')).startsWith('B.1.1'), 'VN'); assert((await text(p, '[data-testid=eu-PB48]')).startsWith('Pin xe điện'), 'EU'); } },
  { id: 'TC-003', title: 'Biên LMT: 25,0 kg là LMT; 25,1 kg là pin xe điện', refs: 'AC-01; BR-03', tech: 'BVA',
    steps: 'Đăng ký model LFP 25 kg và 25,1 kg', expected: '25,0 → LMT; 25,1 → Pin xe điện (hạng L >25 kg)',
    run: async p => { await go(p, 'u-lan', 'models');
      for (const [code, kg, want] of [['B25', 25, 'LMT'], ['B251', 25.1, 'Pin xe điện']]) {
        await p.fill('[data-testid=m-code]', code); await p.fill('[data-testid=m-name]', 'Thử ' + code); await p.selectOption('[data-testid=m-chem]', 'LFP');
        await p.fill('[data-testid=m-kwh]', '2'); await p.fill('[data-testid=m-kg]', String(kg)); await p.click('[data-testid=m-save]');
        assert((await text(p, `[data-testid=eu-${code}]`)).startsWith(want), code); } } },
  { id: 'TC-004', title: 'Thiếu khối lượng/hóa học thì không lưu model', refs: 'AC-03; BR-03', tech: 'EP',
    steps: 'Nhập mã, tên; bỏ trống hóa học và khối lượng; Lưu', expected: 'Không lưu; lỗi dưới trường hóa học và khối lượng',
    run: async p => { await go(p, 'u-lan', 'models'); const n0 = (await st(p)).models.length;
      await p.fill('[data-testid=m-code]', 'X1'); await p.fill('[data-testid=m-name]', 'Thiếu'); await p.click('[data-testid=m-save]');
      assert((await st(p)).models.length === n0, 'da luu'); assert((await text(p, '[data-err=chemistry]')).length > 0 && (await text(p, '[data-err=mass_kg]')).length > 0, 'thieu loi'); } },
  { id: 'TC-005', title: 'Bên ghi nhãn là chủ thể EPR', refs: 'AC-04; BR-05', tech: 'UC',
    steps: 'Đăng ký model có nhà sản xuất "OEM B", bên ghi nhãn "VELIX"; mở bảng model', expected: 'Hiển thị cả hai; cột chủ thể EPR = VELIX',
    run: async p => { await go(p, 'u-lan', 'models');
      await p.fill('[data-testid=m-code]', 'LB1'); await p.fill('[data-testid=m-name]', 'Nhãn'); await p.selectOption('[data-testid=m-chem]', 'NMC');
      await p.fill('[data-testid=m-kwh]', '1'); await p.fill('[data-testid=m-kg]', '9'); await p.fill('[data-testid=m-mfr]', 'OEM B'); await p.click('[data-testid=m-save]');
      const row = await text(p, 'tr[data-model=LB1]'); assert(row.includes('OEM B') && (await text(p, '[data-testid=labeler-LB1]')) === 'VELIX', row); } },
  { id: 'TC-006', title: 'Đơn bán ERP cấp mã đúng cấu trúc và Luhn', refs: 'AC-05; BR-01; BR-02', tech: 'UC',
    steps: 'Gửi đơn bán LF48 ngày 15/10/2026', expected: 'Pin Đang lưu hành, ngày 15/10/2026, mã VLX-LF48-26-NNNNNNN-C hợp lệ Luhn',
    run: async p => { await go(p, 'u-lan', 'models'); await p.fill('[data-testid=erp-date]', '2026-10-15'); await p.click('[data-testid=erp-submit]');
      const uid = await text(p, '[data-testid=erp-uid]'); assert(/^VLX-LF48-26-\d{7}-\d$/.test(uid), uid);
      const ok = await p.evaluate(u => Domain.checkUid(u), uid); assert(ok, 'luhn');
      const b = (await st(p)).batteries.find(x => x.uid === uid); assert(b.status === 'Đang lưu hành' && b.placed_date === '2026-10-15', 'status'); } },
  { id: 'TC-007', title: 'Mã không cấp lại sau khi hủy đăng ký', refs: 'AC-06; BR-01', tech: 'ST',
    steps: 'Cấp mã A; hủy đăng ký A; cấp mã B', expected: 'Số thứ tự B = A + 1; A ≠ B; A vẫn tồn tại trạng thái Đã hủy đăng ký',
    run: async p => { await go(p, 'u-lan', 'models'); await p.click('[data-testid=erp-submit]'); const a = await text(p, '[data-testid=erp-uid]');
      await nav(p, 'battery/' + a); await p.click('[data-testid=cancel-btn]');
      await nav(p, 'models'); await p.fill('[data-testid=erp-vin]', 'VLXV900002'); await p.click('[data-testid=erp-submit]'); const b = await text(p, '[data-testid=erp-uid]');
      const sa = +a.split('-')[3], sb = +b.split('-')[3]; assert(sb === sa + 1 && a !== b, `${a} ${b}`);
      assert((await st(p)).batteries.find(x => x.uid === a).status === 'Đã hủy đăng ký', 'huy'); } },
  { id: 'TC-008', title: 'Mã định danh duy nhất trên toàn sổ', refs: 'BR-01; NFR-07', tech: 'EP',
    steps: 'Đếm mã trùng trong sổ đăng ký; kiểm Luhn mọi mã VLX', expected: '0 mã trùng; 100% mã VLX hợp lệ Luhn',
    run: async p => { await go(p, 'u-lan', 'registry'); const r = await p.evaluate(() => { const u = App.state.batteries.map(b => b.uid); const v = u.filter(x => x.startsWith('VLX'));
      return { dup: u.length - new Set(u).size, bad: v.filter(x => !Domain.checkUid(x)).length }; }); assert(r.dup === 0 && r.bad === 0, JSON.stringify(r)); } },
  { id: 'TC-009', title: 'Cờ Xuất khẩu loại pin khỏi V', refs: 'AC-07; BR-04', tech: 'EP',
    steps: 'Đọc V 2026 nhóm B.1.1; gắn cờ Xuất khẩu cho một pin chì 2026; đọc lại V', expected: 'V giảm đúng 28 kg',
    run: async p => { await go(p, 'u-lan', 'registry');
      const uid = await p.evaluate(() => App.state.batteries.find(b => b.model === 'PB48' && b.placed_date.startsWith('2026') && !b.flags.length && b.status === 'Đang lưu hành').uid);
      const v0 = await p.evaluate(() => Domain.computeV(App.state, 2026, 'B.1.1'));
      await nav(p, 'battery/' + uid); await p.selectOption('[data-testid=flag-select]', 'Xuất khẩu'); await p.click('[data-testid=flag-btn]');
      const v1 = await p.evaluate(() => Domain.computeV(App.state, 2026, 'B.1.1')); assert(Math.abs(v0 - v1 - 28) < 1e-6, `${v0} ${v1}`); } },
  { id: 'TC-010', title: 'Cờ NCC đã thực hiện EPR loại pin khỏi V', refs: 'AC-08; BR-04', tech: 'EP',
    steps: 'Gắn cờ NCC đã thực hiện EPR cho một pin LF48 năm 2026', expected: 'V nhóm B.2.1 giảm đúng 11,5 kg',
    run: async p => { await go(p, 'u-lan', 'registry');
      const uid = await p.evaluate(() => App.state.batteries.find(b => b.model === 'LF48' && b.placed_date.startsWith('2026') && !b.flags.length && b.status === 'Đang lưu hành').uid);
      const v0 = await p.evaluate(() => Domain.computeV(App.state, 2026, 'B.2.1'));
      await nav(p, 'battery/' + uid); await p.selectOption('[data-testid=flag-select]', 'NCC đã thực hiện EPR'); await p.click('[data-testid=flag-btn]');
      const v1 = await p.evaluate(() => Domain.computeV(App.state, 2026, 'B.2.1')); assert(Math.abs(v0 - v1 - 11.5) < 1e-6, `${v0} ${v1}`); } },
  { id: 'TC-011', title: 'Lọc sổ đăng ký theo trạng thái và model', refs: 'AC-09; FR-04', tech: 'EP',
    steps: 'Lọc Đã thu hồi + LF60', expected: 'Mọi dòng thỏa cả hai điều kiện; bộ đếm khớp dữ liệu',
    run: async p => { await go(p, 'u-tuan', 'registry'); await p.selectOption('[data-testid=reg-status]', 'Đã thu hồi'); await p.selectOption('[data-testid=reg-model]', 'LF60');
      const cnt = parseInt(await text(p, '[data-testid=reg-count]'));
      const exp = await p.evaluate(() => App.state.batteries.filter(b => b.tenant === 'VELIX' && b.status === 'Đã thu hồi' && b.model === 'LF60').length);
      const rows = await p.locator('[data-testid=reg-table] tr').count(); assert(cnt === exp && rows - 1 === Math.min(exp, 50), `${cnt} ${exp} ${rows}`); } },
  // ---------- EP-02 Thu hoi ----------
  { id: 'TC-012', title: 'Không kích hoạt điểm thiếu hồ sơ CTNH', refs: 'AC-10; BR-09', tech: 'DT',
    steps: 'Kho vận bấm Kích hoạt điểm P04 (thiếu hồ sơ)', expected: 'Báo thiếu hồ sơ; P04 vẫn Chưa kích hoạt',
    run: async p => { await go(p, 'u-tuan', 'points'); await p.click('[data-testid=act-P04]'); assert(await p.locator('[data-testid=act-blocked]').count() === 1, 'khong bao');
      assert((await text(p, '[data-testid=pt-status-P04]')).includes('Chưa kích hoạt'), 'da kich hoat'); } },
  { id: 'TC-013', title: 'Kích hoạt điểm sau khi nhập hồ sơ CTNH', refs: 'AC-11; BR-09', tech: 'ST',
    steps: 'Bấm Kích hoạt P04; nhập mã DN-CTNH-0001, ngày 2026-10-20; Lưu', expected: 'P04 chuyển Hoạt động; nhật ký có thay đổi',
    run: async p => { await go(p, 'u-tuan', 'points'); await p.click('[data-testid=act-P04]'); await p.fill('[data-testid=ctnh-code]', 'DN-CTNH-0001'); await p.fill('[data-testid=ctnh-from]', '2026-10-20'); await p.click('[data-testid=ctnh-save]');
      assert((await text(p, '[data-testid=pt-status-P04]')).includes('Hoạt động'), 'chua kich hoat'); assert((await st(p)).audit.some(a => a.obj === 'P04' && a.field === 'active'), 'audit'); } },
  { id: 'TC-014', title: 'Tiếp nhận pin VELIX: miễn phí, đổi trạng thái, tăng tồn kho', refs: 'AC-12; BR-06; BR-24', tech: 'UC',
    steps: 'Đại lý P01 nhập mã pin Đang lưu hành, khối lượng mặc định, checklist trống; Lưu', expected: 'Phiếu tạo; pin Đã thu hồi tại P01; phí 0; tồn kho P01 tăng đúng khối lượng',
    run: async p => { await go(p, 'u-hung', 'intake');
      const uid = await p.evaluate(() => App.state.batteries.find(b => b.model === 'LF60' && b.status === 'Đang lưu hành' && b.tenant === 'VELIX').uid);
      const kg0 = await p.evaluate(() => Domain.pickupProposals(App.state, App.state.today).find(x => x.point === 'P01').kg);
      await p.fill('[data-testid=i-uid]', uid); await p.fill('[data-testid=i-kg]', '16.2'); await p.click('[data-testid=i-save]');
      const s = await st(p); const b = s.batteries.find(x => x.uid === uid), it = s.intakes.find(i => i.uid === uid);
      const kg1 = await p.evaluate(() => Domain.pickupProposals(App.state, App.state.today).find(x => x.point === 'P01').kg);
      assert(b.status === 'Đã thu hồi' && b.loc === 'P01' && it.fee === 0 && Math.abs(kg1 - kg0 - 16.2) < 0.05, JSON.stringify({ st: b.status, kg0, kg1 })); } },
  { id: 'TC-015', title: 'Tiếp nhận pin hãng khác: mã tạm và cờ', refs: 'AC-13; BR-06', tech: 'EP',
    steps: 'Chọn Pin hãng khác, hóa học Chì, 24 kg; Lưu', expected: 'Mã TMP-P01-…; cờ Hãng khác; phiếu lưu',
    run: async p => { await go(p, 'u-hung', 'intake'); await p.check('[data-testid=i-other]'); await p.selectOption('[data-testid=i-ochem]', 'Chì'); await p.fill('[data-testid=i-kg]', '24'); await p.click('[data-testid=i-save]');
      const uid = await text(p, '[data-testid=i-newuid]'); const b = (await st(p)).batteries.find(x => x.uid === uid);
      assert(/^TMP-P01-\d{5}$/.test(uid) && b.flags.includes('Hãng khác') && b.other_mass_kg === 24, uid); } },
  { id: 'TC-016', title: 'Điểm chưa kích hoạt không lập được phiếu', refs: 'AC-14; BR-09', tech: 'EP',
    steps: 'Đăng nhập đại lý P04 (chưa kích hoạt); mở Tiếp nhận', expected: 'Thông báo điểm chưa kích hoạt; không có form',
    run: async p => { await go(p, 'u-thao', 'intake'); assert(await p.locator('[data-testid=point-inactive]').count() === 1 && await p.locator('[data-testid=i-save]').count() === 0, 'form hien'); } },
  { id: 'TC-017', title: 'Checklist có dấu hiệu → cờ Nguy hiểm, loại khỏi Đời thứ hai', refs: 'AC-15; AC-35; BR-07', tech: 'DT',
    steps: 'Tiếp nhận LF60 với dấu hiệu Phồng; đưa qua đánh giá; mở Điều phối', expected: 'Hướng dẫn cách ly; cờ Nguy hiểm; đề xuất Tái chế; nút Đời thứ hai bị vô hiệu',
    run: async p => { await go(p, 'u-hung', 'intake');
      const uid = await p.evaluate(() => App.state.batteries.find(b => b.model === 'LF60' && b.status === 'Đang lưu hành' && b.tenant === 'VELIX').uid);
      await p.fill('[data-testid=i-uid]', uid); await p.fill('[data-testid=i-kg]', '16'); await p.check('[data-testid="chk-Phồng"]'); await p.click('summary');
      for (const f of ['remaining_capacity_ah', 'resistance_increase_pct', 'full_cycles', 'deep_discharge_events', 'hours_extreme_temp']) await p.fill(`[data-testid=bms-${f}]`, f === 'remaining_capacity_ah' ? '32' : '3');
      await p.click('[data-testid=i-save]'); assert(await p.locator('[data-testid=i-hazard]').count() === 1, 'khong canh bao');
      await asUser(p, 'u-quan', 'soh'); await p.locator(`tr[data-uid="${uid}"] [data-testid=soh-confirm]`).click();
      await nav(p, 'routing'); const row = p.locator(`tr[data-uid="${uid}"]`);
      assert((await row.locator('[data-testid=route-proposal]').innerText()).includes('Tái chế') && await row.locator('[data-testid=route-sl]').isDisabled(), 'SL khong bi chan'); } },
  { id: 'TC-018', title: 'Ngoại tuyến: 2 phiếu lưu thiết bị, đồng bộ không trùng', refs: 'AC-16; BR-30; NFR-02', tech: 'ST',
    steps: 'Bật Mất kết nối; lưu 2 phiếu; tắt; Đồng bộ; bấm Đồng bộ lần nữa nếu còn', expected: 'Số phiếu dạng P01-D1-NNNN; đúng 2 phiếu mới; không trùng',
    run: async p => { await go(p, 'u-hung', 'intake'); await p.check('[data-testid=offline-toggle]');
      const uids = await p.evaluate(() => App.state.batteries.filter(b => b.model === 'LF48' && b.status === 'Đang lưu hành' && b.tenant === 'VELIX').slice(0, 2).map(b => b.uid));
      const n0 = (await st(p)).intakes.length;
      for (const u of uids) { await p.fill('[data-testid=i-uid]', u); await p.fill('[data-testid=i-kg]', '11.5'); await p.click('[data-testid=i-save]'); }
      const ob = (await st(p)).outbox; assert(ob.length === 2 && ob.every(r => /^P01-D1-\d{4}$/.test(r.id)), JSON.stringify(ob.map(r => r.id)));
      await p.uncheck('[data-testid=offline-toggle]'); await p.click('[data-testid=i-sync]');
      const s = await st(p); assert(s.intakes.length === n0 + 2 && s.outbox.length === 0 && new Set(s.intakes.map(i => i.id)).size === s.intakes.length, 'trung'); } },
  { id: 'TC-019', title: 'Đề xuất gom lô khi tồn kho ≥80% sức chứa', refs: 'AC-17; BR-08', tech: 'BVA',
    steps: 'Đặt sức chứa P01 bằng tồn kho/0,80 rồi /0,81', expected: '80,0% → có lý do Sức chứa; 79,x% → không',
    run: async p => { await go(p, 'u-tuan', 'points');
      const r = await p.evaluate(() => { const s = App.state, pt = s.points.find(x => x.id === 'P01'); const kg = Domain.pickupProposals(s, s.today).find(x => x.point === 'P01').kg;
        pt.capacity_kg = kg / 0.80; const a = Domain.pickupProposals(s, s.today).find(x => x.point === 'P01').reasons.includes('Sức chứa');
        pt.capacity_kg = kg / 0.79; const b = Domain.pickupProposals(s, s.today).find(x => x.point === 'P01').reasons.includes('Sức chứa'); return { kg, a, b }; });
      assert(r.kg > 0 && r.a === true && r.b === false, JSON.stringify(r)); } },
  { id: 'TC-020', title: 'Pin Nguy hiểm lưu quá 72 giờ → đề xuất gom', refs: 'AC-18; BR-08', tech: 'BVA',
    steps: 'Đặt pin Nguy hiểm tại P02 tiếp nhận 73 giờ trước và 71 giờ trước', expected: '73 giờ → có lý do; 71 giờ → không',
    run: async p => { await go(p, 'u-tuan', 'points');
      const r = await p.evaluate(() => { const s = App.state; s.batteries.filter(b => b.loc === 'P02' && b.status === 'Đã thu hồi').forEach(b => { b.hazard = false; b.intake_date = s.today; });
        const b = s.batteries.find(x => x.loc === 'P02' && x.status === 'Đã thu hồi'); b.hazard = true; const t = Date.parse(s.today);
        b.intake_date = new Date(t - 73 * 3600000).toISOString(); const a = Domain.pickupProposals(s, s.today).find(x => x.point === 'P02').reasons.some(x => x.includes('nguy hiểm'));
        b.intake_date = new Date(t - 71 * 3600000).toISOString(); const c = Domain.pickupProposals(s, s.today).find(x => x.point === 'P02').reasons.some(x => x.includes('nguy hiểm')); return { a, c }; });
      assert(r.a && !r.c, JSON.stringify(r)); } },
  { id: 'TC-021', title: 'Pin lưu quá 30 ngày → đề xuất gom', refs: 'AC-19; BR-08', tech: 'BVA',
    steps: 'Pin tại P03 tiếp nhận 31 ngày và 29 ngày trước', expected: '31 ngày → có lý do; 29 ngày → không',
    run: async p => { await go(p, 'u-tuan', 'points');
      const r = await p.evaluate(() => { const s = App.state, t = Date.parse(s.today); const here = s.batteries.filter(b => b.loc === 'P03' && b.status === 'Đã thu hồi'); here.forEach(b => { b.intake_date = s.today; b.hazard = false; });
        here[0].intake_date = new Date(t - 31 * 86400000).toISOString(); const a = Domain.pickupProposals(s, s.today).find(x => x.point === 'P03').reasons.some(x => x.includes('30 ngày'));
        here[0].intake_date = new Date(t - 29 * 86400000).toISOString(); const c = Domain.pickupProposals(s, s.today).find(x => x.point === 'P03').reasons.some(x => x.includes('30 ngày')); return { a, c, n: here.length }; });
      assert(r.n > 0 && r.a && !r.c, JSON.stringify(r)); } },
  { id: 'TC-022', title: 'Lập lô gom từ điểm về trung tâm và xác nhận cân', refs: 'AC-20; BR-16; FR-09', tech: 'UC',
    steps: 'Kho vận Lập lô gom tại P01; nhập khối lượng cân bằng khối lượng gửi; Xác nhận', expected: 'Lô GL-2026-NNNN; pin chuyển vị trí TT; lô Đã xác nhận cân',
    run: async p => { await go(p, 'u-tuan', 'points'); await p.click('[data-testid=pick-P01]');
      const s = await st(p); const x = s.batches[s.batches.length - 1]; assert(/^GL-2026-\d{4}$/.test(x.id) && x.items.every(u => s.batteries.find(b => b.uid === u).loc === 'TT'), x.id);
      await p.locator(`tr[data-batch="${x.id}"] [data-testid=w-input]`).fill(String(x.sent_kg)); await p.locator(`tr[data-batch="${x.id}"] [data-testid=w-save]`).click();
      assert((await st(p)).batches.find(b => b.id === x.id).status === 'Đã xác nhận cân', 'chua can'); } },
  { id: 'TC-023', title: 'Cổng công khai: điểm theo tỉnh, không có dữ liệu cá nhân', refs: 'AC-24; BR-28; NFR-05', tech: 'EP',
    steps: 'Mở cổng công khai; chọn Hà Nội', expected: 'Chỉ điểm Hoạt động tại Hà Nội; có giờ mở cửa; không có tên/số điện thoại người trả pin',
    run: async p => { await go(p, 'u-lan', 'public'); await p.selectOption('[data-testid=pub-prov]', 'Hà Nội');
      const n = await p.locator('[data-testid=pub-point]').count(); const html = await p.locator('main').innerHTML();
      assert(n === 2 && html.includes('Giờ mở cửa') && !/Anh |Chị |\b0\d{9}\b/.test(await p.locator('[data-testid=pub-list]').innerText()), String(n));
      assert(!(await p.locator('[data-testid=pub-prov] option').allInnerTexts()).includes('Đà Nẵng'), 'P04 chua kich hoat van hien'); } },
  // ---------- EP-03 SoH ----------
  { id: 'TC-024', title: 'SoH đủ dữ liệu, khoảng hẹp, không chứa ngưỡng → hợp lệ', refs: 'AC-25; BR-10', tech: 'DT',
    steps: 'Kỹ thuật viên mở Đánh giá SoH; xem pin FX-SOH-OK (82%, [79;85])', expected: 'Hợp lệ — Mô hình; xác nhận được',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await fx(p, 'FX-SOH-OK'); const row = p.locator(`tr[data-uid="${uid}"]`);
      assert((await row.locator('[data-testid=soh-status]').innerText()).includes('Hợp lệ'), 'khong hop le'); await row.locator('[data-testid=soh-confirm]').click();
      const b = (await st(p)).batteries.find(x => x.uid === uid); assert(b.status === 'Đã đánh giá' && b.soh.source === 'Mô hình', b.status); } },
  { id: 'TC-025', title: 'Thiếu trường BMS → Chờ đo tay', refs: 'AC-26; BR-10', tech: 'DT',
    steps: 'Xem pin FX-SOH-MISS', expected: 'Chờ đo tay — Thiếu dữ liệu BMS',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await fx(p, 'FX-SOH-MISS');
      assert((await text(p, `tr[data-uid="${uid}"] [data-testid=soh-reason]`)) === 'Thiếu dữ liệu BMS', 'ly do'); } },
  { id: 'TC-026', title: 'Khoảng tin cậy chứa ngưỡng 70% → Chờ đo tay', refs: 'AC-27; BR-10', tech: 'DT',
    steps: 'Xem pin FX-SOH-EDGE (71%, [67;75])', expected: 'Chờ đo tay — Khoảng tin cậy chứa ngưỡng',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await fx(p, 'FX-SOH-EDGE');
      assert((await text(p, `tr[data-uid="${uid}"] [data-testid=soh-reason]`)) === 'Khoảng tin cậy chứa ngưỡng', 'ly do'); } },
  { id: 'TC-027', title: 'Khoảng tin cậy rộng 12 điểm → Chờ đo tay', refs: 'AC-28; BR-10', tech: 'DT',
    steps: 'Xem pin FX-SOH-WIDE (78%, [72;84])', expected: 'Chờ đo tay — Độ không chắc chắn cao',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await fx(p, 'FX-SOH-WIDE');
      assert((await text(p, `tr[data-uid="${uid}"] [data-testid=soh-reason]`)) === 'Độ không chắc chắn cao', 'ly do'); } },
  { id: 'TC-028', title: 'Biên độ rộng khoảng tin cậy: 10,0 hợp lệ; 10,1 chờ đo tay', refs: 'BR-10', tech: 'BVA',
    steps: 'Gọi quy tắc với khoảng [80;90] và [80;90,1]', expected: '[80;90] → valid; [80;90,1] → manual',
    run: async p => { await go(p, 'u-quan', 'soh'); const r = await p.evaluate(() => { const bms = { remaining_capacity_ah: 1, resistance_increase_pct: 1, full_cycles: 1, deep_discharge_events: 1, hours_extreme_temp: 1 };
      return [Domain.sohEvaluate({ bms, model_est: 85, ci_low: 80, ci_high: 90 }, App.state.params).status, Domain.sohEvaluate({ bms, model_est: 85, ci_low: 80, ci_high: 90.1 }, App.state.params).status]; });
      assert(r[0] === 'valid' && r[1] === 'manual', r.join()); } },
  { id: 'TC-029', title: 'Nhập SoH đo tay → hồ sơ hợp lệ nguồn Đo tay', refs: 'AC-29; BR-10; BR-11', tech: 'ST',
    steps: 'Nhập 76 cho pin FX-SOH-MISS; Lưu đo tay', expected: 'Pin Đã đánh giá; nguồn Đo tay; rời hàng chờ',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await fx(p, 'FX-SOH-MISS'); const row = p.locator(`tr[data-uid="${uid}"]`);
      await row.locator('[data-testid=soh-manual-input]').fill('76'); await row.locator('[data-testid=soh-manual-save]').click();
      const b = (await st(p)).batteries.find(x => x.uid === uid); assert(b.status === 'Đã đánh giá' && b.soh.source === 'Đo tay' && b.soh.manual === 76 && await p.locator(`tr[data-uid="${uid}"]`).count() === 0, b.status); } },
  { id: 'TC-030', title: 'Ghi đè SoH không có lý do bị chặn', refs: 'AC-30; BR-14', tech: 'EP',
    steps: 'Xác nhận FX-SOH-OK; ghi đè 68 không lý do', expected: 'Báo bắt buộc lý do; SoH không đổi',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK');
      await p.fill('[data-testid=ovr-uid]', uid); await p.fill('[data-testid=ovr-value]', '68'); await p.click('[data-testid=ovr-save]');
      assert(await p.locator('[data-testid=ovr-need-reason]').count() === 1 && (await st(p)).batteries.find(x => x.uid === uid).soh.override == null, 'luu'); } },
  { id: 'TC-031', title: 'Ghi đè SoH có lý do: lưu và ghi nhật ký', refs: 'AC-31; AC-64; BR-14', tech: 'UC',
    steps: 'Ghi đè FX-SOH-OK thành 68 với lý do "Đo lại dung lượng"; mở Nhật ký bằng Cán bộ tuân thủ', expected: 'Nhật ký: người, thời điểm, 82 → 68, lý do; không có nút sửa/xóa',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK');
      await p.fill('[data-testid=ovr-uid]', uid); await p.fill('[data-testid=ovr-value]', '68'); await p.fill('[data-testid=ovr-reason]', 'Đo lại dung lượng'); await p.click('[data-testid=ovr-save]');
      const a = (await st(p)).audit.find(x => x.obj === uid && x.field === 'SoH' && x.new === 68);
      assert(a && a.old === 82 && a.reason === 'Đo lại dung lượng' && a.user === 'Anh Quân' && a.at, JSON.stringify(a));
      await asUser(p, 'u-lan', 'audit'); const t = await text(p, '[data-testid=audit-table]');
      assert(t.includes('Đo lại dung lượng') && await p.locator('[data-testid=audit-table] button').count() === 0, 'nhat ky'); } },
  // ---------- EP-04 Dieu phoi ----------
  { id: 'TC-032', title: 'SoH 82% ≥ 70% → đề xuất Đời thứ hai', refs: 'AC-32; BR-12', tech: 'DT',
    steps: 'Xác nhận FX-SOH-OK; mở Điều phối', expected: 'Đề xuất Đời thứ hai; nút Đời thứ hai bật',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK'); await nav(p, 'routing'); const row = p.locator(`tr[data-uid="${uid}"]`);
      assert((await row.locator('[data-testid=route-proposal]').innerText()).includes('Đời thứ hai') && !(await row.locator('[data-testid=route-sl]').isDisabled()), 'de xuat'); } },
  { id: 'TC-033', title: 'SoH 65% < 70% → đề xuất Tái chế', refs: 'AC-33; BR-12', tech: 'DT',
    steps: 'Xác nhận FX-SOH-LOW; mở Điều phối', expected: 'Đề xuất Tái chế; Đời thứ hai bị vô hiệu',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-LOW'); await nav(p, 'routing'); const row = p.locator(`tr[data-uid="${uid}"]`);
      assert((await row.locator('[data-testid=route-proposal]').innerText()).includes('Tái chế') && await row.locator('[data-testid=route-sl]').isDisabled(), 'de xuat'); } },
  { id: 'TC-034', title: 'Biên ngưỡng: SoH 70,0% → Đời thứ hai; 69,9% → Tái chế', refs: 'BR-12', tech: 'BVA',
    steps: 'Gọi quy tắc điều phối với SoH 70,0 và 69,9', expected: '70,0 → Đời thứ hai; 69,9 → Tái chế',
    run: async p => { await go(p, 'u-quan', 'routing'); const r = await p.evaluate(() => { const b = { model: 'LF48', hazard: false, soh: { valid: true, source: 'Đo tay', manual: 70 } };
      const a = Domain.routeProposal(b, App.state).proposal; b.soh.manual = 69.9; return [a, Domain.routeProposal(b, App.state).proposal]; });
      assert(r[0] === 'Đời thứ hai' && r[1] === 'Tái chế', r.join()); } },
  { id: 'TC-035', title: 'Ắc quy chì luôn Tái chế, không chọn được Đời thứ hai', refs: 'AC-34; BR-12; BR-29', tech: 'DT',
    steps: 'Gom một lô từ điểm có ắc quy chì về TT; mở Điều phối với pin chì', expected: 'Đề xuất Tái chế; nút Đời thứ hai vô hiệu',
    run: async p => { await go(p, 'u-tuan', 'points');
      const uid = await p.evaluate(() => { const s = App.state; const b = s.batteries.find(x => x.model === 'PB48' && x.status === 'Đã thu hồi'); b.loc = 'TT'; return b.uid; });
      await asUser(p, 'u-quan', 'routing'); const row = p.locator(`tr[data-uid="${uid}"]`);
      assert((await row.locator('[data-testid=route-proposal]').innerText()).includes('Tái chế') && await row.locator('[data-testid=route-sl]').isDisabled(), 'chi'); } },
  { id: 'TC-036', title: 'Chưa có SoH hợp lệ → không chọn được Đời thứ hai', refs: 'AC-36; BR-11', tech: 'EP',
    steps: 'Gọi quy tắc với pin Li chưa có SoH; thử gọi hành động Đời thứ hai', expected: 'Không có đề xuất; slAllowed = false; lý do cần hồ sơ SoH',
    run: async p => { await go(p, 'u-quan', 'routing'); const r = await p.evaluate(async () => { const uid = App.state.fixtures['FX-SOH-EDGE']; const b = App.state.batteries.find(x => x.uid === uid); return Domain.routeProposal(b, App.state); });
      assert(r.proposal === null && r.slAllowed === false && r.reason.includes('BR-11'), JSON.stringify(r)); } },
  { id: 'TC-037', title: 'Người đề xuất không tự phê duyệt Đời thứ hai', refs: 'AC-37; BR-13', tech: 'EP',
    steps: 'Trưởng dịch vụ Minh xác nhận SoH, đề xuất Đời thứ hai, rồi tự phê duyệt', expected: 'Báo người duyệt phải khác người đề xuất; trạng thái không đổi',
    run: async p => { await go(p, 'u-minh', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK', 'u-minh'); await nav(p, 'routing');
      await p.locator(`tr[data-uid="${uid}"] [data-testid=route-sl]`).click(); await p.locator(`[data-testid=approve-table] tr[data-uid="${uid}"] [data-testid=approve]`).click();
      assert(await p.locator('[data-testid=approve-same]').count() === 1 && (await st(p)).batteries.find(x => x.uid === uid).status === 'Đã đánh giá', 'tu duyet'); } },
  { id: 'TC-038', title: 'Người khác phê duyệt → Đời thứ hai', refs: 'AC-38; BR-13; BR-24', tech: 'ST',
    steps: 'Quân đề xuất Đời thứ hai; Minh phê duyệt', expected: 'Pin trạng thái Đời thứ hai; nhật ký approve',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK'); await nav(p, 'routing'); await p.locator(`tr[data-uid="${uid}"] [data-testid=route-sl]`).click();
      await asUser(p, 'u-minh', 'routing'); await p.locator(`[data-testid=approve-table] tr[data-uid="${uid}"] [data-testid=approve]`).click();
      const b = (await st(p)).batteries.find(x => x.uid === uid); assert(b.status === 'Đời thứ hai' && b.route.approved_by === 'u-minh', b.status); } },
  { id: 'TC-039', title: 'Bàn giao Đời thứ hai thiếu số hợp đồng bị chặn', refs: 'AC-39; BR-25', tech: 'EP',
    steps: 'Đưa FX-SOH-OK đến Đời thứ hai (đã duyệt); Kho vận bấm Bàn giao không nhập số hợp đồng', expected: 'Báo cần số hợp đồng/hóa đơn',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK'); await nav(p, 'routing'); await p.locator(`tr[data-uid="${uid}"] [data-testid=route-sl]`).click();
      await asUser(p, 'u-minh', 'routing'); await p.locator(`[data-testid=approve-table] tr[data-uid="${uid}"] [data-testid=approve]`).click();
      await asUser(p, 'u-tuan', 'routing'); await p.locator(`[data-testid=handover-table] tr[data-uid="${uid}"] [data-testid=handover]`).click();
      assert(await p.locator('[data-testid=need-contract]').count() === 1 && (await st(p)).batteries.find(x => x.uid === uid).status === 'Đời thứ hai', 'ban giao'); } },
  { id: 'TC-040', title: 'Bàn giao Đời thứ hai tạo hồ sơ mới repurposed liên kết hồ sơ gốc', refs: 'AC-40; BR-25; BR-24', tech: 'UC',
    steps: 'Như TC-039 nhưng nhập HĐ-SL-202610-02', expected: 'Gốc Đã bàn giao; hồ sơ mới repurposed, parent = gốc, chủ thể S01; liên kết hiển thị',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK'); await nav(p, 'routing'); await p.locator(`tr[data-uid="${uid}"] [data-testid=route-sl]`).click();
      await asUser(p, 'u-minh', 'routing'); await p.locator(`[data-testid=approve-table] tr[data-uid="${uid}"] [data-testid=approve]`).click();
      await asUser(p, 'u-tuan', 'routing'); await p.locator(`[data-testid=handover-table] tr[data-uid="${uid}"] [data-testid=contract-input]`).fill('HĐ-SL-202610-02');
      await p.locator(`[data-testid=handover-table] tr[data-uid="${uid}"] [data-testid=handover]`).click();
      const s = await st(p), b = s.batteries.find(x => x.uid === uid), c = s.batteries.find(x => x.uid === b.child_uid);
      assert(b.status === 'Đã bàn giao' && c && c.passport === 'repurposed' && c.parent_uid === uid && c.producer === 'S01' && await p.locator('[data-testid=child-link]').count() === 1, 'child'); } },
  // ---------- EP-05 Doi tac, lo ----------
  { id: 'TC-041', title: 'Giấy phép hết hạn → chặn lập lô', refs: 'AC-41; BR-15', tech: 'DT',
    steps: 'Kho vận chọn R03 (hết hạn 30/09/2026) và một pin Chờ tái chế; Lập lô', expected: 'Chặn; báo giấy phép hết hạn',
    run: async p => { await go(p, 'u-tuan', 'batches'); await p.selectOption('[data-testid=b-partner]', 'R03'); await p.locator('[data-testid=b-item]').first().check(); await p.click('[data-testid=b-create]');
      assert((await text(p, '[data-testid=b-blocked]')).includes('hết hạn'), 'khong chan'); } },
  { id: 'TC-042', title: 'Giấy phép không có nhóm B.2.1 → chặn lô có pin Li', refs: 'AC-42; BR-15', tech: 'DT',
    steps: 'Tạo pin Li Chờ tái chế tại TT; chọn R02 (chỉ B.1.1); Lập lô', expected: 'Chặn; báo nhóm B.2.1 không có trong giấy phép',
    run: async p => { await go(p, 'u-tuan', 'batches');
      const uid = await p.evaluate(() => { const b = App.state.batteries.find(x => x.model === 'LF48' && x.status === 'Đang lưu hành' && x.tenant === 'VELIX'); b.status = 'Chờ tái chế'; b.loc = 'TT'; App.render(); return b.uid; });
      await p.selectOption('[data-testid=b-partner]', 'R02'); await p.locator(`[data-testid=b-item][value="${uid}"]`).check(); await p.click('[data-testid=b-create]');
      assert((await text(p, '[data-testid=b-blocked]')).includes('B.2.1'), 'khong chan'); } },
  { id: 'TC-043', title: 'Giấy phép hết hạn trong ≤60 ngày → nhãn Sắp hết hạn', refs: 'AC-43; BR-15', tech: 'BVA',
    steps: 'Mở Đối tác: R01 hết hạn 04/12/2026 (45 ngày); kiểm thêm 60 và 61 ngày', expected: 'R01 Sắp hết hạn; 60 ngày → Sắp hết hạn; 61 ngày → Hợp lệ; R03 Hết hạn',
    run: async p => { await go(p, 'u-lan', 'partners'); assert((await text(p, '[data-testid=lic-R01]')) === 'Sắp hết hạn' && (await text(p, '[data-testid=lic-R03]')) === 'Hết hạn', 'nhan');
      const r = await p.evaluate(() => [Domain.licenseState({ type: 'Đơn vị tái chế', license_to: '2026-12-19' }, '2026-10-20'), Domain.licenseState({ type: 'Đơn vị tái chế', license_to: '2026-12-20' }, '2026-10-20')]);
      assert(r[0] === 'Sắp hết hạn' && r[1] === 'Hợp lệ', r.join()); } },
  { id: 'TC-044', title: 'Lập lô hợp lệ cho R01: số chứng từ, danh sách, khối lượng', refs: 'AC-20; BR-16', tech: 'UC',
    steps: 'Chọn R01 và 2 pin Chờ tái chế; Lập lô', expected: 'Số CT-2026-NNNN tăng liên tục; tổng gửi = tổng khối lượng pin; pin Đã bàn giao',
    run: async p => { await go(p, 'u-tuan', 'batches'); const before = (await st(p)).batches.filter(b => b.id.startsWith('CT-2026')).length;
      await p.selectOption('[data-testid=b-partner]', 'R01'); const boxes = p.locator('[data-testid=b-item]'); await boxes.nth(0).check(); await boxes.nth(1).check(); await p.click('[data-testid=b-create]');
      const id = await text(p, '[data-testid=b-id]'); const s = await st(p), x = s.batches.find(b => b.id === id);
      const sum = await p.evaluate(id => { const s = App.state, x = s.batches.find(b => b.id === id); return x.items.reduce((a, u) => a + Domain.massOf(s.batteries.find(b => b.uid === u), s.models), 0); }, id);
      assert(id === `CT-2026-${String(before + 1).padStart(4, '0')}` && Math.abs(sum - x.sent_kg) < 0.05 && x.items.every(u => s.batteries.find(b => b.uid === u).status === 'Đã bàn giao'), id); } },
  { id: 'TC-045', title: 'Chênh lệch ≤2%: xác nhận không cần lý do', refs: 'AC-21; BR-16', tech: 'BVA',
    steps: 'Lập lô R01; Chị Mai nhập cân = gửi × 1,0083', expected: 'Xác nhận thành công; không yêu cầu lý do',
    run: async p => { await go(p, 'u-tuan', 'batches'); await p.selectOption('[data-testid=b-partner]', 'R01'); await p.locator('[data-testid=b-item]').nth(0).check(); await p.click('[data-testid=b-create]');
      const id = await text(p, '[data-testid=b-id]'); const sent = (await st(p)).batches.find(b => b.id === id).sent_kg;
      await asUser(p, 'u-mai', 'batches'); const row = p.locator(`tr[data-batch="${id}"]`); await row.locator('[data-testid=w-input]').fill((sent * 1.0083).toFixed(2)); await row.locator('[data-testid=w-save]').click();
      assert(await p.locator('[data-testid=w-ok]').count() === 1 && (await st(p)).batches.find(b => b.id === id).status === 'Đã xác nhận cân', 'xac nhan'); } },
  { id: 'TC-046', title: 'Biên chênh lệch: 2,00% không cần lý do; 2,01% cần lý do', refs: 'BR-16', tech: 'BVA',
    steps: 'Gọi quy tắc với gửi 100 kg, nhận 102,00 và 102,01', expected: '2,00% → needReason false; 2,01% → true',
    run: async p => { await go(p, 'u-mai', 'batches'); const r = await p.evaluate(() => [Domain.varianceCheck(100, 102, 2).needReason, Domain.varianceCheck(100, 102.01, 2).needReason]);
      assert(r[0] === false && r[1] === true, r.join()); } },
  { id: 'TC-047', title: 'Chênh lệch >2% không lý do bị chặn; có lý do thì thông báo Tuân thủ', refs: 'AC-22; AC-23; BR-16', tech: 'DT',
    steps: 'Lập lô R01; nhập cân = gửi × 0,9667 không lý do; rồi kèm lý do "Rò rỉ dung dịch"', expected: 'Lần 1: yêu cầu lý do; lần 2: xác nhận và có thông báo cho Tuân thủ trên Tổng quan',
    run: async p => { await go(p, 'u-tuan', 'batches'); await p.selectOption('[data-testid=b-partner]', 'R01'); await p.locator('[data-testid=b-item]').nth(0).check(); await p.click('[data-testid=b-create]');
      const id = await text(p, '[data-testid=b-id]'); const sent = (await st(p)).batches.find(b => b.id === id).sent_kg;
      await asUser(p, 'u-mai', 'batches'); let row = p.locator(`tr[data-batch="${id}"]`); await row.locator('[data-testid=w-input]').fill((sent * 0.9667).toFixed(2)); await row.locator('[data-testid=w-save]').click();
      assert(await p.locator('[data-testid=w-need-reason]').count() === 1, 'khong yeu cau ly do');
      row = p.locator(`tr[data-batch="${id}"]`); await row.locator('[data-testid=w-input]').fill((sent * 0.9667).toFixed(2)); await row.locator('[data-testid=w-reason]').fill('Rò rỉ dung dịch'); await row.locator('[data-testid=w-save]').click();
      await asUser(p, 'u-lan', 'dashboard'); assert((await p.locator('[data-testid=notice]').allInnerTexts()).some(t => t.includes(id) && t.includes('Rò rỉ dung dịch')), 'thong bao'); } },
  { id: 'TC-048', title: 'Xác nhận đã tái chế: pin Đã tái chế, hồ sơ đóng, cộng kết quả', refs: 'AC-44; AC-45; BR-17; BR-26', tech: 'ST',
    steps: 'Lập lô R01 1 pin chì; Mai cân đúng; xác nhận đã tái chế; mở hồ sơ pin và báo cáo EPR', expected: 'Pin Đã tái chế; nhãn Hồ sơ đã đóng, không nút sửa; kết quả B.1.1 tăng',
    run: async p => { await go(p, 'u-tuan', 'batches');
      const uid = await p.evaluate(() => App.state.batteries.find(b => b.status === 'Chờ tái chế' && b.loc === 'TT' && b.model === 'PB48').uid);
      const r0 = await p.evaluate(() => Domain.recycledResult(App.state, 2026, 'B.1.1'));
      await p.selectOption('[data-testid=b-partner]', 'R01'); await p.locator(`[data-testid=b-item][value="${uid}"]`).check(); await p.click('[data-testid=b-create]'); const id = await text(p, '[data-testid=b-id]');
      await asUser(p, 'u-mai', 'batches'); await p.locator(`tr[data-batch="${id}"] [data-testid=w-input]`).fill('28'); await p.locator(`tr[data-batch="${id}"] [data-testid=w-save]`).click();
      await p.locator(`tr[data-batch="${id}"] [data-testid=recycled]`).click();
      const r1 = await p.evaluate(() => Domain.recycledResult(App.state, 2026, 'B.1.1'));
      await asUser(p, 'u-lan', 'battery/' + uid);
      assert((await st(p)).batteries.find(b => b.uid === uid).status === 'Đã tái chế' && await p.locator('[data-testid=closed]').count() === 1 && await p.locator('[data-testid=flag-btn]').count() === 0 && Math.abs(r1 - r0 - 28) < 0.05, `${r0} ${r1}`); } },
  // ---------- EP-06 EPR ----------
  { id: 'TC-049', title: 'Đổi Fs áp dụng ngay cho F và ghi nhật ký', refs: 'AC-46; BR-19; BR-14; NFR-08', tech: 'UC',
    steps: 'Chọn Đóng góp tài chính cho B.1.1; đổi Fs 2026 B.1.1 thành 20000; mở Báo cáo EPR', expected: 'F = R × V × 20000; nhật ký có Fs 18278 → 20000',
    run: async p => { await go(p, 'u-lan', 'epr'); await p.selectOption('[data-testid="e-form-B.1.1"]', 'Đóng góp tài chính'); await p.click('[data-testid=e-save]');
      await nav(p, 'params'); await p.fill('[data-testid="reg-Fs-2026-B.1.1"]', '20000'); await p.click('[data-testid=p-save]');
      const r = await p.evaluate(() => Domain.eprReport(App.state, 2026).find(x => x.group === 'B.1.1'));
      assert(r.F === Math.round(0.12 * r.V * 20000) && (await st(p)).audit.some(a => a.field === 'Fs' && a.old === 18278 && a.new === 20000), JSON.stringify(r)); } },
  { id: 'TC-050', title: 'Năm 2025 theo NĐ 08, không dùng tham số NĐ 110', refs: 'AC-47; BR-22', tech: 'EP',
    steps: 'Mở Báo cáo EPR năm 2025', expected: 'Căn cứ NĐ 08/2022; cảnh báo chưa nạp tham số; không có R, F',
    run: async p => { await go(p, 'u-lan', 'epr/2025'); assert((await text(p, '[data-testid=e-basis]')).includes('08/2022') && await p.locator('[data-testid=e-old]').count() === 1 && await p.locator('[data-testid="e-F-B.1.1"]').count() === 0, 'nd08'); } },
  { id: 'TC-051', title: 'Đổi ngưỡng gom lô 80% → 70% có hiệu lực ngay', refs: 'AC-48; BR-08; FR-33', tech: 'BVA',
    steps: 'Đặt sức chứa P01 sao cho tồn kho 75%; đổi PAR-03 = 70', expected: 'Trước: không đề xuất Sức chứa; sau: có',
    run: async p => { await go(p, 'u-admin', 'params');
      await p.evaluate(() => { const s = App.state, pt = s.points.find(x => x.id === 'P01'); const kg = Domain.pickupProposals(s, s.today).find(x => x.point === 'P01').kg; pt.capacity_kg = kg / 0.75; App.save(); });
      const a = await p.evaluate(() => Domain.pickupProposals(App.state, App.state.today).find(x => x.point === 'P01').reasons.includes('Sức chứa'));
      await p.fill('[data-testid=par-PAR-03]', '70'); await p.click('[data-testid=p-save]');
      const b = await p.evaluate(() => Domain.pickupProposals(App.state, App.state.today).find(x => x.point === 'P01').reasons.includes('Sức chứa'));
      assert(a === false && b === true, `${a} ${b}`); } },
  { id: 'TC-052', title: 'Mỗi nhóm một hình thức mỗi năm', refs: 'AC-49; BR-20', tech: 'EP',
    steps: 'Kiểm quy tắc với hình thức rỗng / hai hình thức; giao diện chỉ cho chọn một giá trị', expected: 'Hình thức không hợp lệ bị từ chối; ô chọn là danh sách đơn',
    run: async p => { await go(p, 'u-lan', 'epr'); const r = await p.evaluate(() => [Domain.validateChoice({ form: '' }), Domain.validateChoice({ form: 'Tổ chức tái chế + Đóng góp tài chính' })]);
      const multiple = await p.locator('[data-testid="e-form-B.1.1"]').getAttribute('multiple');
      assert(r.every(x => x.includes('một hình thức')) && multiple === null, r.join()); } },
  { id: 'TC-053', title: 'Tổ chức tái chế bắt buộc chọn cách thức', refs: 'AC-50; BR-20', tech: 'EP',
    steps: 'B.1.1 = Tổ chức tái chế, cách thức trống; Lưu', expected: 'Không lưu; báo chọn cách thức',
    run: async p => { await go(p, 'u-lan', 'epr'); await p.selectOption('[data-testid="e-method-B.1.1"]', ''); await p.click('[data-testid=e-save]');
      assert((await text(p, '[data-testid=e-err]')).includes('cách thức'), 'luu'); } },
  { id: 'TC-054', title: 'Khối lượng phải tái chế = 12% × V', refs: 'AC-51; BR-04; BR-19', tech: 'UC',
    steps: 'Mở Báo cáo EPR 2026; so ô Phải tái chế B.1.1 với 12% × V tính độc lập', expected: 'Bằng nhau (làm tròn 0,1 kg)',
    run: async p => { await go(p, 'u-lan', 'epr');
      const v = await p.evaluate(() => { const s = App.state; return s.batteries.filter(b => b.tenant === 'VELIX' && !b.producer && (b.placed_date || '').startsWith('2026') && b.model === 'PB48' && !b.flags.some(f => Domain.EXCL.includes(f)) && b.status !== 'Đã hủy đăng ký').length * 28; });
      const r = await p.evaluate(() => Domain.eprReport(App.state, 2026).find(x => x.group === 'B.1.1'));
      assert(Math.abs(r.V - v) < 0.05 && Math.abs(r.required - Math.round(0.12 * v * 10) / 10) < 0.05, JSON.stringify({ v, r })); } },
  { id: 'TC-055', title: 'F = R × V × Fs khi đóng quỹ', refs: 'AC-52; BR-19', tech: 'UC',
    steps: 'Chọn Đóng góp tài chính cho B.1.1; đọc ô F', expected: 'F = round(0,12 × V × 18.278)',
    run: async p => { await go(p, 'u-lan', 'epr'); await p.selectOption('[data-testid="e-form-B.1.1"]', 'Đóng góp tài chính'); await p.click('[data-testid=e-save]');
      const r = await p.evaluate(() => Domain.eprReport(App.state, 2026).find(x => x.group === 'B.1.1'));
      const shown = (await text(p, '[data-testid="e-F-B.1.1"]')).replace(/\D/g, ''); assert(r.F === Math.round(0.12 * r.V * 18278) && +shown === r.F && r.F > 0, JSON.stringify(r)); } },
  { id: 'TC-056', title: 'Kết quả vượt R × V → bảo lưu', refs: 'AC-53; BR-18; BR-17', tech: 'DT',
    steps: 'Đặt R B.1.1 = 0,01; Tổ chức tái chế; đọc bảo lưu', expected: 'Bảo lưu = kết quả − R × V > 0',
    run: async p => { await go(p, 'u-lan', 'params'); await p.fill('[data-testid="reg-R-2026-B.1.1"]', '0.01'); await p.click('[data-testid=p-save]');
      const r = await p.evaluate(() => Domain.eprReport(App.state, 2026).find(x => x.group === 'B.1.1'));
      assert(r.result > r.required && Math.abs(r.carry - Math.round((r.result - r.required) * 10) / 10) < 0.11, JSON.stringify(r)); } },
  { id: 'TC-057', title: 'Pin Li R = 0%: phải tái chế 0, F = 0, vẫn hiện V', refs: 'AC-54; BR-19', tech: 'EP',
    steps: 'Chọn Đóng góp tài chính cho B.2.1; mở báo cáo', expected: 'Phải tái chế 0; F 0 đ; V > 0',
    run: async p => { await go(p, 'u-lan', 'epr'); await p.selectOption('[data-testid="e-form-B.2.1"]', 'Đóng góp tài chính'); await p.click('[data-testid=e-save]');
      const r = await p.evaluate(() => Domain.eprReport(App.state, 2026).find(x => x.group === 'B.2.1')); assert(r.required === 0 && r.F === 0 && r.V > 0, JSON.stringify(r)); } },
  { id: 'TC-058', title: 'Hạn nộp và mốc nhắc', refs: 'AC-55; BR-21', tech: 'BVA',
    steps: 'Mở Tổng quan ngày 20/10/2026; kiểm thêm ngày còn 30, 7, 1, 2 ngày', expected: 'Hạn 01/04/2027 và 20/04/2027; nhắc khi còn 30, 7, 1; không nhắc khi còn 2',
    run: async p => { await go(p, 'u-lan', 'dashboard'); const t = await text(p, '[data-testid=deadlines]'); assert(t.includes('01/04/2027') && t.includes('20/04/2027'), t);
      const r = await p.evaluate(() => ['2027-03-02', '2027-03-25', '2027-03-31', '2027-03-30'].map(d => Domain.deadlines(2026, d)[0].remind)); assert(r.join() === 'true,true,true,false', r.join()); } },
  { id: 'TC-059', title: 'Xuất CSV đủ cột', refs: 'AC-56; FR-24', tech: 'UC',
    steps: 'Bấm Xuất CSV báo cáo 2026', expected: 'Tệp có cột năm, nhóm, hình thức, cách thức, V, R, phải tái chế, kết quả, bảo lưu, Fs, F, căn cứ; 2 dòng dữ liệu',
    run: async p => { await go(p, 'u-lan', 'epr'); const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-testid=e-csv]')]);
      const csv = await p.evaluate(() => window.__lastCsv); const lines = csv.split('\n');
      assert(dl.suggestedFilename() === 'epr-2026-velix.csv' && lines[0] === 'nam,nhom,hinh_thuc,cach_thuc,V_kg,R,phai_tai_che_kg,ket_qua_kg,bao_luu_kg,Fs_d_kg,F_d,can_cu' && lines.length === 3, lines[0]); } },
  { id: 'TC-060', title: 'Tỷ lệ thu gom LMT theo công thức EU', refs: 'AC-57; BR-23', tech: 'UC',
    steps: 'Mở Tổng quan; tính độc lập khối lượng thu gom 2026 / bình quân đưa ra thị trường 2023–2025 (LMT)', expected: 'Giá trị hiển thị khớp; có dòng công thức',
    run: async p => { await go(p, 'u-lan', 'dashboard');
      const exp = await p.evaluate(() => { const s = App.state, lmt = b => b.model !== 'KHAC' && Domain.categoryEU(Domain.modelOf(b, s.models), 25) === 'LMT';
        const placed = [2023, 2024, 2025].map(y => s.batteries.filter(b => b.tenant === 'VELIX' && !b.producer && (b.placed_date || '').startsWith(y) && lmt(b)).reduce((a, b) => a + Domain.massOf(b, s.models), 0));
        const col = s.intakes.filter(i => i.date.startsWith('2026')).map(i => s.batteries.find(b => b.uid === i.uid)).filter(b => b && lmt(b)).reduce((a, b) => a + Domain.massOf(b, s.models), 0);
        return col / (placed.reduce((a, b) => a + b) / 3) * 100; });
      const shown = parseFloat((await text(p, '[data-testid=kpi-collection]')).replace(',', '.'));
      assert(Math.abs(shown - exp) < 0.051 && (await text(p, '[data-testid=kpi-collection-formula]')).includes('BR-23'), `${shown} ${exp}`); } },
  { id: 'TC-061', title: 'Thiếu một năm dữ liệu → Chưa đủ dữ liệu', refs: 'AC-58; BR-23', tech: 'EP',
    steps: 'Tính tỷ lệ năm 2024 (thiếu 2021 với nhóm pin xe điện hạng L) và năm 2023 với nhóm LMT', expected: 'Trả ok = false khi một trong ba năm bằng 0',
    run: async p => { await go(p, 'u-lan', 'dashboard'); const r = await p.evaluate(() => Domain.collectionRateEU(App.state, 2023, 'LMT').ok);
      assert(r === false, String(r)); } },
  // ---------- EP-07 Ho so pin ----------
  { id: 'TC-062', title: 'Hồ sơ pin hiển thị trường MVP và dòng thời gian theo thứ tự', refs: 'AC-59; BR-24; FR-27; FR-28', tech: 'UC',
    steps: 'Xác nhận SoH FX-SOH-OK; mở hồ sơ pin', expected: 'Có mã, model, hóa học, khối lượng, nhóm VN/EU, ngày, SoH 82%, passport waste; dòng thời gian theo ngày tăng dần',
    run: async p => { await go(p, 'u-quan', 'soh'); const uid = await evaluated(p, 'FX-SOH-OK'); await asUser(p, 'u-lan', 'battery/' + uid);
      const t = await text(p, '[data-testid=passport]');
      assert(['Mã định danh', 'Model', 'Khối lượng', 'Nhóm Phụ lục I', 'Nhóm EU', 'Ngày đưa ra thị trường', 'SoH'].every(k => t.includes(k)) && (await text(p, '[data-testid=p-soh]')).startsWith('82') && (await text(p, '[data-testid=p-passport]')) === 'waste', t);
      const ev = (await st(p)).batteries.find(b => b.uid === uid).events.map(e => e.date); assert(ev.every((d, i) => i === 0 || d >= ev[i - 1]), ev.join()); } },
  { id: 'TC-063', title: 'Không chuyển thẳng Đang lưu hành → Đã tái chế', refs: 'AC-60; BR-24', tech: 'ST',
    steps: 'Quản trị mở pin Đang lưu hành; chọn Đã tái chế; Chuyển trạng thái', expected: 'Báo không cho phép; trạng thái không đổi',
    run: async p => { await go(p, 'u-admin', 'registry'); const uid = await p.evaluate(() => App.state.batteries.find(b => b.status === 'Đang lưu hành' && b.tenant === 'VELIX').uid);
      await nav(p, 'battery/' + uid); await p.selectOption('[data-testid=manual-status]', 'Đã tái chế'); await p.click('[data-testid=manual-status-btn]');
      assert((await text(p, '[data-testid=b-result]')).includes('BR-24') && (await st(p)).batteries.find(b => b.uid === uid).status === 'Đang lưu hành', 'chuyen'); } },
  { id: 'TC-064', title: 'Bảng chuyển trạng thái: mọi cặp không hợp lệ bị từ chối', refs: 'BR-24', tech: 'ST',
    steps: 'Duyệt 8 × 8 cặp trạng thái', expected: 'Chỉ đúng 8 chuyển hợp lệ theo vòng đời (gồm Hủy đăng ký) được chấp nhận; 56 cặp còn lại bị từ chối',
    run: async p => { await go(p, 'u-admin', 'registry'); const n = await p.evaluate(() => { const S = Object.keys(Domain.NEXT); let k = 0; S.forEach(a => S.forEach(b => { if (Domain.canTransition(a, b)) k++; })); return k; });
      assert(n === 8, String(n)); } },
  // ---------- EP-08 Quan tri ----------
  { id: 'TC-065', title: 'Đại lý chỉ thấy phiếu của điểm mình', refs: 'AC-61; BR-27', tech: 'EP',
    steps: 'Anh Hùng (P01) mở Tiếp nhận', expected: 'Mọi phiếu trong bảng thuộc P01',
    run: async p => { await go(p, 'u-hung', 'intake'); const cells = await p.locator('[data-testid=intake-table] tr td:nth-child(2)').allInnerTexts(); assert(cells.length > 0 && cells.every(c => c === 'P01'), cells.join()); } },
  { id: 'TC-066', title: 'Đơn vị tái chế chỉ thấy lô giao cho mình', refs: 'AC-62; BR-27', tech: 'EP',
    steps: 'Kho vận lập lô cho R01; Chị Mai (R01) mở Lô', expected: 'Mọi lô hiển thị có đơn vị nhận R01; không thấy lô GL',
    run: async p => { await go(p, 'u-mai', 'batches'); const s = await st(p); const ids = await p.locator('[data-testid=batch-table] tr[data-batch]').evaluateAll(r => r.map(x => x.dataset.batch));
      assert(ids.length > 0 && ids.every(id => s.batches.find(b => b.id === id).partner === 'R01'), ids.join()); } },
  { id: 'TC-067', title: 'Đại lý không truy cập Báo cáo EPR', refs: 'AC-63; BR-27', tech: 'EP',
    steps: 'Anh Hùng mở menu; truy cập trực tiếp #/epr', expected: 'Menu không có Báo cáo EPR; trang báo không có quyền',
    run: async p => { await go(p, 'u-hung', 'epr'); assert(await p.locator('[data-testid=nav-epr]').count() === 0 && await p.locator('[data-testid=forbidden]').count() === 1, 'truy cap'); } },
  { id: 'TC-068', title: 'Dữ liệu tenant khác không hiển thị', refs: 'BR-27; NFR-10', tech: 'EP',
    steps: 'Cán bộ tuân thủ VELIX tìm "DM2" trong sổ đăng ký; tính V', expected: '0 kết quả; pin tenant DEMO2 không vào V',
    run: async p => { await go(p, 'u-lan', 'registry'); await p.fill('[data-testid=reg-q]', 'DM2'); assert(parseInt(await text(p, '[data-testid=reg-count]')) === 0, 'thay tenant khac');
      const inV = await p.evaluate(() => App.state.batteries.filter(b => b.tenant === 'DEMO2').length > 0 && Domain.computeV({ ...App.state, batteries: App.state.batteries.filter(b => b.tenant === 'DEMO2') }, 2026, 'B.2.1') === 0);
      assert(inV, 'V'); } },
  { id: 'TC-069', title: 'Nhật ký chỉ đọc, đủ trường', refs: 'AC-64; BR-14; NFR-06', tech: 'NFR',
    steps: 'Đổi một tham số; mở Nhật ký', expected: 'Có thời điểm, người, đối tượng, trường, cũ, mới; không nút sửa/xóa',
    run: async p => { await go(p, 'u-lan', 'params'); await p.fill('[data-testid=par-PAR-05]', '25'); await p.click('[data-testid=p-save]'); await nav(p, 'audit');
      const head = await text(p, '[data-testid=audit-table] tr'); const row = await p.locator('[data-testid=audit-table] tr').nth(1).innerText();
      assert(['Thời điểm', 'Người', 'Đối tượng', 'Trường', 'Cũ', 'Mới'].every(k => head.toLowerCase().includes(k.toLowerCase())) && row.includes('PAR-05') && await p.locator('main button').count() === 0, row); } },
  // ---------- Phi chuc nang ----------
  { id: 'TC-070', title: 'Màn tiếp nhận dùng được ở bề rộng 360 px', refs: 'NFR-09; NFR-01', tech: 'NFR',
    steps: 'Đặt viewport 360 × 740; mở Tiếp nhận; kiểm không cuộn ngang và nút Lưu nhìn thấy được', expected: 'scrollWidth ≤ 360; nút Lưu phiếu hiển thị',
    run: async p => { await p.setViewportSize({ width: 360, height: 740 }); await go(p, 'u-hung', 'intake');
      const w = await p.evaluate(() => document.documentElement.scrollWidth); const vis = await p.locator('[data-testid=i-save]').isVisible();
      await p.setViewportSize({ width: 1280, height: 800 }); assert(w <= 360 && vis, String(w)); } },
  { id: 'TC-071', title: 'Luồng tiếp nhận hoàn tất trong ít thao tác', refs: 'NFR-01; US-06', tech: 'NFR',
    steps: 'Đếm số trường bắt buộc người dùng phải nhập để tiếp nhận một pin VELIX', expected: '≤ 2 trường bắt buộc (mã pin, khối lượng) + 1 lần bấm Lưu',
    run: async p => { await go(p, 'u-hung', 'intake');
      const uid = await p.evaluate(() => App.state.batteries.find(b => b.model === 'LF48' && b.status === 'Đang lưu hành' && b.tenant === 'VELIX').uid);
      await p.fill('[data-testid=i-uid]', uid); await p.locator('[data-testid=i-uid]').dispatchEvent('change'); await p.click('[data-testid=i-save]');
      assert(await p.locator('[data-testid=i-ok]').count() === 1, 'can nhap them'); } },
  { id: 'TC-072', title: 'Chỉ Cán bộ tuân thủ sửa được R, Fs', refs: 'BR-27; FR-20; S14 §5', tech: 'EP',
    steps: 'Quản trị mở Tham số; thử sửa Fs 2026 B.1.1', expected: 'Ô R, Fs bị khóa với Quản trị; tham số vận hành vẫn sửa được',
    run: async p => { await go(p, 'u-admin', 'params'); assert(await p.locator('[data-testid="reg-Fs-2026-B.1.1"]').isDisabled() && !(await p.locator('[data-testid=par-PAR-05]').isDisabled()), 'quyen'); } },
  { id: 'TC-073', title: 'Ô hóa học chỉ hiện khi chọn Pin hãng khác', refs: 'AC-13; FR-06', tech: 'EP',
    steps: 'Mở Tiếp nhận; kiểm ô Hóa học; tick Pin hãng khác; kiểm lại', expected: 'Ẩn khi chưa tick; hiện khi tick',
    run: async p => { await go(p, 'u-hung', 'intake'); const a = await p.locator('[data-testid=i-ochem]').isVisible(); await p.check('[data-testid=i-other]'); const b = await p.locator('[data-testid=i-ochem]').isVisible(); assert(!a && b, `${a} ${b}`); } },
];
