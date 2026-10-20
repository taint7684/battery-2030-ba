"""T4.21 - Sinh du lieu GIA LAP (synthetic) cho prototype va tai lieu.
Ty le 1:100 so voi doanh so VELIX (5% thi truong xe may dien, ASM-13), phan phoi tuoi tho theo ASM-08/09.
Ghi: 04-solution/synthetic/*_SYNTH.csv va docs/prototype/data.js. Chay: .venv/Scripts/python 04-solution/synthetic/generator.py"""
import csv
import json
import sys
from datetime import date, timedelta
from math import gamma
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
PROTO = ROOT / "docs" / "prototype"
TODAY = date(2026, 10, 20)
GO_LIVE = date(2026, 3, 1)  # thi diem nen tang; phieu tiep nhan chi co tu ngay nay
rng = np.random.default_rng(2030)

MODELS = [  # code, ten, hoa hoc, V, Ah, kWh, kg, bao hanh thang
    {"code": "LF48", "name": "VELIX LFP 48V 30Ah", "chemistry": "LFP", "voltage_v": 48, "capacity_ah": 30, "energy_kwh": 1.44, "mass_kg": 11.5, "warranty_months": 36},
    {"code": "LF60", "name": "VELIX LFP 60V 36Ah", "chemistry": "LFP", "voltage_v": 60, "capacity_ah": 36, "energy_kwh": 2.16, "mass_kg": 16.2, "warranty_months": 36},
    {"code": "NM72", "name": "VELIX NMC 72V 40Ah", "chemistry": "NMC", "voltage_v": 72, "capacity_ah": 40, "energy_kwh": 2.88, "mass_kg": 17.0, "warranty_months": 36},
    {"code": "PB48", "name": "VELIX Ắc quy chì 48V 20Ah", "chemistry": "Chì", "voltage_v": 48, "capacity_ah": 20, "energy_kwh": 0.96, "mass_kg": 28.0, "warranty_months": 12},
]
for m in MODELS:
    m.update({"manufacturer": "Nhà cung cấp pin A (hư cấu)", "labeler": "VELIX", "use": "Phương tiện giao thông",
              "dismantling_doc_url": f"docs/{m['code']}-thao-do.pdf", "safety_doc_url": f"docs/{m['code']}-an-toan.pdf", "tenant": "VELIX"})
# Doanh so mau 1:100 theo nam: (tong, ty trong Li, ty trong NM72 trong Li)
SALES = {2021: (144, 0.40, 0.0), 2022: (145, 0.50, 0.0), 2023: (140, 0.55, 0.05), 2024: (135, 0.60, 0.10),
         2025: (367, 0.70, 0.12), 2026: (400, 0.75, 0.15)}
