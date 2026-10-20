"""Sinh 02-regulatory/passport-field-map.csv tu Battery Pass Data Attribute Longlist v1.2 (SRC-015, CC BY 4.0).
Chay: .venv/Scripts/python tools/build_passport_map.py  (can ban clone o 02-regulatory/raw/bp-datamodel)"""
import csv, sys, warnings
import openpyxl
warnings.filterwarnings("ignore")
sys.stdout.reconfigure(encoding="utf-8")
SRC = "02-regulatory/raw/bp-datamodel/docs/1.2/2025_Battery_Passport_Data_Attributes_V1.2.xlsx"
OUT = "02-regulatory/passport-field-map.csv"

# Pham vi nen tang theo so thu tu thuoc tinh (#). MVP = luu tu ban dau; GD2 = giai doan 2; NGOAI = ngoai pham vi.
MVP = {1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 31, 34, 36, 39, 49, 50, 51, 52, 53, 57, 58, 61, 62, 63, 74, 75,
       76, 77, 78, 81, 82, 83, 84, 87, 88, 89, 90, 91, 93}
NGOAI = set(range(12, 31)) | set(range(40, 49))
# Truong VN can cho bao cao EPR (khoi luong theo nhom Phu luc I, nha san xuat, nam dua ra thi truong)
VN_NEED = {2: "Định danh pin đưa ra thị trường", 4: "Bên chịu trách nhiệm EPR", 6: "Năm đưa ra thị trường (năm có trách nhiệm)",
           9: "Nhóm Phụ lục I NĐ 110", 10: "V — khối lượng (kg) trong F = R × V × Fs", 11: "Trạng thái để tính khối lượng thu hồi/tái chế",
           31: "Phân nhóm Li / NiMH / chì theo Phụ lục I"}
# Nguon du lieu trong nen tang
def source(n, cat):
    if n in (1, 2, 11): return "Hệ thống sinh"
    if n in (53, 57, 58, 63, 75, 78, 81, 82, 84, 87, 88, 89, 90, 91): return "Đọc BMS khi tiếp nhận / mô hình SoH"
    if n == 93: return "Người tiếp nhận khai báo"
    return "Nhà sản xuất khai báo khi đăng ký model"
FIELD = {1: "passport.passport_id", 2: "battery.battery_uid", 4: "battery_model.manufacturer", 5: "battery_model.manufacturing_place",
         6: "battery.manufacturing_date", 7: "battery.put_into_service_date", 8: "battery_model.warranty_months", 9: "battery_model.category_vn",
         10: "battery_model.mass_kg", 11: "battery.passport_status", 31: "battery_model.chemistry", 34: "battery_model.hazardous_substances",
         36: "battery_model.dismantling_doc_url", 39: "battery_model.safety_doc_url", 49: "public_content.end_user_info", 50: "public_content.end_user_info",
         51: "public_content.end_user_info", 52: "battery_model.capacity_ah", 53: "soh_assessment.remaining_capacity_ah", 57: "soh_assessment.soce_pct",
         58: "soh_assessment.soc_pct", 61: "battery_model.voltage_v", 62: "battery_model.original_power_w", 63: "soh_assessment.remaining_power_w",
         74: "battery_model.initial_resistance_mohm", 75: "soh_assessment.resistance_increase_pct", 76: "battery_model.expected_life_years",
         77: "battery_model.expected_life_cycles", 78: "soh_assessment.full_cycles", 81: "soh_assessment.energy_throughput_kwh",
         82: "soh_assessment.capacity_throughput_ah", 83: "battery_model.capacity_threshold_pct", 84: "soh_assessment.temperature_log_ref",
         87: "soh_assessment.hours_above_temp", 88: "soh_assessment.hours_below_temp", 89: "soh_assessment.hours_charge_above_temp",
         90: "soh_assessment.hours_charge_below_temp", 91: "soh_assessment.deep_discharge_events", 93: "intake.checklist"}
def flag(v): return {"x": "Bắt buộc", "o": "Tự nguyện"}.get((v or "").strip(), "—")

wb = openpyxl.load_workbook(SRC, read_only=True)
rows = list(wb["Data attribute longlist_v1.2"].iter_rows(values_only=True))
out = []
for r in rows[6:]:
    if not isinstance(r[1], (int, float)): continue
    n = int(r[1])
    scope = "MVP" if n in MVP else ("Ngoài phạm vi" if n in NGOAI else "Giai đoạn 2")
    out.append({"bp_no": n, "category": (r[7] or "").replace("\n", " "), "sub_category": (r[8] or "-").replace("\n", " "),
                "attribute": (r[9] or "").strip(), "eu_ev": flag(r[3]), "eu_lmt": flag(r[4]),
                "regulation_ref": (r[13] or "").replace("\n", " ").strip(), "vn_epr_need": VN_NEED.get(n, "—"),
                "platform_scope": scope, "platform_field": FIELD.get(n, "—") if scope == "MVP" else "—",
                "data_source": source(n, r[7]) if scope == "MVP" else "—"})
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0]))
    w.writeheader(); w.writerows(out)
from collections import Counter
print(len(out), Counter(o["platform_scope"] for o in out), "LMT bat buoc:", sum(o["eu_lmt"] == "Bắt buộc" for o in out),
      "VN can:", sum(o["vn_epr_need"] != "—" for o in out))
