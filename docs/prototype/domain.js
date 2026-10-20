// Lop quy tac nghiep vu (thuan, khong dung DOM). Moi ham ghi ma BR tuong ung.
(function () {
  const STATUS = {
    CIRC: 'Đang lưu hành', COLL: 'Đã thu hồi', EVAL: 'Đã đánh giá', SL: 'Đời thứ hai',
    WAIT: 'Chờ tái chế', HAND: 'Đã bàn giao', RCY: 'Đã tái chế', CANCEL: 'Đã hủy đăng ký'
  };
  // BR-24: vong doi hop le
  const NEXT = {
    'Đang lưu hành': ['Đã thu hồi', 'Đã hủy đăng ký'],
    'Đã thu hồi': ['Đã đánh giá'],
    'Đã đánh giá': ['Đời thứ hai', 'Chờ tái chế'],
    'Đời thứ hai': ['Đã bàn giao'],
    'Chờ tái chế': ['Đã bàn giao'],
    'Đã bàn giao': ['Đã tái chế'],
    'Đã tái chế': [], 'Đã hủy đăng ký': []
  };
  const canTransition = (from, to) => (NEXT[from] || []).includes(to);
  const passportStatus = b => b.passport || ({ 'Đang lưu hành': 'original', 'Đã hủy đăng ký': 'original' }[b.status] || 'waste');

  const EXCL = ['Xuất khẩu', 'Thử nghiệm', 'NCC đã thực hiện EPR'];
  const SAFETY = ['Phồng', 'Rò rỉ', 'Nứt vỏ', 'Đã va chạm', 'Nóng bất thường'];
  const BMS_FIELDS = ['remaining_capacity_ah', 'resistance_increase_pct', 'full_cycles', 'deep_discharge_events', 'hours_extreme_temp'];

  // BR-03: nhom Phu luc I va nhom EU
  function categoryVN(m) {
    if (!m || !m.chemistry) return null;
    if (m.chemistry === 'Chì') return 'B.1.1';
    if (['LFP', 'NMC', 'Li khác', 'NiMH'].includes(m.chemistry) && m.use === 'Phương tiện giao thông') return 'B.2.1';
    return 'B.2.1-khác';
  }
  const VN_LABEL = { 'B.1.1': 'B.1.1 Ắc quy chì', 'B.2.1': 'B.2.1 Pin Li/NiMH phương tiện giao thông', 'B.2.1-khác': 'B.2.1 Pin sạc khác' };
  function categoryEU(m, lmtKg) {
    if (!m || !(m.mass_kg > 0)) return null;
    return m.mass_kg <= lmtKg ? 'LMT' : 'Pin xe điện (hạng L >25 kg)';
  }
  function validateModel(m) {
    const e = {};
    if (!m.code || !/^[A-Z0-9]{2,8}$/.test(m.code)) e.code = 'Mã model 2–8 ký tự in hoa hoặc số';
    if (!m.name) e.name = 'Bắt buộc';
    if (!m.chemistry) e.chemistry = 'Bắt buộc';
    if (!(m.mass_kg > 0)) e.mass_kg = 'Khối lượng phải lớn hơn 0';
    if (!(m.energy_kwh > 0)) e.energy_kwh = 'Năng lượng phải lớn hơn 0';
    if (!m.labeler) e.labeler = 'Bắt buộc (chủ thể EPR, BR-05)';
    return e;
  }

  // BR-02: Luhn tren day so (2 so nam + 7 so thu tu)
  function luhn(d) {
    let s = 0;
    [...d].reverse().forEach((c, i) => { let n = +c; if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; } s += n; });
    return (10 - s % 10) % 10;
  }
  function makeUid(prefix, model, isoDate, seq) {
    const yy = isoDate.slice(2, 4), ss = String(seq).padStart(7, '0');
    return `${prefix}-${model}-${yy}-${ss}-${luhn(yy + ss)}`;
  }
  function checkUid(uid) {
    const m = /^([A-Z]+)-([A-Z0-9]+)-(\d{2})-(\d{7})-(\d)$/.exec(uid || '');
    return !!m && luhn(m[3] + m[4]) === +m[5];
  }

  const massOf = (b, models) => b.model === 'KHAC' ? (b.other_mass_kg || 0) : (models.find(m => m.code === b.model) || {}).mass_kg || 0;
  const modelOf = (b, models) => models.find(m => m.code === b.model);
  const groupOf = (b, models) => b.model === 'KHAC' ? (b.other_chem === 'Chì' ? 'B.1.1' : 'B.2.1') : categoryVN(modelOf(b, models));

  // BR-04: V theo nam va nhom
  function computeV(st, year, group) {
    return st.batteries.filter(b => b.tenant === 'VELIX' && !b.producer && b.placed_date && b.placed_date.startsWith(String(year))
      && b.status !== 'Đã hủy đăng ký' && !b.flags.some(f => EXCL.includes(f)) && groupOf(b, st.models) === group)
      .reduce((s, b) => s + massOf(b, st.models), 0);
  }
  // BR-17: ket qua tai che = khoi luong can thuc te cua pin trong lo da xac nhan tai che, theo nhom va nam
  function recycledResult(st, year, group) {
    let kg = 0;
    st.batches.filter(x => x.kind === 'Bàn giao đối tác' && x.status === 'Đã tái chế' && (x.recycled_date || '').startsWith(String(year)))
      .forEach(x => {
        const items = x.items.map(u => st.batteries.find(b => b.uid === u)).filter(Boolean);
        const sent = items.reduce((s, b) => s + massOf(b, st.models), 0) || 1;
        items.filter(b => groupOf(b, st.models) === group).forEach(b => { kg += massOf(b, st.models) * (x.received_kg / sent); });
      });
    return kg;
  }
  // BR-18/19/20/22: bao cao EPR
  function eprReport(st, year) {
    const groups = ['B.1.1', 'B.2.1'];
    const basis = year <= 2025 ? 'NĐ 08/2022/NĐ-CP (BR-22)' : 'NĐ 110/2026/NĐ-CP';
    return groups.map(g => {
      const reg = st.regulation.find(r => r.year === year && r.group === g);
      const ch = st.epr_choice.find(c => c.year === year && c.group === g) || { form: '', method: '' };
      const V = computeV(st, year, g);
      if (!reg) return { group: g, year, basis, missing: true, V, form: ch.form, method: ch.method };
      const required = round1(reg.R * V);
      const result = ch.form === 'Tổ chức tái chế' ? round1(recycledResult(st, year, g)) : 0;
      const carry = ch.form === 'Tổ chức tái chế' ? round1(Math.max(0, result - required)) : 0;
      const F = ch.form === 'Đóng góp tài chính' ? Math.round(reg.R * V * reg.Fs) : 0;
      return { group: g, year, basis: reg.basis, V: round1(V), R: reg.R, Fs: reg.Fs, required, result, carry, F, form: ch.form, method: ch.method };
    });
  }
  const round1 = x => Math.round(x * 10) / 10;
  function validateChoice(c) {
    if (!['Tổ chức tái chế', 'Đóng góp tài chính'].includes(c.form)) return 'Chọn đúng một hình thức';
    if (c.form === 'Tổ chức tái chế' && !['Tự thực hiện', 'Hợp đồng đơn vị tái chế', 'Ủy quyền PRO', 'Kết hợp'].includes(c.method)) return 'Chọn cách thức thực hiện';
    return '';
  }

  // BR-23: ty le thu gom kieu EU theo nhom EU
  function collectionRateEU(st, year, euGroup) {
    const lmt = st.params['PAR-02'].value;
    const inGroup = b => b.model === 'KHAC' ? (b.other_mass_kg <= lmt) === (euGroup === 'LMT') : categoryEU(modelOf(b, st.models), lmt) === euGroup;
    const placed = [1, 2, 3].map(k => st.batteries.filter(b => b.tenant === 'VELIX' && !b.producer && b.placed_date && b.placed_date.startsWith(String(year - k)) && inGroup(b))
      .reduce((s, b) => s + massOf(b, st.models), 0));
    const collected = st.intakes.filter(i => i.date.startsWith(String(year))).map(i => st.batteries.find(b => b.uid === i.uid))
      .filter(b => b && b.tenant === 'VELIX' && inGroup(b)).reduce((s, b) => s + massOf(b, st.models), 0);
    if (placed.some(p => p <= 0)) return { ok: false, collected, placed };
    const avg = placed.reduce((a, b) => a + b, 0) / 3;
    return { ok: true, rate: collected / avg, collected, avg, placed };
  }

  // BR-10: danh gia SoH
  function sohEvaluate(soh, p) {
    if (!soh) return { status: 'manual', reason: 'Chưa có dữ liệu BMS' };
    if (soh.manual != null) return { status: 'valid', source: 'Đo tay', value: soh.manual };
    if (BMS_FIELDS.some(f => soh.bms[f] == null || soh.bms[f] === '')) return { status: 'manual', reason: 'Thiếu dữ liệu BMS' };
    const width = soh.ci_high - soh.ci_low, thr = p['PAR-07'].value;
    if (width > p['PAR-06'].value) return { status: 'manual', reason: 'Độ không chắc chắn cao' };
    if (soh.ci_low <= thr && thr <= soh.ci_high) return { status: 'manual', reason: 'Khoảng tin cậy chứa ngưỡng' };
    return { status: 'valid', source: 'Mô hình', value: soh.model_est };
  }
  // BR-11/12/29/07: de xuat dieu phoi
  function routeProposal(b, st) {
    const g = groupOf(b, st.models), thr = st.params['PAR-07'].value;
    if (g === 'B.1.1') return { proposal: 'Tái chế', slAllowed: false, reason: 'Ắc quy chì không có đời thứ hai (BR-29)' };
    if (b.hazard) return { proposal: 'Tái chế', slAllowed: false, reason: 'Pin gắn cờ Nguy hiểm (BR-07)' };
    if (!b.soh || !b.soh.valid) return { proposal: null, slAllowed: false, reason: 'Cần hồ sơ SoH hợp lệ (BR-11)' };
    const v = b.soh.override != null ? b.soh.override : (b.soh.source === 'Đo tay' ? b.soh.manual : b.soh.model_est);
    return v >= thr ? { proposal: 'Đời thứ hai', slAllowed: true, reason: `SoH ${v}% ≥ ${thr}%` }
      : { proposal: 'Tái chế', slAllowed: false, reason: `SoH ${v}% < ${thr}%` };
  }

  // BR-08: de xuat gom lo
  function pickupProposals(st, today) {
    const p = st.params, t = Date.parse(today);
    return st.points.filter(x => x.active).map(pt => {
      const here = st.batteries.filter(b => b.loc === pt.id && b.status === 'Đã thu hồi');
      const kg = here.reduce((s, b) => s + (st.intakes.find(i => i.uid === b.uid) || {}).weight_kg || 0, 0);
      const reasons = [];
      if (kg >= pt.capacity_kg * p['PAR-03'].value / 100 - 1e-9) reasons.push('Sức chứa'); // dung sai so thuc
      const age = b => (t - Date.parse(b.intake_date)) / 3600000;
      if (here.some(b => b.hazard && age(b) > p['PAR-04'].value)) reasons.push(`Pin nguy hiểm >${p['PAR-04'].value} giờ`);
      if (here.some(b => age(b) > p['PAR-05'].value * 24)) reasons.push(`Lưu quá ${p['PAR-05'].value} ngày`);
      return { point: pt.id, kg: round1(kg), pct: round1(kg / pt.capacity_kg * 100), count: here.length, reasons };
    });
  }
  // BR-15: giay phep doi tac
  function licenseCheck(partner, groups, isoDate) {
    if (!partner) return { ok: false, reason: 'Chưa chọn đơn vị nhận' };
    if (partner.type === 'Đơn vị tái chế') {
      if (!partner.license_to || partner.license_to < isoDate) return { ok: false, reason: `Giấy phép ${partner.license_no} hết hạn ${fmtDate(partner.license_to)}` };
      const miss = [...new Set(groups)].filter(g => !partner.groups.includes(g));
      if (miss.length) return { ok: false, reason: `Nhóm ${miss.join(', ')} không có trong giấy phép ${partner.license_no}` };
    }
    return { ok: true };
  }
  function licenseState(partner, isoDate, days = 60) {
    if (partner.type !== 'Đơn vị tái chế') return 'Không áp dụng';
    if (partner.license_to < isoDate) return 'Hết hạn';
    return (Date.parse(partner.license_to) - Date.parse(isoDate)) / 86400000 <= days ? 'Sắp hết hạn' : 'Hợp lệ';
  }
  // BR-16: chenh lech khoi luong
  function varianceCheck(sent, received, maxPct) {
    const pct = sent > 0 ? Math.abs(received - sent) / sent * 100 : 0;
    return { pct: Math.round(pct * 100) / 100, needReason: pct > maxPct };
  }
  // BR-21: han nop
  function deadlines(year, today) {
    const list = [{ label: `Nộp kế hoạch/báo cáo hoặc kê khai năm ${year}`, date: `${year + 1}-04-01` },
                  { label: `Nộp tiền đóng góp năm ${year} (nếu có)`, date: `${year + 1}-04-20` }];
    return list.map(d => {
      const left = Math.round((Date.parse(d.date) - Date.parse(today)) / 86400000);
      return { ...d, daysLeft: left, remind: [30, 7, 1].includes(left) };
    });
  }
  const fmtDate = iso => iso ? iso.split('-').reverse().join('/') : '—';

  window.Domain = { STATUS, NEXT, canTransition, passportStatus, EXCL, SAFETY, BMS_FIELDS, categoryVN, VN_LABEL, categoryEU, validateModel,
    luhn, makeUid, checkUid, massOf, modelOf, groupOf, computeV, recycledResult, eprReport, validateChoice, collectionRateEU,
    sohEvaluate, routeProposal, pickupProposals, licenseCheck, licenseState, varianceCheck, deadlines, fmtDate, round1 };
})();