POINTS = [
    {"id": "P01", "name": "Đại lý VELIX Cầu Giấy", "type": "Đại lý", "province": "Hà Nội", "address": "12 Trần Thái Tông, Cầu Giấy", "hours": "08:00–20:00", "capacity_kg": 400, "ctnh_code": "HN-CTNH-0921", "ctnh_valid_from": "2026-02-15", "active": True},
    {"id": "P02", "name": "Đại lý VELIX Thủ Đức", "type": "Đại lý", "province": "TP. Hồ Chí Minh", "address": "88 Võ Văn Ngân, Thủ Đức", "hours": "08:00–19:00", "capacity_kg": 300, "ctnh_code": "HCM-CTNH-1188", "ctnh_valid_from": "2026-02-20", "active": True},
    {"id": "P03", "name": "Trạm đổi pin Hoàn Kiếm", "type": "Trạm đổi pin", "province": "Hà Nội", "address": "5 Hàng Bài, Hoàn Kiếm", "hours": "06:00–22:00", "capacity_kg": 200, "ctnh_code": "HN-CTNH-1003", "ctnh_valid_from": "2026-03-01", "active": True},
    {"id": "P04", "name": "Đại lý VELIX Hải Châu", "type": "Đại lý", "province": "Đà Nẵng", "address": "20 Lê Duẩn, Hải Châu", "hours": "08:00–18:00", "capacity_kg": 250, "ctnh_code": "", "ctnh_valid_from": "", "active": False},
]
PARTNERS = [
    {"id": "R01", "name": "Công ty Tái chế Xanh Bắc (hư cấu)", "type": "Đơn vị tái chế", "license_no": "GPMT-2023-118", "license_from": "2023-07-01", "license_to": "2026-12-04", "groups": ["B.1.1", "B.2.1"]},
    {"id": "R02", "name": "Công ty Tái chế Chì Nam (hư cấu)", "type": "Đơn vị tái chế", "license_no": "GPMT-2024-077", "license_from": "2024-03-01", "license_to": "2029-02-28", "groups": ["B.1.1"]},
    {"id": "R03", "name": "Cơ sở Tái chế Cũ (hư cấu)", "type": "Đơn vị tái chế", "license_no": "GPMT-2021-031", "license_from": "2021-10-01", "license_to": "2026-09-30", "groups": ["B.1.1", "B.2.1"]},
    {"id": "S01", "name": "Lưu trữ Điện Mặt Trời SL (hư cấu)", "type": "Đơn vị đời thứ hai", "license_no": "—", "license_from": "", "license_to": "", "groups": ["B.2.1"]},
]
USERS = [
    {"id": "u-lan", "name": "Chị Lan", "role": "CMP", "scope": "*"},
    {"id": "u-hung", "name": "Anh Hùng", "role": "DLR", "scope": "P01"},
    {"id": "u-thao", "name": "Chị Thảo", "role": "DLR", "scope": "P04"},
    {"id": "u-quan", "name": "Anh Quân", "role": "TEC", "scope": "*"},
    {"id": "u-minh", "name": "Anh Minh", "role": "TEC_LEAD", "scope": "*"},
    {"id": "u-tuan", "name": "Anh Tuấn", "role": "LOG", "scope": "*"},
    {"id": "u-mai", "name": "Chị Mai", "role": "RCY", "scope": "R01"},
    {"id": "u-ha", "name": "Bà Hà", "role": "MGT", "scope": "*"},
    {"id": "u-admin", "name": "Quản trị", "role": "ADM", "scope": "*"},
]


def weib(mean, k):
    lam = mean / gamma(1 + 1 / k)
    return lam * rng.weibull(k)


def luhn(digits):
    s = 0
    for i, c in enumerate(reversed(digits)):
        n = int(c)
        if i % 2 == 0:
            n *= 2
            n -= 9 if n > 9 else 0
        s += n
    return (10 - s % 10) % 10


seq = {"n": 0}


def uid(model, d):
    seq["n"] += 1
    yy, ss = f"{d.year % 100:02d}", f"{seq['n']:07d}"
    return f"VLX-{model}-{yy}-{ss}-{luhn(yy + ss)}"


def rand_date(y, end=None):
    start = date(y, 1, 1)
    stop = min(date(y, 12, 31), end or date(y, 12, 31))
    return start + timedelta(days=int(rng.integers(0, (stop - start).days + 1)))


batteries, intakes = [], []
MASS = {m["code"]: m["mass_kg"] for m in MODELS}
CHEM = {m["code"]: m["chemistry"] for m in MODELS}


def add_battery(model, placed, vin, kind):
    b = {"uid": uid(model, placed), "model": model, "tenant": "VELIX", "placed_date": placed.isoformat(), "vin": vin,
         "kind": kind, "status": "Đang lưu hành", "flags": [], "hazard": False, "loc": "", "soh": None, "route": None,
         "events": [{"date": placed.isoformat(), "type": "Đăng ký", "note": "Đưa ra thị trường" + (" (pin thay thế)" if kind == "Thay thế" else "")}]}
    batteries.append(b)
    return b


