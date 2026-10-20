// Prototype Battery 2030 - giao dien va trang thai. Quy tac nghiep vu nam o domain.js.
(function () {
  const D = window.Domain;
  const KEY = 'b2030-state-v1';
  const clone = o => JSON.parse(JSON.stringify(o));
  let S = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) { /* bo qua */ }
    return fresh();
  }
  function fresh() {
    const s = clone(window.SEED);
    s.user = 'u-lan'; s.offline = false; s.outbox = []; s.devSeq = 0; s.notices = [];
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bo qua */ } }
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = (x, d = 1) => (x == null || isNaN(x)) ? '—' : Number(x).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const money = x => Number(x).toLocaleString('vi-VN') + ' đ';
  const $ = s => document.querySelector(s);
  const me = () => S.users.find(u => u.id === S.user);
  const now = () => S.today + 'T' + new Date().toTimeString().slice(0, 8);
  function toast(m) { const d = document.createElement('div'); d.textContent = m; $('#toast').appendChild(d); setTimeout(() => d.remove(), 3500); }
  function audit(obj, field, oldV, newV, reason) {
    S.audit.push({ at: now(), user: me().name, role: me().role, obj, field, old: oldV, new: newV, reason: reason || '' });
  }
  function event(b, type, note) { b.events.push({ date: S.today, type, note }); }
  function setStatus(b, to, note) {
    if (!D.canTransition(b.status, to)) throw new Error(`Không cho phép chuyển ${b.status} → ${to} (BR-24)`);
    audit(b.uid, 'status', b.status, to, note); b.status = to;
  }
  const mine = () => S.batteries.filter(b => b.tenant === 'VELIX'); // BR-27: tenant cua nguoi dung demo
  const model = code => S.models.find(m => m.code === code);
  const pointName = id => (S.points.find(p => p.id === id) || S.partners.find(p => p.id === id) || { name: id === 'TT' ? 'Trung tâm kiểm định' : id }).name;
  const ROLE = { CMP: 'Cán bộ tuân thủ', DLR: 'Đại lý', TEC: 'Kỹ thuật viên', TEC_LEAD: 'Trưởng dịch vụ', LOG: 'Kho vận', RCY: 'Đơn vị tái chế', MGT: 'Ban điều hành', ADM: 'Quản trị' };
  const MENU = [
    ['dashboard', 'Tổng quan', ['CMP', 'MGT', 'ADM']],
    ['registry', 'Sổ đăng ký pin', ['CMP', 'TEC', 'TEC_LEAD', 'LOG', 'MGT', 'ADM']],
    ['models', 'Model pin & ERP', ['CMP', 'ADM']],
    ['intake', 'Tiếp nhận pin', ['DLR', 'ADM']],
    ['points', 'Điểm thu hồi', ['LOG', 'CMP', 'ADM', 'DLR']],
    ['soh', 'Đánh giá SoH', ['TEC', 'TEC_LEAD']],
    ['routing', 'Điều phối', ['TEC', 'TEC_LEAD', 'LOG']],
    ['batches', 'Lô & chứng từ', ['LOG', 'CMP', 'RCY', 'ADM']],
    ['partners', 'Đối tác & giấy phép', ['CMP', 'LOG', 'ADM']],
    ['epr', 'Báo cáo EPR', ['CMP', 'MGT']],
    ['params', 'Tham số', ['CMP', 'ADM']],
    ['audit', 'Nhật ký kiểm toán', ['CMP', 'ADM']],
    ['public', 'Cổng tra cứu công khai', null],
  ];
  const can = r => { const m = MENU.find(x => x[0] === r); return !m || !m[2] || m[2].includes(me().role); };
  const badge = s => {
    const c = { 'Đang lưu hành': 'b-info', 'Đã thu hồi': 'b-warn', 'Đã đánh giá': 'b-warn', 'Đời thứ hai': 'b-ok', 'Chờ tái chế': 'b-warn', 'Đã bàn giao': 'b-ok', 'Đã tái chế': 'b-ok', 'Đã hủy đăng ký': 'b-bad', 'Hợp lệ': 'b-ok', 'Sắp hết hạn': 'b-warn', 'Hết hạn': 'b-bad' }[s] || '';
    return `<span class="badge ${c}">${esc(s)}</span>`;
  };

  // ---------- Khung ----------
  function shell() {
    $('#today').textContent = D.fmtDate(S.today);
    $('#user').innerHTML = S.users.map(u => `<option value="${u.id}" ${u.id === S.user ? 'selected' : ''}>${esc(u.name)} — ${ROLE[u.role]}${u.scope !== '*' ? ' (' + u.scope + ')' : ''}</option>`).join('');
    $('#offline').checked = !!S.offline;
    const r = route()[0];
    $('#nav').innerHTML = MENU.filter(m => !m[2] || m[2].includes(me().role))
      .map(m => `<a href="#/${m[0]}" data-testid="nav-${m[0]}" class="${r === m[0] ? 'on' : ''}">${m[1]}</a>`).join('');
  }
  const route = () => (location.hash.replace(/^#\//, '') || '').split('/');
  function render() {
    shell();
    const [r, arg] = route();
    const first = MENU.find(m => !m[2] || m[2].includes(me().role));
    if (!r) { location.hash = '#/' + first[0]; return; }
    const view = VIEWS[r];
    if (!view) { $('#main').innerHTML = '<div class="empty">Không tìm thấy trang</div>'; return; }
    if (!can(r)) { $('#main').innerHTML = `<div class="alert a-bad" data-testid="forbidden">Vai trò ${ROLE[me().role]} không có quyền truy cập chức năng này (BR-27).</div>`; return; }
    $('#main').innerHTML = view(arg);
    (BIND[r] || (() => {}))(arg);
  }
  window.addEventListener('hashchange', render);
  $('#user').addEventListener('change', e => { S.user = e.target.value; save(); location.hash = ''; render(); });
  $('#offline').addEventListener('change', e => { S.offline = e.target.checked; save(); render(); });
  $('#reset').addEventListener('click', () => { S = fresh(); save(); location.hash = ''; render(); toast('Đã đặt lại dữ liệu mẫu'); });

  document.addEventListener('submit', e => e.preventDefault(), true); // moi form xu ly bang JS, khong gui trang
  const VIEWS = {}, BIND = {};

  // ---------- Tong quan (FR-26, BR-21, BR-23) ----------
  VIEWS.dashboard = () => {
    const year = +S.today.slice(0, 4), b = mine();
    const lmt = D.collectionRateEU(S, year, 'LMT');
    const dl = D.deadlines(year, S.today);
    const routed = b.filter(x => x.route && x.route.final);
    const sl = routed.filter(x => x.route.final === 'Đời thứ hai').length, rc = routed.length - sl;
    const pk = D.pickupProposals(S, S.today).filter(p => p.reasons.length);
    const lic = S.partners.filter(p => ['Sắp hết hạn', 'Hết hạn'].includes(D.licenseState(p, S.today)));
    return `<h1>Tổng quan</h1><p class="sub">Năm trách nhiệm ${year} · NĐ 110/2026/NĐ-CP</p>
    <div class="grid">
      <div class="card kpi"><div class="l">Pin đã đăng ký (lũy kế)</div><div class="v" data-testid="kpi-registered">${num(b.filter(x => !x.producer && x.placed_date).length, 0)}</div><div class="f">mẫu 1:100</div></div>
      <div class="card kpi"><div class="l">Pin thu hồi năm ${year}</div><div class="v">${num(S.intakes.filter(i => i.date.startsWith(year)).length, 0)}</div><div class="f">từ ngày thí điểm ${D.fmtDate(S.go_live)}</div></div>
      <div class="card kpi"><div class="l">Tỷ lệ thu gom pin LMT ${year} (chuẩn EU)</div><div class="v" data-testid="kpi-collection">${lmt.ok ? num(lmt.rate * 100, 1) + '%' : 'Chưa đủ dữ liệu'}</div>
        <div class="f" data-testid="kpi-collection-formula">${lmt.ok ? `${num(lmt.collected)} kg ÷ bình quân(${lmt.placed.slice().reverse().map(x => num(x, 0)).join('; ')}) kg của ${year - 3}–${year - 1}` : 'Thiếu khối lượng đưa ra thị trường của ít nhất một năm trong 3 năm trước'} · BR-23</div></div>
      <div class="card kpi"><div class="l">Kết quả điều phối (lũy kế)</div><div class="v">${sl} / ${rc}</div><div class="f">Đời thứ hai / Tái chế</div></div>
    </div>
    <h2>Hạn nộp (BR-21)</h2><div class="tw"><table data-testid="deadlines"><tr><th>Việc</th><th>Hạn</th><th class="n">Còn (ngày)</th><th>Nhắc</th></tr>
      ${dl.map(d => `<tr><td>${esc(d.label)}</td><td>${D.fmtDate(d.date)}</td><td class="n">${d.daysLeft}</td><td>${d.remind ? '<span class="badge b-warn">Nhắc hôm nay</span>' : 'Mốc nhắc: 30, 7, 1 ngày'}</td></tr>`).join('')}</table></div>
    <h2>Việc cần xử lý</h2>
    ${pk.map(p => `<div class="alert a-warn">Đề xuất gom lô tại ${esc(pointName(p.point))}: ${esc(p.reasons.join('; '))}</div>`).join('') || '<div class="alert a-ok">Không có đề xuất gom lô</div>'}
    ${lic.map(p => `<div class="alert a-bad">Giấy phép ${esc(p.name)}: ${D.licenseState(p, S.today)} (${D.fmtDate(p.license_to)})</div>`).join('')}
    ${S.notices.map(n => `<div class="alert a-info" data-testid="notice">${esc(n)}</div>`).join('')}`;
  };

  // ---------- So dang ky (FR-04) ----------
  VIEWS.registry = () => {
    const years = [...new Set(mine().map(b => (b.placed_date || '').slice(0, 4)).filter(Boolean))].sort();
    const statuses = Object.keys(D.NEXT);
    return `<h1>Sổ đăng ký pin</h1><p class="sub">Tra cứu theo mã, số khung, model, trạng thái, năm (FR-04)</p>
    <div class="card"><form id="flt" class="row" onsubmit="return false">
      <label class="f">Mã pin / số khung<input name="q" data-testid="reg-q"></label>
      <label class="f">Model<select name="model" data-testid="reg-model"><option value="">Tất cả</option>${S.models.map(m => `<option>${m.code}</option>`).join('')}<option value="KHAC">KHAC</option></select></label>
      <label class="f">Trạng thái<select name="status" data-testid="reg-status"><option value="">Tất cả</option>${statuses.map(s => `<option>${s}</option>`).join('')}</select></label>
      <label class="f">Năm đưa ra thị trường<select name="year" data-testid="reg-year"><option value="">Tất cả</option>${years.map(y => `<option>${y}</option>`).join('')}</select></label>
    </form></div><div id="reglist"></div>`;
  };
  BIND.registry = () => {
    const f = $('#flt');
    const draw = () => {
      const q = f.q.value.trim().toUpperCase(), mo = f.model.value, st = f.status.value, y = f.year.value;
      const rows = mine().filter(b => (!q || b.uid.includes(q) || (b.vin || '').includes(q)) && (!mo || b.model === mo) && (!st || b.status === st) && (!y || (b.placed_date || '').startsWith(y)));
      $('#reglist').innerHTML = `<p data-testid="reg-count">${rows.length} pin</p><div class="tw"><table data-testid="reg-table"><tr><th>Mã pin</th><th>Model</th><th>Nhóm VN</th><th>Ngày đưa ra thị trường</th><th>Loại</th><th>Trạng thái</th><th>Vị trí</th></tr>
        ${rows.slice(0, 50).map(b => `<tr><td><a class="link mono" href="#/battery/${b.uid}">${b.uid}</a></td><td>${b.model}</td><td>${D.groupOf(b, S.models)}</td><td>${D.fmtDate(b.placed_date)}</td><td>${esc(b.kind)}</td><td>${badge(b.status)}</td><td>${esc(b.loc ? pointName(b.loc) : '—')}</td></tr>`).join('')}</table></div>
        ${rows.length > 50 ? '<p class="muted">Hiển thị 50 dòng đầu</p>' : ''}`;
    };
    f.addEventListener('input', draw); f.addEventListener('change', draw); draw();
  };

  // ---------- Model pin & mo phong ERP (FR-01, FR-02, FR-03) ----------
  VIEWS.models = () => `<h1>Model pin & đơn bán từ ERP</h1><p class="sub">Đăng ký model, tự gán nhóm (BR-03); mô phỏng đơn bán để cấp mã (BR-01, BR-02)</p>
    <div class="tw"><table data-testid="model-table"><tr><th>Mã</th><th>Tên</th><th>Hóa học</th><th class="n">kWh</th><th class="n">kg</th><th>Nhóm VN</th><th>Nhóm EU</th><th>Nhà sản xuất</th><th>Bên ghi nhãn (chủ thể EPR)</th></tr>
    ${S.models.map(m => `<tr data-model="${m.code}"><td>${m.code}</td><td>${esc(m.name)}</td><td>${m.chemistry}</td><td class="n">${num(m.energy_kwh, 2)}</td><td class="n">${num(m.mass_kg)}</td>
      <td data-testid="vn-${m.code}">${D.VN_LABEL[D.categoryVN(m)]}</td><td data-testid="eu-${m.code}">${D.categoryEU(m, S.params['PAR-02'].value)}</td><td>${esc(m.manufacturer)}</td><td data-testid="labeler-${m.code}">${esc(m.labeler)}</td></tr>`).join('')}</table></div>
    <h2>Đăng ký model mới</h2><div class="card"><form id="mf" onsubmit="return false" novalidate><div class="row">
      <label class="f">Mã model<input name="code" data-testid="m-code"><span class="err" data-err="code"></span></label>
      <label class="f">Tên<input name="name" data-testid="m-name"><span class="err" data-err="name"></span></label>
      <label class="f">Hóa học<select name="chemistry" data-testid="m-chem"><option value="">—</option><option>LFP</option><option>NMC</option><option>Li khác</option><option>NiMH</option><option>Chì</option></select><span class="err" data-err="chemistry"></span></label>
      <label class="f">Mục đích<select name="use"><option>Phương tiện giao thông</option><option>Khác</option></select></label>
      <label class="f">Năng lượng (kWh)<input name="energy_kwh" type="number" step="0.01" data-testid="m-kwh"><span class="err" data-err="energy_kwh"></span></label>
      <label class="f">Khối lượng (kg)<input name="mass_kg" type="number" step="0.1" data-testid="m-kg"><span class="err" data-err="mass_kg"></span></label>
      <label class="f">Nhà sản xuất<input name="manufacturer" value="Nhà cung cấp pin A (hư cấu)" data-testid="m-mfr"></label>
      <label class="f">Bên ghi nhãn<input name="labeler" value="VELIX" data-testid="m-labeler"><span class="err" data-err="labeler"></span></label>
    </div><div class="actions"><button data-testid="m-save">Lưu model</button><span id="mres" data-testid="m-result"></span></div></form></div>
    <h2>Mô phỏng đơn bán từ ERP</h2><div class="card"><form id="erp" onsubmit="return false"><div class="row">
      <label class="f">Model<select name="model" data-testid="erp-model">${S.models.map(m => `<option>${m.code}</option>`).join('')}</select></label>
      <label class="f">Ngày bán<input name="date" type="date" value="${S.today}" data-testid="erp-date"></label>
      <label class="f">Số khung<input name="vin" value="VLXV900001" data-testid="erp-vin"></label>
      <label class="f">Loại<select name="kind"><option>Theo xe</option><option>Thay thế</option></select></label>
    </div><div class="actions"><button data-testid="erp-submit">Gửi đơn bán</button><span id="erpres" class="mono" data-testid="erp-result"></span></div></form></div>`;
  BIND.models = () => {
    $('#mf').addEventListener('submit', () => {
      const f = $('#mf'), m = Object.fromEntries(new FormData(f));
      m.code = (m.code || '').trim().toUpperCase(); m.mass_kg = parseFloat(m.mass_kg); m.energy_kwh = parseFloat(m.energy_kwh);
      const e = D.validateModel(m);
      if (S.models.some(x => x.code === m.code)) e.code = 'Mã đã tồn tại';
      f.querySelectorAll('[data-err]').forEach(x => x.textContent = e[x.dataset.err] || '');
      if (Object.keys(e).length) { $('#mres').textContent = 'Chưa lưu: kiểm tra các trường báo lỗi'; return; }
      Object.assign(m, { capacity_ah: 0, voltage_v: 0, warranty_months: 0, tenant: 'VELIX', dismantling_doc_url: '', safety_doc_url: '' });
      S.models.push(m); audit('model ' + m.code, 'tạo mới', '', `${D.categoryVN(m)} · ${D.categoryEU(m, S.params['PAR-02'].value)}`); save(); render();
      toast(`Đã lưu ${m.code}: ${D.VN_LABEL[D.categoryVN(m)]} · ${D.categoryEU(m, S.params['PAR-02'].value)}`);
    });
    $('#erp').addEventListener('submit', () => {
      const f = Object.fromEntries(new FormData($('#erp')));
      S.seq += 1;
      const uid = D.makeUid(S.params['PAR-01'].value, f.model, f.date, S.seq);
      if (S.batteries.some(b => b.uid === uid)) { $('#erpres').textContent = 'Lỗi: mã trùng'; return; }
      S.batteries.push({ uid, model: f.model, tenant: 'VELIX', placed_date: f.date, vin: f.vin, kind: f.kind, status: 'Đang lưu hành', flags: [], hazard: false, loc: '', soh: null, route: null,
        events: [{ date: f.date, type: 'Đăng ký', note: 'Đơn bán từ ERP' }] });
      audit(uid, 'tạo mới', '', 'Đang lưu hành'); save();
      $('#erpres').innerHTML = `Đã cấp mã <a class="link" href="#/battery/${uid}" data-testid="erp-uid">${uid}</a>`;
    });
  };

  // ---------- Ho so pin (FR-27, FR-28, FR-30, FR-03) ----------
  VIEWS.battery = uid => {
    const b = S.batteries.find(x => x.uid === uid && x.tenant === 'VELIX');
    if (!b) return '<div class="empty">Không tìm thấy pin</div>';
    const m = model(b.model) || { name: 'Pin hãng khác', chemistry: b.other_chem, mass_kg: b.other_mass_kg };
    const closed = b.status === 'Đã tái chế' || b.closed;
    const soh = b.soh && b.soh.valid ? (b.soh.override != null ? b.soh.override : (b.soh.source === 'Đo tay' ? b.soh.manual : b.soh.model_est)) : null;
    const editable = !closed && ['CMP', 'ADM'].includes(me().role);
    return `<h1 class="mono">${esc(b.uid)}</h1><p class="sub">${badge(b.status)} ${closed ? '<span class="badge b-bad" data-testid="closed">Hồ sơ đã đóng</span>' : ''} ${b.flags.map(f => `<span class="badge">${esc(f)}</span>`).join(' ')}</p>
    <div class="grid"><div class="card"><h2>Hồ sơ pin (passport — trường MVP)</h2><dl class="kv" data-testid="passport">
      <dt>Mã định danh</dt><dd class="mono">${esc(b.uid)} ${D.checkUid(b.uid) ? '<span class="badge b-ok">Luhn hợp lệ</span>' : ''}</dd>
      <dt>Model · hóa học</dt><dd>${esc(m.name)} · ${esc(m.chemistry)}</dd>
      <dt>Khối lượng</dt><dd>${num(m.mass_kg)} kg</dd>
      <dt>Nhóm Phụ lục I (VN)</dt><dd>${D.VN_LABEL[D.groupOf(b, S.models)] || '—'}</dd>
      <dt>Nhóm EU</dt><dd>${model(b.model) ? D.categoryEU(m, S.params['PAR-02'].value) : '—'}</dd>
      <dt>Ngày đưa ra thị trường</dt><dd>${D.fmtDate(b.placed_date)}</dd>
      <dt>Chủ thể EPR</dt><dd>${esc(b.producer ? pointName(b.producer) : (model(b.model) ? m.labeler : '—'))}</dd>
      <dt>SoH</dt><dd data-testid="p-soh">${soh != null ? num(soh) + '% (' + esc(b.soh.override != null ? 'Ghi đè' : b.soh.source) + ')' : '—'}</dd>
      <dt>Trạng thái passport</dt><dd data-testid="p-passport">${D.passportStatus(b)}</dd>
      ${b.parent_uid ? `<dt>Hồ sơ gốc</dt><dd><a class="link mono" href="#/battery/${b.parent_uid}">${b.parent_uid}</a></dd>` : ''}
      ${b.child_uid ? `<dt>Hồ sơ đời thứ hai</dt><dd><a class="link mono" data-testid="child-link" href="#/battery/${b.child_uid}">${b.child_uid}</a></dd>` : ''}
    </dl></div>
    <div class="card"><h2>Dòng thời gian</h2><ol class="tl" data-testid="timeline">${b.events.map(e => `<li><b>${esc(e.type)}</b> <small>${D.fmtDate(e.date)}</small><br>${esc(e.note)}</li>`).join('')}</ol></div></div>
    ${editable ? `<div class="card"><h2>Thao tác</h2><div class="actions">
      <select id="flag" data-testid="flag-select"><option value="">Gắn cờ…</option>${D.EXCL.map(f => `<option>${f}</option>`).join('')}</select><button class="ghost" id="flagbtn" data-testid="flag-btn">Gắn cờ</button>
      ${b.status === 'Đang lưu hành' ? '<button class="danger" id="cancel" data-testid="cancel-btn">Hủy đăng ký</button>' : ''}
      ${me().role === 'ADM' ? `<select id="mstat" data-testid="manual-status">${Object.keys(D.NEXT).map(s => `<option>${s}</option>`).join('')}</select><button class="ghost" id="mstatbtn" data-testid="manual-status-btn">Chuyển trạng thái</button>` : ''}
    </div><div id="bres" class="err" data-testid="b-result"></div></div>` : ''}`;
  };
  BIND.battery = uid => {
    const b = S.batteries.find(x => x.uid === uid);
    if (!b) return;
    const fb = $('#flagbtn');
    if (fb) fb.onclick = () => { const v = $('#flag').value; if (!v || b.flags.includes(v)) return; b.flags.push(v); audit(b.uid, 'cờ', '', v); event(b, 'Gắn cờ', v); save(); render(); };
    const cb = $('#cancel');
    if (cb) cb.onclick = () => { setStatus(b, 'Đã hủy đăng ký', 'Hủy đăng ký'); event(b, 'Hủy đăng ký', 'Mã giữ nguyên, không cấp lại (BR-01)'); save(); render(); };
    const ms = $('#mstatbtn');
    if (ms) ms.onclick = () => { try { const to = $('#mstat').value; setStatus(b, to, 'Chuyển thủ công'); save(); render(); } catch (e) { $('#bres').textContent = e.message; } };
  };

  // ---------- Tiep nhan (FR-06, FR-07; BR-06, BR-07, BR-09, BR-30) ----------
  VIEWS.intake = () => {
    const u = me(), pts = S.points.filter(p => u.scope === '*' || p.id === u.scope);
    const pt = pts[0];
    const list = S.intakes.filter(i => u.scope === '*' || i.point === u.scope).slice(-15).reverse();
    return `<h1>Tiếp nhận pin</h1><p class="sub">Nhận pin mọi hãng, không thu phí (BR-06). ${S.offline ? '<span class="badge b-warn" data-testid="offline-badge">Đang ngoại tuyến — phiếu lưu trên thiết bị</span>' : ''}</p>
    ${!pt.active ? `<div class="alert a-bad" data-testid="point-inactive">Điểm ${esc(pt.name)} chưa kích hoạt: thiếu hồ sơ chủ nguồn thải CTNH (BR-09). Không thể lập phiếu.</div>` : `
    <div class="card"><form id="itk" onsubmit="return false" novalidate>
      <div class="row"><label class="f">Điểm thu hồi<select name="point">${pts.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label>
      <label class="f">Mã pin (quét hoặc nhập)<input name="uid" data-testid="i-uid" autocomplete="off"></label>
      <label class="f checks" style="flex-direction:row;align-items:center"><input type="checkbox" name="other" data-testid="i-other"> Pin hãng khác (không có mã VELIX)</label></div>
      <div class="row" id="otherrow" hidden><label class="f">Hóa học<select name="ochem" data-testid="i-ochem"><option>Chì</option><option>LFP</option><option>NMC</option></select></label></div>
      <div class="row"><label class="f">Khối lượng cân (kg)<input name="kg" type="number" step="0.1" data-testid="i-kg"></label><label class="f">Phí người trả pin<input value="0 đ (miễn phí)" disabled></label></div>
      <fieldset class="card"><legend>Checklist an toàn (BR-07)</legend><div class="checks">${D.SAFETY.map(s => `<label><input type="checkbox" name="chk" value="${s}" data-testid="chk-${s}"> ${s}</label>`).join('')}</div></fieldset>
      <details><summary>Dữ liệu BMS (tùy chọn, Phụ lục VII)</summary><div class="row">${D.BMS_FIELDS.map(f => `<label class="f">${f}<input name="bms_${f}" type="number" data-testid="bms-${f}"></label>`).join('')}</div></details>
      <div class="actions"><button data-testid="i-save">Lưu phiếu</button>${S.outbox.length ? `<button type="button" class="ghost" id="sync" data-testid="i-sync" ${S.offline ? 'disabled' : ''}>Đồng bộ ${S.outbox.length} phiếu</button>` : ''}</div>
      <div id="ires" data-testid="i-result"></div></form></div>`}
    <h2>Phiếu gần đây</h2><div class="tw"><table data-testid="intake-table"><tr><th>Số phiếu</th><th>Điểm</th><th>Mã pin</th><th>Ngày</th><th class="n">kg</th><th>An toàn</th></tr>
      ${list.map(i => `<tr><td class="mono">${i.id}</td><td>${i.point}</td><td class="mono">${i.uid}</td><td>${D.fmtDate(i.date)}</td><td class="n">${num(i.weight_kg)}</td><td>${i.checklist.length ? '<span class="badge b-bad">Nguy hiểm</span>' : 'Bình thường'}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Chưa có phiếu</td></tr>'}</table></div>`;
  };
  function commitIntake(rec) {
    if (S.intakes.some(i => i.id === rec.id)) return null; // BR-30: khong tao trung
    const pt = S.points.find(p => p.id === rec.point);
    let b;
    if (rec.other) {
      S.seq += 1; b = { uid: `TMP-${rec.point}-${String(S.seq).padStart(5, '0')}`, model: 'KHAC', tenant: 'VELIX', placed_date: '', vin: '', kind: 'Hãng khác', status: 'Đã thu hồi', flags: ['Hãng khác'], hazard: false, loc: rec.point, soh: null, route: null, other_mass_kg: rec.kg, other_chem: rec.ochem, events: [] };
      S.batteries.push(b);
    } else {
      b = S.batteries.find(x => x.uid === rec.uid && x.tenant === 'VELIX');
      setStatus(b, 'Đã thu hồi', 'Tiếp nhận ' + rec.id); b.loc = rec.point;
    }
    b.intake_date = rec.date; b.hazard = rec.checklist.length > 0;
    const isLi = D.groupOf(b, S.models) === 'B.2.1';
    if (isLi) b.soh = { bms: rec.bms, model_est: null, ci_low: null, ci_high: null, manual: null, source: null, valid: false, date: rec.date };
    if (isLi && Object.values(rec.bms).every(v => v != null)) { // uoc luong mo phong tu dung luong con lai (thay cho API mo hinh S17)
      const cap = (model(b.model) || {}).capacity_ah || 1, est = D.round1(rec.bms.remaining_capacity_ah / cap * 100);
      Object.assign(b.soh, { model_est: est, ci_low: D.round1(est - 3), ci_high: D.round1(est + 3) });
    }
    event(b, 'Tiếp nhận', `${pt.name}${b.hazard ? ' — cờ Nguy hiểm: ' + rec.checklist.join(', ') : ''} · phiếu ${rec.id}`);
    S.intakes.push({ id: rec.id, point: rec.point, uid: b.uid, date: rec.date, checklist: rec.checklist, weight_kg: rec.kg, fee: 0, device: rec.device, other_brand: !!rec.other });
    audit(rec.id, 'tạo phiếu', '', b.uid);
    return b;
  }
  BIND.intake = () => {
    const f = $('#itk');
    if (!f) return;
    f.other.onchange = () => { $('#otherrow').hidden = !f.other.checked; f.uid.disabled = f.other.checked; };
    f.uid.onchange = () => { const b = S.batteries.find(x => x.uid === f.uid.value.trim()); if (b && !f.kg.value) f.kg.value = D.massOf(b, S.models); };
    const sync = $('#sync');
    if (sync) sync.onclick = () => { let n = 0; S.outbox.forEach(r => { if (commitIntake(r)) n++; }); S.outbox = []; save(); render(); toast(`Đã đồng bộ ${n} phiếu`); };
    f.addEventListener('submit', () => {
      const out = $('#ires'), pt = S.points.find(p => p.id === f.point.value);
      if (!pt.active) { out.innerHTML = '<div class="alert a-bad">Điểm chưa kích hoạt (BR-09)</div>'; return; }
      const other = f.other.checked, uid = f.uid.value.trim(), kg = parseFloat(f.kg.value);
      if (!other) {
        const b = S.batteries.find(x => x.uid === uid && x.tenant === 'VELIX');
        if (!b) { out.innerHTML = '<div class="alert a-bad">Không tìm thấy mã pin. Nếu pin không có mã VELIX, chọn Pin hãng khác.</div>'; return; }
        if (b.status !== 'Đang lưu hành' || S.outbox.some(r => r.uid === uid)) { out.innerHTML = `<div class="alert a-bad">Pin đang ở trạng thái ${esc(b.status)}, không thể tiếp nhận lại</div>`; return; }
      }
      if (!(kg > 0)) { out.innerHTML = '<div class="alert a-bad">Nhập khối lượng cân</div>'; return; }
      const checklist = [...f.querySelectorAll('[name=chk]:checked')].map(x => x.value);
      const bms = {}; D.BMS_FIELDS.forEach(k => { const v = f['bms_' + k].value; bms[k] = v === '' ? null : +v; });
      const device = pt.id + '-D1';
      S.devSeq += 1;
      const rec = { id: `${device}-${String(S.devSeq).padStart(4, '0')}`, point: pt.id, uid, other, ochem: f.ochem.value, kg, checklist, bms, date: S.today, device };
      if (S.offline) { S.outbox.push(rec); save(); render(); $('#ires').innerHTML = `<div class="alert a-warn">Đã lưu trên thiết bị: phiếu ${rec.id}. Đồng bộ khi có kết nối.</div>`; return; }
      const b = commitIntake(rec); save(); render();
      $('#ires').innerHTML = `<div class="alert ${b.hazard ? 'a-bad' : 'a-ok'}" data-testid="i-ok">Đã tiếp nhận <span class="mono" data-testid="i-newuid">${b.uid}</span> · phiếu ${rec.id} · phí 0 đ${b.flags.includes('Hãng khác') ? ' · cờ Hãng khác' : ''}${b.hazard ? '<br><b data-testid="i-hazard">Pin Nguy hiểm: đặt vào thùng cách ly chống cháy, không xếp chồng, báo Kho vận.</b>' : ''}</div>`;
    });
  };

  // ---------- Diem thu hoi (FR-05, FR-08; BR-08, BR-09) ----------
  VIEWS.points = () => {
    const u = me(), pk = D.pickupProposals(S, S.today);
    const pts = S.points.filter(p => u.scope === '*' || p.id === u.scope);
    const edit = ['LOG', 'ADM'].includes(u.role);
    return `<h1>Điểm thu hồi</h1><p class="sub">Tồn kho, đề xuất gom lô (BR-08), kích hoạt theo hồ sơ chủ nguồn thải (BR-09)</p>
    <div class="tw"><table data-testid="points-table"><tr><th>Điểm</th><th>Tỉnh/TP</th><th>Hồ sơ CTNH</th><th>Trạng thái</th><th class="n">Tồn kho</th><th>Mức đầy</th><th>Đề xuất gom lô</th><th></th></tr>
    ${pts.map(p => { const k = pk.find(x => x.point === p.id) || { kg: 0, pct: 0, count: 0, reasons: [] };
      return `<tr data-point="${p.id}"><td><b>${esc(p.name)}</b><br><small class="muted">${p.id} · ${esc(p.type)} · sức chứa ${p.capacity_kg} kg</small></td><td>${esc(p.province)}</td>
      <td>${p.ctnh_code ? esc(p.ctnh_code) + '<br><small>' + D.fmtDate(p.ctnh_valid_from) + '</small>' : '<span class="badge b-bad">Thiếu</span>'}</td>
      <td data-testid="pt-status-${p.id}">${p.active ? '<span class="badge b-ok">Hoạt động</span>' : '<span class="badge b-bad">Chưa kích hoạt</span>'}</td>
      <td class="n">${num(k.kg)} kg · ${k.count} pin</td><td style="min-width:90px"><div class="bar"><i style="width:${Math.min(100, k.pct)}%"></i></div><small>${num(k.pct)}%</small></td>
      <td data-testid="pk-${p.id}">${k.reasons.map(r => `<span class="badge b-warn">${esc(r)}</span>`).join(' ') || '—'}</td>
      <td>${edit && !p.active ? `<button class="ghost" data-act="${p.id}" data-testid="act-${p.id}">Kích hoạt</button>` : ''}${edit && p.active && k.count ? `<button class="ghost" data-pick="${p.id}" data-testid="pick-${p.id}">Lập lô gom</button>` : ''}</td></tr>`; }).join('')}</table></div>
    ${edit ? `<div class="card" id="actform" hidden><h2>Hồ sơ chủ nguồn thải CTNH</h2><form id="ctnh" class="row" onsubmit="return false">
      <label class="f">Mã hồ sơ<input name="code" data-testid="ctnh-code"></label><label class="f">Ngày hiệu lực<input name="from" type="date" data-testid="ctnh-from"></label>
      <div class="actions"><button data-testid="ctnh-save">Lưu và kích hoạt</button></div></form></div>` : ''}<div id="pres" data-testid="p-result"></div>`;
  };
  BIND.points = () => {
    let target = null;
    document.querySelectorAll('[data-act]').forEach(btn => btn.onclick = () => {
      target = S.points.find(p => p.id === btn.dataset.act);
      if (!target.ctnh_code) { $('#pres').innerHTML = `<div class="alert a-bad" data-testid="act-blocked">Không thể kích hoạt ${esc(target.name)}: thiếu hồ sơ chủ nguồn thải CTNH (BR-09). Nhập hồ sơ bên dưới.</div>`; $('#actform').hidden = false; return; }
      target.active = true; audit(target.id, 'active', false, true); save(); render();
    });
    const cf = $('#ctnh');
    if (cf) cf.onsubmit = () => {
      if (!target || !cf.code.value || !cf.from.value) { $('#pres').innerHTML = '<div class="alert a-bad">Nhập mã hồ sơ và ngày hiệu lực</div>'; return; }
      audit(target.id, 'ctnh_code', target.ctnh_code, cf.code.value); target.ctnh_code = cf.code.value; target.ctnh_valid_from = cf.from.value;
      target.active = true; audit(target.id, 'active', false, true); save(); render(); toast(`${target.name} đã kích hoạt`);
    };
    document.querySelectorAll('[data-pick]').forEach(btn => btn.onclick = () => {
      const pid = btn.dataset.pick, items = S.batteries.filter(b => b.loc === pid && b.status === 'Đã thu hồi');
      const sent = D.round1(items.reduce((s, b) => s + ((S.intakes.find(i => i.uid === b.uid) || {}).weight_kg || 0), 0));
      const id = nextBatchId('GL');
      S.batches.push({ id, kind: 'Gom về trung tâm', partner: 'TT', from: pid, date: S.today, items: items.map(b => b.uid), sent_kg: sent, received_kg: null, variance_reason: '', status: 'Đã gửi', created_by: S.user });
      items.forEach(b => { b.loc = 'TT'; event(b, 'Gom lô', `Lô ${id} từ ${pointName(pid)} về Trung tâm kiểm định`); });
      audit(id, 'tạo lô', '', `${items.length} pin, ${sent} kg`); save(); location.hash = '#/batches';
    });
  };
  function nextBatchId(prefix) {
    const y = S.today.slice(0, 4), n = S.batches.filter(b => b.id.startsWith(`${prefix === 'GL' ? 'GL' : 'CT'}-${y}`)).length + 1;
    return `${prefix === 'GL' ? 'GL' : 'CT'}-${y}-${String(n).padStart(4, '0')}`;
  }

  // ---------- Danh gia SoH (FR-11 - FR-13; BR-10, BR-14) ----------
  VIEWS.soh = () => {
    const q = mine().filter(b => b.status === 'Đã thu hồi' && D.groupOf(b, S.models) === 'B.2.1');
    const ev = q.map(b => ({ b, r: D.sohEvaluate(b.soh, S.params) }));
    return `<h1>Đánh giá SoH</h1><p class="sub">Mô hình ước lượng kèm khoảng tin cậy 90%; chuyển đo tay khi thiếu dữ liệu, không chắc chắn hoặc khoảng chứa ngưỡng ${S.params['PAR-07'].value}% (BR-10)</p>
    <div class="tw"><table data-testid="soh-table"><tr><th>Mã pin</th><th>Model</th><th class="n">SoH mô hình</th><th>Khoảng 90%</th><th>Kết quả</th><th>Thao tác</th></tr>
    ${ev.map(({ b, r }) => `<tr data-uid="${b.uid}"><td><a class="link mono" href="#/battery/${b.uid}">${b.uid}</a>${b.hazard ? ' <span class="badge b-bad">Nguy hiểm</span>' : ''}</td><td>${b.model}</td>
      <td class="n">${b.soh && b.soh.model_est != null ? num(b.soh.model_est) + '%' : '—'}</td><td>${b.soh && b.soh.ci_low != null ? `[${num(b.soh.ci_low)}; ${num(b.soh.ci_high)}]` : '—'}</td>
      <td data-testid="soh-status">${r.status === 'valid' ? `<span class="badge b-ok">Hợp lệ — ${r.source}</span>` : `<span class="badge b-warn">Chờ đo tay</span> <small data-testid="soh-reason">${esc(r.reason)}</small>`}</td>
      <td class="actions">${r.status === 'valid' ? `<button class="ghost" data-confirm="${b.uid}" data-testid="soh-confirm">Xác nhận</button>` : `<input type="number" step="0.1" placeholder="SoH đo tay %" data-manual="${b.uid}" data-testid="soh-manual-input" style="width:120px"><button class="ghost" data-savemanual="${b.uid}" data-testid="soh-manual-save">Lưu đo tay</button>`}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Không có pin chờ đánh giá</td></tr>'}</table></div>
    <h2>Ghi đè kết quả (BR-14)</h2><div class="card"><form id="ovr" class="row" onsubmit="return false">
      <label class="f">Mã pin (đã có SoH hợp lệ)<input name="uid" data-testid="ovr-uid"></label><label class="f">SoH mới (%)<input name="v" type="number" step="0.1" data-testid="ovr-value"></label>
      <label class="f">Lý do<input name="reason" data-testid="ovr-reason"></label><div class="actions"><button data-testid="ovr-save">Ghi đè</button></div></form><div id="ores" data-testid="ovr-result"></div></div>`;
  };
  function markEvaluated(b, source, value) {
    Object.assign(b.soh, { valid: true, source });
    setStatus(b, 'Đã đánh giá', `SoH ${value}% (${source})`); event(b, 'Đánh giá SoH', `SoH ${value}% (${source})`);
  }
  BIND.soh = () => {
    document.querySelectorAll('[data-confirm]').forEach(x => x.onclick = () => { const b = S.batteries.find(y => y.uid === x.dataset.confirm); markEvaluated(b, 'Mô hình', b.soh.model_est); audit(b.uid, 'SoH', '', b.soh.model_est, 'Xác nhận kết quả mô hình'); save(); render(); });
    document.querySelectorAll('[data-savemanual]').forEach(x => x.onclick = () => {
      const uid = x.dataset.savemanual, v = parseFloat(document.querySelector(`[data-manual="${uid}"]`).value);
      if (!(v >= 0 && v <= 100)) { toast('Nhập SoH 0–100'); return; }
      const b = S.batteries.find(y => y.uid === uid); if (!b.soh) b.soh = { bms: {}, model_est: null };
      b.soh.manual = v; markEvaluated(b, 'Đo tay', v); audit(b.uid, 'SoH đo tay', b.soh.model_est, v, 'Đo tay'); save(); render();
    });
    $('#ovr').onsubmit = () => {
      const f = $('#ovr'), b = mine().find(x => x.uid === f.uid.value.trim()), v = parseFloat(f.v.value);
      if (!b || !b.soh || !b.soh.valid) { $('#ores').innerHTML = '<div class="alert a-bad">Pin chưa có SoH hợp lệ</div>'; return; }
      if (!f.reason.value.trim()) { $('#ores').innerHTML = '<div class="alert a-bad" data-testid="ovr-need-reason">Bắt buộc nhập lý do ghi đè (BR-14)</div>'; return; }
      const old = b.soh.override != null ? b.soh.override : (b.soh.source === 'Đo tay' ? b.soh.manual : b.soh.model_est);
      b.soh.override = v; audit(b.uid, 'SoH', old, v, f.reason.value.trim()); event(b, 'Ghi đè SoH', `${old}% → ${v}%: ${f.reason.value.trim()}`); save();
      $('#ores').innerHTML = `<div class="alert a-ok" data-testid="ovr-ok">Đã ghi đè ${old}% → ${v}%</div>`;
    };
  };

  // ---------- Dieu phoi (FR-14 - FR-16; BR-11 - BR-13, BR-25, BR-29) ----------
  VIEWS.routing = () => {
    const u = me();
    const todo = mine().filter(b => (b.status === 'Đã đánh giá' && !(b.route && b.route.proposed)) || (b.status === 'Đã thu hồi' && D.groupOf(b, S.models) !== 'B.2.1' && b.loc === 'TT'));
    const pending = mine().filter(b => b.status === 'Đã đánh giá' && b.route && b.route.proposed === 'Đời thứ hai' && !b.route.approved_by);
    const ready = mine().filter(b => b.status === 'Đời thứ hai');
    return `<h1>Điều phối</h1><p class="sub">Đề xuất theo bảng quyết định (BR-12); Đời thứ hai cần hồ sơ SoH (BR-11) và phê duyệt bởi người khác (BR-13)</p>
    <h2>Chờ quyết định</h2><div class="tw"><table data-testid="route-table"><tr><th>Mã pin</th><th>Nhóm</th><th>Đề xuất</th><th>Lý do</th><th>Chọn hướng</th></tr>
    ${todo.map(b => { const p = D.routeProposal(b, S); return `<tr data-uid="${b.uid}"><td><a class="link mono" href="#/battery/${b.uid}">${b.uid}</a></td><td>${D.groupOf(b, S.models)}</td>
      <td data-testid="route-proposal">${p.proposal ? badge(p.proposal) : '—'}</td><td><small>${esc(p.reason)}</small></td>
      <td class="actions">${['TEC', 'TEC_LEAD'].includes(u.role) ? `<button class="ghost" data-route="Tái chế" data-uid="${b.uid}" data-testid="route-recycle">Tái chế</button><button class="ghost" data-route="Đời thứ hai" data-uid="${b.uid}" data-testid="route-sl" ${p.slAllowed ? '' : 'disabled title="' + esc(p.reason) + '"'}>Đời thứ hai</button>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="5" class="empty">Không có pin chờ quyết định</td></tr>'}</table></div>
    <h2>Chờ phê duyệt Đời thứ hai</h2><div class="tw"><table data-testid="approve-table"><tr><th>Mã pin</th><th>Người đề xuất</th><th></th></tr>
    ${pending.map(b => `<tr data-uid="${b.uid}"><td class="mono">${b.uid}</td><td>${esc((S.users.find(x => x.id === b.route.by) || {}).name)}</td><td>${u.role === 'TEC_LEAD' ? `<button data-approve="${b.uid}" data-testid="approve">Phê duyệt</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="3" class="empty">Không có</td></tr>'}</table></div>
    <h2>Bàn giao Đời thứ hai</h2><div class="tw"><table data-testid="handover-table"><tr><th>Mã pin</th><th>Đơn vị nhận</th><th>Số hợp đồng / hóa đơn</th><th></th></tr>
    ${ready.map(b => `<tr data-uid="${b.uid}"><td class="mono">${b.uid}</td><td><select data-slp="${b.uid}">${S.partners.filter(p => p.type === 'Đơn vị đời thứ hai').map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></td>
      <td><input data-contract="${b.uid}" data-testid="contract-input"></td><td>${u.role === 'LOG' ? `<button data-hand="${b.uid}" data-testid="handover">Bàn giao</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">Không có</td></tr>'}</table></div>
    <div id="rres" data-testid="r-result"></div>`;
  };
  BIND.routing = () => {
    const out = m => { $('#rres').innerHTML = m; };
    document.querySelectorAll('[data-route]').forEach(x => x.onclick = () => {
      const b = S.batteries.find(y => y.uid === x.dataset.uid), to = x.dataset.route, p = D.routeProposal(b, S);
      if (to === 'Đời thứ hai' && !p.slAllowed) { out(`<div class="alert a-bad">${esc(p.reason)}</div>`); return; }
      if (b.status === 'Đã thu hồi') { setStatus(b, 'Đã đánh giá', 'Phân loại (không cần SoH)'); event(b, 'Phân loại', p.reason); }
      b.route = { proposed: to, final: to === 'Tái chế' ? 'Tái chế' : null, by: S.user, approved_by: null, at: S.today };
      if (to === 'Tái chế') { setStatus(b, 'Chờ tái chế', 'Điều phối Tái chế'); event(b, 'Điều phối', 'Tái chế — ' + p.reason); }
      else event(b, 'Điều phối', 'Đề xuất Đời thứ hai — chờ phê duyệt');
      audit(b.uid, 'route', '', to); save(); render();
    });
    document.querySelectorAll('[data-approve]').forEach(x => x.onclick = () => {
      const b = S.batteries.find(y => y.uid === x.dataset.approve);
      if (b.route.by === S.user) { out('<div class="alert a-bad" data-testid="approve-same">Người phê duyệt phải khác người đề xuất (BR-13)</div>'); return; }
      b.route.approved_by = S.user; b.route.final = 'Đời thứ hai'; setStatus(b, 'Đời thứ hai', 'Phê duyệt'); event(b, 'Phê duyệt', `Đời thứ hai — duyệt bởi ${me().name}`); audit(b.uid, 'approve', '', 'Đời thứ hai'); save(); render();
    });
    document.querySelectorAll('[data-hand]').forEach(x => x.onclick = () => {
      const uid = x.dataset.hand, b = S.batteries.find(y => y.uid === uid), c = document.querySelector(`[data-contract="${uid}"]`).value.trim(), pid = document.querySelector(`[data-slp="${uid}"]`).value;
      if (!c) { out('<div class="alert a-bad" data-testid="need-contract">Nhập số hợp đồng hoặc hóa đơn chuyển giao (BR-25, REQ-EU-15)</div>'); return; }
      S.seq += 1;
      const child = { uid: D.makeUid(S.params['PAR-01'].value, b.model, S.today, S.seq), model: b.model, tenant: 'VELIX', placed_date: S.today, vin: '', kind: 'Đời thứ hai', status: 'Đang lưu hành', flags: [], hazard: false, loc: pid, soh: b.soh, route: null, parent_uid: b.uid, producer: pid, passport: 'repurposed',
        events: [{ date: S.today, type: 'Đăng ký', note: `Hồ sơ đời thứ hai, gốc ${b.uid}, đưa ra thị trường bởi ${pointName(pid)}` }] };
      S.batteries.push(child);
      setStatus(b, 'Đã bàn giao', 'Bàn giao đời thứ hai'); Object.assign(b, { loc: pid, child_uid: child.uid, contract: c });
      event(b, 'Bàn giao', `Đời thứ hai cho ${pointName(pid)}, hợp đồng ${c}`); audit(b.uid, 'handover', '', `${pid} · ${c} · ${child.uid}`); save();
      location.hash = '#/battery/' + b.uid;
    });
  };

  // ---------- Lo & chung tu (FR-09, FR-18, FR-19; BR-15 - BR-17, BR-26) ----------
  VIEWS.batches = () => {
    const u = me(), list = S.batches.filter(x => u.role !== 'RCY' || x.partner === u.scope).slice().reverse();
    const waiting = mine().filter(b => b.status === 'Chờ tái chế' && b.loc === 'TT');
    const canCreate = ['LOG', 'ADM'].includes(u.role);
    return `<h1>Lô & chứng từ giao nhận</h1><p class="sub">Số chứng từ duy nhất; kiểm chênh lệch khối lượng ${S.params['PAR-08'].value}% (BR-16); kiểm giấy phép đơn vị nhận (BR-15)</p>
    ${canCreate ? `<div class="card"><h2>Lập lô bàn giao đối tác</h2><form id="bf" onsubmit="return false">
      <div class="row"><label class="f">Đơn vị nhận<select name="partner" data-testid="b-partner">${S.partners.filter(p => p.type === 'Đơn vị tái chế').map(p => `<option value="${p.id}">${esc(p.name)} — ${D.licenseState(p, S.today)}</option>`).join('')}</select></label></div>
      <div class="tw"><table data-testid="b-items"><tr><th></th><th>Mã pin</th><th>Nhóm</th><th class="n">kg</th></tr>${waiting.map(b => `<tr><td><input type="checkbox" name="it" value="${b.uid}" data-testid="b-item"></td><td class="mono">${b.uid}</td><td>${D.groupOf(b, S.models)}</td><td class="n">${num(D.massOf(b, S.models))}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">Không có pin Chờ tái chế tại Trung tâm</td></tr>'}</table></div>
      <div class="actions" style="margin-top:8px"><button data-testid="b-create">Lập lô</button></div><div id="bres" data-testid="b-result"></div></form></div>` : ''}
    <div class="tw"><table data-testid="batch-table"><tr><th>Số chứng từ</th><th>Loại</th><th>Từ → đến</th><th>Ngày</th><th class="n">Gửi (kg)</th><th class="n">Cân nhận (kg)</th><th>Trạng thái</th><th>Thao tác</th></tr>
    ${list.map(x => `<tr data-batch="${x.id}"><td class="mono">${x.id}</td><td>${x.kind}</td><td>${esc(pointName(x.from))} → ${esc(pointName(x.partner))}</td><td>${D.fmtDate(x.date)}</td><td class="n">${num(x.sent_kg)}</td><td class="n">${x.received_kg != null ? num(x.received_kg) : '—'}${x.variance_reason ? `<br><small>${esc(x.variance_reason)}</small>` : ''}</td><td>${badge(x.status)}</td>
      <td>${batchActions(x, u)}</td></tr>`).join('') || '<tr><td colspan="8" class="empty">Chưa có lô</td></tr>'}</table></div><div id="wres" data-testid="w-result"></div>`;
  };
  function batchActions(x, u) {
    const recv = (x.kind === 'Gom về trung tâm' && ['LOG', 'ADM'].includes(u.role)) || (x.kind === 'Bàn giao đối tác' && u.role === 'RCY');
    if (x.status === 'Đã gửi' && recv) return `<input type="number" step="0.1" placeholder="kg cân" data-w="${x.id}" data-testid="w-input" style="width:90px"><input placeholder="Lý do chênh lệch" data-r="${x.id}" data-testid="w-reason" style="width:150px"><button class="ghost" data-weigh="${x.id}" data-testid="w-save">Xác nhận cân</button>`;
    if (x.status === 'Đã xác nhận cân' && x.kind === 'Bàn giao đối tác' && u.role === 'RCY') return `<button data-recycled="${x.id}" data-testid="recycled">Xác nhận đã tái chế theo quy cách</button>`;
    return '';
  }
  BIND.batches = () => {
    const bf = $('#bf');
    if (bf) bf.onsubmit = () => {
      const p = S.partners.find(x => x.id === bf.partner.value), uids = [...bf.querySelectorAll('[name=it]:checked')].map(x => x.value);
      if (!uids.length) { $('#bres').innerHTML = '<div class="alert a-bad">Chọn ít nhất một pin</div>'; return; }
      const items = uids.map(u => S.batteries.find(b => b.uid === u));
      const chk = D.licenseCheck(p, items.map(b => D.groupOf(b, S.models)), S.today);
      if (!chk.ok) { $('#bres').innerHTML = `<div class="alert a-bad" data-testid="b-blocked">Chặn lập lô: ${esc(chk.reason)} (BR-15)</div>`; return; }
      const id = nextBatchId('CT'), sent = D.round1(items.reduce((s, b) => s + D.massOf(b, S.models), 0));
      S.batches.push({ id, kind: 'Bàn giao đối tác', partner: p.id, from: 'TT', date: S.today, items: uids, sent_kg: sent, received_kg: null, variance_reason: '', status: 'Đã gửi', created_by: S.user });
      items.forEach(b => { setStatus(b, 'Đã bàn giao', 'Lô ' + id); b.loc = p.id; b.batch = id; event(b, 'Bàn giao', `Lô ${id} cho ${p.name}`); });
      audit(id, 'tạo lô', '', `${uids.length} pin · ${sent} kg`); save(); render();
      $('#bres') && ($('#bres').innerHTML = ''); toast(`Đã lập lô ${id}`);
      $('#wres').innerHTML = `<div class="alert a-ok" data-testid="b-created">Đã lập lô <span class="mono" data-testid="b-id">${id}</span> · ${num(sent)} kg</div>`;
    };
    document.querySelectorAll('[data-weigh]').forEach(btn => btn.onclick = () => {
      const x = S.batches.find(b => b.id === btn.dataset.weigh), w = parseFloat(document.querySelector(`[data-w="${x.id}"]`).value), reason = document.querySelector(`[data-r="${x.id}"]`).value.trim();
      if (!(w > 0)) { $('#wres').innerHTML = '<div class="alert a-bad">Nhập khối lượng cân</div>'; return; }
      const v = D.varianceCheck(x.sent_kg, w, S.params['PAR-08'].value);
      if (v.needReason && !reason) { $('#wres').innerHTML = `<div class="alert a-bad" data-testid="w-need-reason">Chênh lệch ${num(v.pct, 2)}% > ${S.params['PAR-08'].value}%: bắt buộc nhập lý do (BR-16)</div>`; return; }
      x.received_kg = w; x.variance_reason = reason; x.status = 'Đã xác nhận cân';
      if (v.needReason) S.notices.push(`Lô ${x.id}: chênh lệch ${num(v.pct, 2)}% — ${reason}`);
      if (x.kind === 'Gom về trung tâm') x.items.forEach(u => { const b = S.batteries.find(y => y.uid === u); event(b, 'Nhận tại trung tâm', `Lô ${x.id}`); });
      audit(x.id, 'received_kg', x.sent_kg, w, reason); save(); render();
      $('#wres').innerHTML = `<div class="alert a-ok" data-testid="w-ok">Đã xác nhận cân lô ${x.id}: chênh lệch ${num(v.pct, 2)}%</div>`;
    });
    document.querySelectorAll('[data-recycled]').forEach(btn => btn.onclick = () => {
      const x = S.batches.find(b => b.id === btn.dataset.recycled);
      x.status = 'Đã tái chế'; x.recycled_date = S.today;
      x.items.forEach(u => { const b = S.batteries.find(y => y.uid === u); setStatus(b, 'Đã tái chế', 'Lô ' + x.id); b.closed = true; event(b, 'Tái chế', `${pointName(x.partner)} xác nhận đã tái chế theo quy cách — hồ sơ đóng`); });
      audit(x.id, 'status', 'Đã xác nhận cân', 'Đã tái chế'); save(); render();
      $('#wres').innerHTML = `<div class="alert a-ok" data-testid="recycled-ok">Lô ${x.id}: ${x.items.length} pin đã tái chế, hồ sơ đã đóng</div>`;
    });
  };

  // ---------- Doi tac (FR-17, FR-18) ----------
  VIEWS.partners = () => `<h1>Đối tác & giấy phép</h1><p class="sub">Cảnh báo giấy phép hết hạn trong 60 ngày; chặn bàn giao khi không hợp lệ (BR-15)</p>
    <div class="tw"><table data-testid="partner-table"><tr><th>Mã</th><th>Tên</th><th>Loại</th><th>Giấy phép môi trường</th><th>Hiệu lực</th><th>Nhóm được phép</th><th>Tình trạng</th></tr>
    ${S.partners.map(p => `<tr data-partner="${p.id}"><td>${p.id}</td><td>${esc(p.name)}</td><td>${p.type}</td><td>${esc(p.license_no)}</td><td>${p.license_to ? D.fmtDate(p.license_from) + ' → ' + D.fmtDate(p.license_to) : '—'}</td><td>${p.groups.join(', ')}</td><td data-testid="lic-${p.id}">${badge(D.licenseState(p, S.today))}</td></tr>`).join('')}</table></div>`;

  // ---------- Bao cao EPR (FR-20 - FR-25; BR-18 - BR-22) ----------
  VIEWS.epr = (y) => {
    const year = +(y || S.today.slice(0, 4)), rep = D.eprReport(S, year), editable = me().role === 'CMP';
    return `<h1>Báo cáo EPR</h1><p class="sub">Năm trách nhiệm <select id="eyear" data-testid="e-year">${[2025, 2026].map(v => `<option ${v === year ? 'selected' : ''}>${v}</option>`).join('')}</select> · Căn cứ: <b data-testid="e-basis">${year <= 2025 ? 'NĐ 08/2022/NĐ-CP' : 'NĐ 110/2026/NĐ-CP'}</b></p>
    ${year <= 2025 ? '<div class="alert a-warn" data-testid="e-old">Năm trách nhiệm ≤2025 thực hiện theo NĐ 08/2022/NĐ-CP (REQ-VN-31, BR-22). Chưa nạp tham số năm 2025 — không áp tham số NĐ 110.</div>' : ''}
    <div class="tw"><table data-testid="epr-table"><tr><th>Nhóm Phụ lục I</th><th>Hình thức</th><th>Cách thức</th><th class="n">V (kg)</th><th class="n">R</th><th class="n">Phải tái chế R×V (kg)</th><th class="n">Kết quả đã xác nhận (kg)</th><th class="n">Bảo lưu (kg)</th><th class="n">Fs (đ/kg)</th><th class="n">F (đ)</th></tr>
    ${rep.map(r => `<tr data-group="${r.group}"><td>${D.VN_LABEL[r.group]}</td>
      <td>${editable && !r.missing ? `<select data-form="${r.group}" data-testid="e-form-${r.group}"><option ${r.form === 'Tổ chức tái chế' ? 'selected' : ''}>Tổ chức tái chế</option><option ${r.form === 'Đóng góp tài chính' ? 'selected' : ''}>Đóng góp tài chính</option></select>` : esc(r.form || '—')}</td>
      <td>${editable && !r.missing ? `<select data-method="${r.group}" data-testid="e-method-${r.group}"><option value="">—</option>${['Tự thực hiện', 'Hợp đồng đơn vị tái chế', 'Ủy quyền PRO', 'Kết hợp'].map(m => `<option ${r.method === m ? 'selected' : ''}>${m}</option>`).join('')}</select>` : esc(r.method || '—')}</td>
      <td class="n" data-testid="e-V-${r.group}">${num(r.V)}</td>${r.missing ? '<td colspan="6" class="muted">Chưa có tham số</td>' : `<td class="n" data-testid="e-R-${r.group}">${num(r.R * 100, 0)}%</td><td class="n" data-testid="e-req-${r.group}">${num(r.required)}</td><td class="n" data-testid="e-res-${r.group}">${num(r.result)}</td><td class="n" data-testid="e-carry-${r.group}">${num(r.carry)}</td><td class="n">${num(r.Fs, 0)}</td><td class="n" data-testid="e-F-${r.group}">${money(r.F)}</td>`}</tr>`).join('')}</table></div>
    <p class="muted">F = R × V × Fs chỉ tính khi chọn Đóng góp tài chính (BR-19). Kết quả tái chế chỉ tính khối lượng đã được đơn vị tái chế xác nhận theo quy cách (BR-17). Mỗi nhóm một hình thức mỗi năm (BR-20).</p>
    <div class="actions">${editable && year >= 2026 ? '<button id="esave" data-testid="e-save">Lưu lựa chọn</button>' : ''}<button class="ghost" id="ecsv" data-testid="e-csv">Xuất CSV</button></div><div id="eres" data-testid="e-result"></div>`;
  };
  BIND.epr = (y) => {
    const year = +(y || S.today.slice(0, 4));
    $('#eyear').onchange = e => { location.hash = '#/epr/' + e.target.value; };
    const sv = $('#esave');
    if (sv) sv.onclick = () => {
      for (const g of ['B.1.1', 'B.2.1']) {
        const c = { year, group: g, form: document.querySelector(`[data-form="${g}"]`).value, method: document.querySelector(`[data-method="${g}"]`).value };
        const err = D.validateChoice(c);
        if (err) { $('#eres').innerHTML = `<div class="alert a-bad" data-testid="e-err">${g}: ${err} (BR-20)</div>`; return; }
        if (c.form === 'Đóng góp tài chính') c.method = '';
        const old = S.epr_choice.find(x => x.year === year && x.group === g);
        audit(`EPR ${year} ${g}`, 'hình thức', old ? old.form + ' / ' + old.method : '', c.form + ' / ' + c.method);
        S.epr_choice = S.epr_choice.filter(x => !(x.year === year && x.group === g)).concat([c]);
      }
      save(); render(); toast('Đã lưu lựa chọn');
    };
    $('#ecsv').onclick = () => {
      const rows = D.eprReport(S, year), head = ['nam', 'nhom', 'hinh_thuc', 'cach_thuc', 'V_kg', 'R', 'phai_tai_che_kg', 'ket_qua_kg', 'bao_luu_kg', 'Fs_d_kg', 'F_d', 'can_cu'];
      const csv = [head.join(',')].concat(rows.map(r => [year, r.group, r.form, r.method, r.V, r.R, r.required, r.result, r.carry, r.Fs, r.F, r.basis].map(v => `"${v == null ? '' : v}"`).join(','))).join('\n');
      const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + csv); a.download = `epr-${year}-velix.csv`; a.setAttribute('data-testid', 'e-csv-link');
      document.body.appendChild(a); a.click(); a.remove(); window.__lastCsv = csv; $('#eres').innerHTML = `<div class="alert a-ok">Đã xuất epr-${year}-velix.csv</div>`;
    };
  };

  // ---------- Tham so (FR-20, FR-33) ----------
  VIEWS.params = () => `<h1>Tham số</h1><p class="sub">Đổi không cần phát hành phần mềm (NFR-08); mọi thay đổi được ghi nhật ký</p>
    <h2>Tham số vận hành</h2><div class="tw"><table data-testid="ops-params"><tr><th>Mã</th><th>Tên</th><th>Giá trị</th><th>Đơn vị</th></tr>
    ${Object.entries(S.params).map(([k, p]) => `<tr><td>${k}</td><td>${esc(p.name)}</td><td><input data-par="${k}" data-testid="par-${k}" value="${esc(p.value)}" ${typeof p.value === 'number' ? 'type="number" step="any"' : ''} style="width:140px"></td><td>${esc(p.unit)}</td></tr>`).join('')}</table></div>
    <h2>Tham số quy định theo năm trách nhiệm (PAR-10)</h2><div class="tw"><table data-testid="reg-params"><tr><th>Năm</th><th>Nhóm</th><th>R</th><th>Fs (đ/kg)</th><th>Căn cứ</th></tr>
    ${S.regulation.map((r, i) => `<tr><td>${r.year}</td><td>${r.group}</td><td><input data-reg="${i}" data-field="R" data-testid="reg-R-${r.year}-${r.group}" type="number" step="0.01" value="${r.R}" style="width:90px" ${me().role === 'CMP' ? '' : 'disabled'}></td><td><input data-reg="${i}" data-field="Fs" data-testid="reg-Fs-${r.year}-${r.group}" type="number" value="${r.Fs}" style="width:120px" ${me().role === 'CMP' ? '' : 'disabled'}></td><td><small>${esc(r.basis)}</small></td></tr>`).join('')}</table></div>
    <div class="actions" style="margin-top:10px"><button id="psave" data-testid="p-save">Lưu tham số</button></div>`;
  BIND.params = () => {
    $('#psave').onclick = () => {
      document.querySelectorAll('[data-par]').forEach(i => { const p = S.params[i.dataset.par], v = typeof p.value === 'number' ? parseFloat(i.value) : i.value; if (v !== p.value) { audit(i.dataset.par, 'value', p.value, v); p.value = v; } });
      document.querySelectorAll('[data-reg]:not([disabled])').forEach(i => { const r = S.regulation[+i.dataset.reg], f = i.dataset.field, v = parseFloat(i.value); if (v !== r[f]) { audit(`${r.year} ${r.group}`, f, r[f], v); r[f] = v; } });
      save(); render(); toast('Đã lưu tham số');
    };
  };

  // ---------- Nhat ky (FR-32) ----------
  VIEWS.audit = () => `<h1>Nhật ký kiểm toán</h1><p class="sub">Chỉ đọc — không có thao tác sửa hoặc xóa (NFR-06)</p>
    <div class="tw"><table data-testid="audit-table"><tr><th>Thời điểm</th><th>Người</th><th>Đối tượng</th><th>Trường</th><th>Cũ</th><th>Mới</th><th>Lý do</th></tr>
    ${S.audit.slice().reverse().map(a => `<tr><td class="mono">${esc(a.at)}</td><td>${esc(a.user)}</td><td class="mono">${esc(a.obj)}</td><td>${esc(a.field)}</td><td>${esc(a.old)}</td><td>${esc(a.new)}</td><td>${esc(a.reason)}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Chưa có thay đổi trong phiên này</td></tr>'}</table></div>`;

  // ---------- Cong cong khai (FR-10, BR-28) ----------
  VIEWS.public = () => {
    const provs = [...new Set(S.points.filter(p => p.active).map(p => p.province))];
    return `<h1>Trả pin xe điện ở đâu?</h1><p class="sub">Trả pin miễn phí, nhận pin mọi hãng, không cần mua pin mới.</p>
    <div class="card"><label class="f">Tỉnh/thành phố<select id="prov" data-testid="pub-prov"><option value="">Chọn</option>${provs.map(p => `<option>${p}</option>`).join('')}</select></label></div>
    <div id="publist" data-testid="pub-list"></div>
    <div class="card"><h2>Thải pin an toàn</h2><ol><li>Không tự tháo, đục, đốt pin.</li><li>Pin phồng, rò rỉ, nóng: để nơi thoáng, xa vật dễ cháy, mang đến điểm trả sớm nhất.</li><li>Dán băng dính cách điện lên cực pin khi vận chuyển.</li><li>Không bán pin cho người thu mua không có giấy phép.</li></ol></div>`;
  };
  BIND.public = () => {
    $('#prov').onchange = e => {
      const pts = S.points.filter(p => p.active && p.province === e.target.value);
      $('#publist').innerHTML = pts.map(p => `<div class="card" data-testid="pub-point"><b>${esc(p.name)}</b><br>${esc(p.address)}, ${esc(p.province)}<br>Giờ mở cửa: ${esc(p.hours)}</div>`).join('') || '<div class="empty">Chưa có điểm</div>';
    };
  };

  window.App = { get state() { return S; }, render, save, reset: () => { S = fresh(); save(); render(); } };
  render();
})();
