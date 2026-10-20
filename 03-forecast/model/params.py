"""Tham so dau vao cua mo hinh du bao (S8-S10). Moi gia tri co ma nguon SRC hoac gia dinh ASM.
Bo ba (min, likely, max) dung cho Monte Carlo phan phoi tam giac."""

YEARS_HIST = list(range(2015, 2026))
YEARS_FCST = list(range(2026, 2036))
YEARS = YEARS_HIST + YEARS_FCST
SCENARIOS = ["Chậm", "Cơ sở", "Nhanh"]
SEGMENTS = ["e2W-Li", "e2W-Chì", "Ô tô-Li"]

# --- Doanh so xe may dien lich su (nghin xe/nam): (min, likely, max), nguon ---
E2W_HIST = {
    2015: ((15, 25, 35), "ASM-03 ngoại suy trước mốc 2017"),
    2016: ((22, 32, 42), "ASM-03 ngoại suy trước mốc 2017"),
    2017: ((39.7, 39.7, 39.7), "SRC-021"),
    2018: ((80, 95, 110), "ASM-03 nội suy 2017–2019"),
    2019: ((152, 157, 162), "SRC-020 (162), SRC-021 (152)"),
    2020: ((250, 255, 270), "SRC-022: >250 nghìn"),
    2021: ((288, 288, 288), "SRC-020, SRC-021"),
    2022: ((250, 290, 330), "ASM-03: thị phần ~9–10% × ASM-02"),
    2023: ((240, 280, 320), "ASM-03: thị phần ~9% × ASM-02"),
    2024: ((250, 270, 306), "SRC-020 thị phần ~9% × ASM-02 (2,8–3,4 triệu)"),
    2025: ((600, 735, 950), "SRC-011 (IEA ~735 nghìn, Unverified); cận dưới theo VinFast 406.498 xe (SRC-005)"),
}
# Ty trong pin Li trong xe may dien (phan con lai: ac quy chi) — ASM-05. Moc noi suy tuyen tinh.
LI_SHARE = {  # nam: (min, likely, max)
    2015: (0.03, 0.05, 0.08), 2019: (0.08, 0.10, 0.15), 2021: (0.20, 0.25, 0.30),
    2022: (0.35, 0.40, 0.45), 2024: (0.35, 0.40, 0.45), 2025: (0.55, 0.65, 0.75),
    2030: (0.75, 0.85, 0.95), 2035: (0.85, 0.90, 0.97),
}
# --- Doanh so o to dien (BEV) tai VN (nghin xe/nam) — ASM-04 ---
CAR_HIST = {
    2021: ((0.2, 0.3, 0.5), "SRC-007 (VF e34 giao từ 12/2021)"),
    2022: ((4, 5, 6), "SRC-005–007 suy từ lũy kế VinFast"),
    2023: ((28, 33, 36), "SRC-007: VinFast 34,9 nghìn EV toàn cầu"),
    2024: ((85, 92, 100), "SRC-006: VinFast 97,3 nghìn EV toàn cầu; VN ~90% + hãng khác"),
    2025: ((165, 185, 205), "SRC-013: VinFast VN ~170 nghìn + hãng khác 3–8%"),
}
# --- Kich ban 2026-2035 (nghin xe/nam), moc noi suy tuyen tinh — ASM-06, ASM-19 ---
E2W_SCEN = {"Chậm": {2026: 850, 2030: 1100, 2035: 1400},
            "Cơ sở": {2026: 1000, 2030: 1400, 2035: 2000},
            "Nhanh": {2026: 1200, 2030: 2000, 2035: 2800}}
CAR_SCEN = {"Chậm": {2026: 200, 2030: 280, 2035: 400},
            "Cơ sở": {2026: 240, 2030: 380, 2035: 600},
            "Nhanh": {2026: 280, 2030: 500, 2035: 850}}
# Ty trong Li tuong lai theo kich ban: Cham dung min, Co so likely, Nhanh max (Monte Carlo van lay mau quanh do)

# --- Thong so pack: (kWh min, likely, max), (kg min, likely, max) — ASM-07 ---
PACK = {"e2W-Li": ((1.2, 1.8, 3.0), (9, 13.5, 22)),
        "e2W-Chì": ((0.9, 1.2, 1.6), (27, 34, 45)),
        "Ô tô-Li": ((25, 40, 60), (170, 260, 390))}
# --- Tuoi tho pin Weibull: trung binh nam (min, likely, max), k (min, likely, max) — ASM-08 ---
BATT_LIFE = {"e2W-Li": ((4, 6, 8), (2.5, 3.0, 4.0)),
             "e2W-Chì": ((1.5, 2, 3), (2.5, 3.0, 4.0)),
             "Ô tô-Li": ((10, 12, 15), (2.5, 3.6, 4.0))}
# --- Tuoi tho phuong tien Weibull — ASM-09 (k = 3,6 theo SRC-019) ---
VEH_LIFE = {"e2W": ((8, 10, 13), 3.6), "Ô tô": ((13, 15, 18), 3.6)}
# --- Ty le du dieu kien doi thu hai (chi pin Li) — ASM-10 ---
SECOND_LIFE = {"e2W-Li": (0.20, 0.35, 0.50), "e2W-Chì": (0.0, 0.0, 0.0), "Ô tô-Li": (0.40, 0.55, 0.70)}
# --- Ty le thu hoi chinh thuc: (2025, 2035) min/likely/max — ASM-11. Ac quy chi giu muc thap hon ---
FORMAL = {"Li": {2025: (0.05, 0.10, 0.20), 2035: (0.35, 0.60, 0.80)},
          "Chì": {2025: (0.05, 0.15, 0.30), 2035: (0.20, 0.40, 0.60)}}
# --- Nguong cong suat tai che de tra loi RQ3 (nghin tan pin Li/nam) — DEC-07, ASM-12 ---
CAPACITY_THRESHOLDS_KT = [2, 5, 10, 30]
MAX_AGE = 30