vin_n = 0
for y, (n, li, nmc) in SALES.items():
    for _ in range(n):
        vin_n += 1
        r = rng.random()
        model = "PB48" if r > li else ("NM72" if rng.random() < nmc else ("LF60" if rng.random() < 0.35 else "LF48"))
        placed = rand_date(y, TODAY if y == 2026 else None)
        vin = f"VLXV{vin_n:06d}"
        veh_life = weib(10, 3.6) * 365
        b = add_battery(model, placed, vin, "Theo xe")
        # pin hong trong xe con song -> thay pin cung model (ASM-20); pin cu duoc thu hoi neu sau GO_LIVE
        cur, t0 = b, placed
        while True:
            life = weib(2 if model == "PB48" else 6, 3.0) * 365
            fail = t0 + timedelta(days=int(life))
            if fail > TODAY or (fail - placed).days > veh_life:
                break
            nb = add_battery(model, fail, vin, "Thay thế")
            cur["eol_date"] = fail.isoformat()
            cur, t0 = nb, fail
# Mot so pin bi gan co (xuat khau, thu nghiem, NCC da thuc hien EPR) - nam 2026
for b in rng.choice([x for x in batteries if x["placed_date"] >= "2026-01-01"], 6, replace=False):
    b["flags"].append(["Xuất khẩu", "Thử nghiệm", "NCC đã thực hiện EPR"][int(rng.integers(0, 3))])

# Tiep nhan sau GO_LIVE: pin het han co xac suat 0,55 duoc tra ve diem VELIX
active_pts = [p for p in POINTS if p["active"]]
ic = {"n": 0}
for b in batteries:
    e = b.get("eol_date")
    if not e or e < GO_LIVE.isoformat() or rng.random() > 0.55:
        continue
    d = date.fromisoformat(e) + timedelta(days=int(rng.integers(0, 5)))
    if d > TODAY:
        continue
    p = active_pts[int(rng.integers(0, len(active_pts)))]
    haz = rng.random() < 0.06
    ic["n"] += 1
    w = round(MASS[b["model"]] * rng.uniform(0.97, 1.02), 1)
    intakes.append({"id": f"PT-{p['id']}-{ic['n']:05d}", "point": p["id"], "uid": b["uid"], "date": d.isoformat(),
                    "checklist": ["Nóng bất thường"] if haz else [], "weight_kg": w, "fee": 0, "device": f"{p['id']}-D1", "other_brand": False})
    b.update({"status": "Đã thu hồi", "loc": p["id"], "hazard": haz, "intake_date": d.isoformat()})
    b["events"].append({"date": d.isoformat(), "type": "Tiếp nhận", "note": f"{p['name']}" + (" — cờ Nguy hiểm" if haz else "")})

# Pin hang khac
for i in range(4):
    p = active_pts[i % len(active_pts)]
    d = TODAY - timedelta(days=int(rng.integers(2, 25)))
    ic["n"] += 1
    t = f"TMP-{p['id']}-{ic['n']:05d}"
    batteries.append({"uid": t, "model": "KHAC", "tenant": "VELIX", "placed_date": "", "vin": "", "kind": "Hãng khác", "status": "Đã thu hồi",
                      "flags": ["Hãng khác"], "hazard": False, "loc": p["id"], "soh": None, "route": None, "intake_date": d.isoformat(),
                      "other_mass_kg": 26.0, "other_chem": "Chì",
                      "events": [{"date": d.isoformat(), "type": "Tiếp nhận", "note": f"Pin hãng khác tại {p['name']}"}]})
    intakes.append({"id": t.replace("TMP", "PT"), "point": p["id"], "uid": t, "date": d.isoformat(), "checklist": [], "weight_kg": 26.0, "fee": 0, "device": f"{p['id']}-D1", "other_brand": True})


def soh_record(b, d):
    """Du lieu BMS (Phu luc VII) + uoc luong mo hinh GIA LAP; khong phai ket qua that cua mo hinh S17."""
    age = (d - date.fromisoformat(b["placed_date"])).days / 365
    cycles = int(age * rng.uniform(180, 320))
    true = float(np.clip(100 - age * rng.uniform(3.0, 6.0) - rng.normal(0, 2), 45, 99))
    half = float(rng.uniform(2.0, 7.0))
    est = true + rng.normal(0, 1.5)
    bms = {"remaining_capacity_ah": round(next(m for m in MODELS if m["code"] == b["model"])["capacity_ah"] * true / 100, 1),
           "resistance_increase_pct": round((100 - true) * rng.uniform(0.6, 1.2), 1), "full_cycles": cycles,
           "deep_discharge_events": int(rng.poisson(2)), "hours_extreme_temp": int(rng.poisson(20))}
    if rng.random() < 0.12:
        bms[list(bms)[int(rng.integers(0, 5))]] = None  # thieu truong bat buoc
    return {"bms": bms, "model_est": round(est, 1), "ci_low": round(est - half, 1), "ci_high": round(est + half, 1),
            "manual": None, "source": None, "valid": False, "date": d.isoformat()}


# Pin Li da thu hoi: tao du lieu BMS cho may uoc luong (ap dung quy tac o prototype)
for b in batteries:
    if b["status"] == "Đã thu hồi" and b["model"] not in ("PB48", "KHAC"):
        b["soh"] = soh_record(b, date.fromisoformat(b["intake_date"]))

# Co dinh mot so pin kiem thu (fixture) de test tu dong lap lai duoc
li_pool = [b for b in batteries if b["status"] == "Đã thu hồi" and b["model"] in ("LF48", "LF60") and not b["hazard"]]
fx = {}
for name, est, lo, hi, missing in [("FX-SOH-OK", 82.0, 79.0, 85.0, False), ("FX-SOH-MISS", 80.0, 77.0, 83.0, True),
                                   ("FX-SOH-EDGE", 71.0, 67.0, 75.0, False), ("FX-SOH-WIDE", 78.0, 72.0, 84.0, False),
                                   ("FX-SOH-LOW", 65.0, 62.0, 68.0, False)]:
    b = li_pool.pop(0)
    b["soh"] = soh_record(b, date.fromisoformat(b["intake_date"]))
    b["soh"].update({"model_est": est, "ci_low": lo, "ci_high": hi})
    if missing:
        b["soh"]["bms"]["full_cycles"] = None
    else:
        b["soh"]["bms"] = {k: (v if v is not None else 1) for k, v in b["soh"]["bms"].items()}
    b["fixture"] = name
    fx[name] = b["uid"]

# Xu ly lich su (truoc ngay hien tai) cho pin khong phai fixture - ap cung quy tac BR-10/12/29
batches = []
fixture_uids = set(fx.values())
recycled_by_month, handed_sl = {}, []
for b in batteries:
    if b["status"] != "Đã thu hồi" or b["uid"] in fixture_uids:
        continue
    d = date.fromisoformat(b["intake_date"])
    age = (TODAY - d).days
    if age < 15:
        continue  # con tai diem thu hoi
    pick = d + timedelta(days=10)
    b["events"].append({"date": pick.isoformat(), "type": "Gom lô", "note": f"Từ {b['loc']} về Trung tâm kiểm định"})
    b["loc"] = "TT"
    is_li = b["model"] not in ("PB48", "KHAC") and (b["model"] != "KHAC")
    if age < 45:
        if not is_li:
            b["status"] = "Chờ tái chế"; b["route"] = {"proposed": "Tái chế", "final": "Tái chế", "by": "Hệ thống", "approved_by": None}
        continue
    ev = pick + timedelta(days=5)
    if is_li and b["soh"]:
        s_ = b["soh"]; full = all(v is not None for v in s_["bms"].values())
        width_ok = (s_["ci_high"] - s_["ci_low"]) <= 10; edge = s_["ci_low"] <= 70 <= s_["ci_high"]
        if full and width_ok and not edge:
            s_.update({"valid": True, "source": "Mô hình"})
        else:
            s_.update({"manual": round(s_["model_est"] + rng.normal(0, 1), 1), "valid": True, "source": "Đo tay"})
        val = s_["manual"] if s_["source"] == "Đo tay" else s_["model_est"]
        b["events"].append({"date": ev.isoformat(), "type": "Đánh giá SoH", "note": f"SoH {val:.1f}% ({s_['source']})"})
        good = val >= 70 and not b["hazard"]
    else:
        good = False
    route = "Đời thứ hai" if good else "Tái chế"
    b["route"] = {"proposed": route, "final": route, "by": "u-quan", "approved_by": "u-minh" if good else None}
    b["events"].append({"date": (ev + timedelta(days=2)).isoformat(), "type": "Điều phối", "note": route + (" — duyệt bởi Anh Minh" if good else "")})
    hand = ev + timedelta(days=12)
    if hand > TODAY:
        b["status"] = "Đời thứ hai" if good else "Chờ tái chế"; continue
    if good:
        seq["n"] += 1
        yy, ss = f"{hand.year % 100:02d}", f"{seq['n']:07d}"
        child = {"uid": f"VLX-{b['model']}-{yy}-{ss}-{luhn(yy + ss)}", "model": b["model"], "tenant": "VELIX", "placed_date": hand.isoformat(),
                 "vin": "", "kind": "Đời thứ hai", "status": "Đang lưu hành", "flags": [], "hazard": False, "loc": "S01", "soh": None, "route": None,
                 "parent_uid": b["uid"], "producer": "S01", "passport": "repurposed",
                 "events": [{"date": hand.isoformat(), "type": "Đăng ký", "note": f"Hồ sơ đời thứ hai, gốc {b['uid']}, đưa ra thị trường bởi S01"}]}
        handed_sl.append(child)
        b.update({"status": "Đã bàn giao", "loc": "S01", "child_uid": child["uid"], "contract": f"HĐ-SL-{hand:%Y%m}-01"})
        b["events"].append({"date": hand.isoformat(), "type": "Bàn giao", "note": f"Đời thứ hai cho S01, hợp đồng HĐ-SL-{hand:%Y%m}-01"})
    else:
        recycled_by_month.setdefault(f"{hand:%Y-%m}", []).append(b)
batteries.extend(handed_sl)
for i, (mon, items) in enumerate(sorted(recycled_by_month.items()), 1):
    sent = round(sum(MASS.get(x["model"], 26.0) for x in items), 1)
    dt = date.fromisoformat(mon + "-25")
    bid = f"CT-2026-{i:04d}"
    batches.append({"id": bid, "kind": "Bàn giao đối tác", "partner": "R01", "from": "TT", "date": dt.isoformat(), "items": [x["uid"] for x in items],
                    "sent_kg": sent, "received_kg": round(sent * 0.995, 1), "variance_reason": "", "status": "Đã tái chế",
                    "recycled_date": (dt + timedelta(days=20)).isoformat(), "created_by": "u-tuan"})
    for x in items:
        x.update({"status": "Đã tái chế", "loc": "R01", "batch": bid, "closed": True})
        x["events"] += [{"date": dt.isoformat(), "type": "Bàn giao", "note": f"Lô {bid} cho R01"},
                        {"date": (dt + timedelta(days=20)).isoformat(), "type": "Tái chế", "note": "R01 xác nhận đã tái chế theo quy cách — hồ sơ đóng"}]
# Fixture pin chi cho test lap lo / can: dat tai TT trang thai Cho tai che
for b in [x for x in batteries if x["model"] == "PB48" and x["status"] == "Chờ tái chế"][:0]:
    pass

params = {
    "PAR-01": {"name": "Tiền tố tổ chức trong mã định danh", "value": "VLX", "unit": ""},
    "PAR-02": {"name": "Ngưỡng khối lượng pin LMT (EU)", "value": 25, "unit": "kg"},
    "PAR-03": {"name": "Ngưỡng tồn kho đề xuất gom lô", "value": 80, "unit": "% sức chứa"},
    "PAR-04": {"name": "Thời gian lưu tối đa pin Nguy hiểm", "value": 72, "unit": "giờ"},
    "PAR-05": {"name": "Thời gian lưu tối đa tại điểm thu hồi", "value": 30, "unit": "ngày"},
    "PAR-06": {"name": "Độ rộng tối đa khoảng tin cậy SoH", "value": 10, "unit": "điểm %"},
    "PAR-07": {"name": "Ngưỡng SoH đời thứ hai", "value": 70, "unit": "%"},
    "PAR-08": {"name": "Ngưỡng chênh lệch khối lượng giao nhận", "value": 2, "unit": "%"},
    "PAR-09": {"name": "Thời hạn lưu trữ hồ sơ", "value": 10, "unit": "năm"},
    "PAR-11": {"name": "Hạn nộp hồ sơ / nộp tiền (năm sau năm trách nhiệm)", "value": "01/04 · 20/04", "unit": ""},
}
regulation = [  # PAR-10: tham so quy dinh theo nam trach nhiem va nhom
    {"year": 2026, "group": "B.1.1", "R": 0.12, "Fs": 18278, "basis": "NĐ 110/2026 Phụ lục I; Fs: TT 07/2025 Phụ lục IXa (ASM-15)"},
    {"year": 2026, "group": "B.2.1", "R": 0.0, "Fs": 54876, "basis": "NĐ 110/2026 Phụ lục I (0%); Fs: TT 07/2025 Phụ lục IXa (ASM-16)"},
]
epr_choice = [{"year": 2026, "group": "B.1.1", "form": "Tổ chức tái chế", "method": "Hợp đồng đơn vị tái chế"},
              {"year": 2026, "group": "B.2.1", "form": "Tổ chức tái chế", "method": "Kết hợp"}]
# Tenant thu hai (kiem BR-27): khong duoc hien voi nguoi dung VELIX
other_tenant = [{"uid": f"DM2-X-26-{i:07d}-0", "model": "LF48", "tenant": "DEMO2", "placed_date": "2026-05-01", "vin": "", "kind": "Theo xe",
                 "status": "Đang lưu hành", "flags": [], "hazard": False, "loc": "", "soh": None, "route": None,
                 "events": [{"date": "2026-05-01", "type": "Đăng ký", "note": "Tenant DEMO2"}]} for i in range(1, 4)]

data = {"today": TODAY.isoformat(), "go_live": GO_LIVE.isoformat(), "seq": seq["n"], "models": MODELS, "points": POINTS,
        "partners": PARTNERS, "users": USERS, "batteries": batteries + other_tenant, "intakes": intakes, "batches": batches,
        "params": params, "regulation": regulation, "epr_choice": epr_choice, "fixtures": fx, "audit": []}
PROTO.mkdir(parents=True, exist_ok=True)
(PROTO / "data.js").write_text("// DU LIEU GIA LAP (synthetic) - sinh boi 04-solution/synthetic/generator.py, seed 2030\nwindow.SEED = " +
                               json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")


def dump(name, rows, fields):
    with open(OUT / f"{name}_SYNTH.csv", "w", encoding="utf-8", newline="\n") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({k: (";".join(map(str, v)) if isinstance(v, list) else v) for k, v in r.items() if k in fields})


dump("batteries", batteries, ["uid", "model", "tenant", "placed_date", "vin", "kind", "status", "flags", "hazard", "loc", "eol_date", "intake_date"])
dump("intakes", intakes, ["id", "point", "uid", "date", "checklist", "weight_kg", "fee", "device", "other_brand"])
dump("models", MODELS, list(MODELS[0]))
from collections import Counter  # noqa: E402
print("pin:", len(batteries), Counter(b["status"] for b in batteries), "phieu:", len(intakes), "fixtures:", fx)
print("theo nam/model:", sorted(Counter((b["placed_date"][:4], b["model"]) for b in batteries if b["placed_date"]).items())[-8:])
