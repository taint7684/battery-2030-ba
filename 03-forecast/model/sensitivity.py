"""S11 - Phan tich do nhay va doi chieu nguon.
Chay: .venv/Scripts/python 03-forecast/model/sensitivity.py -> 03-forecast/outputs/{lifetime_shift,tornado,benchmark}.csv"""
import copy
import sys
from pathlib import Path

import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, str(Path(__file__).resolve().parent))
import forecast as F  # noqa: E402
import params as P  # noqa: E402

OUT = F.OUT
LI = ["e2W-Li", "Ô tô-Li"]


def li_series(df):
    return df[df.segment.isin(LI)].groupby("year").eol_t.sum()


def metrics(df):
    s = li_series(df)
    return {"li_eol_2030_t": s[2030], "li_eol_2035_t": s[2035],
            "year_over_10kt": F.first_year_over(s.to_dict(), 10_000),
            "year_over_30kt": F.first_year_over(s.to_dict(), 30_000)}


def lifetime_shift():
    rows = []
    for sc in P.SCENARIOS:
        for shift in (-2, 0, 2):
            d = F.draw_params()
            for s in LI:
                d[s]["b_mean"] = max(1.0, d[s]["b_mean"] + shift)
            rows.append({"scenario": sc, "shift_years": shift, **metrics(F.simulate(sc, d))})
    return pd.DataFrame(rows)


def tornado(scen="Cơ sở"):
    base = metrics(F.simulate(scen, F.draw_params()))["li_eol_2030_t"]
    tests = {  # ten tham so: (ham gan gia tri min, ham gan gia tri max)
        "Doanh số xe máy điện lịch sử (ASM-02/03)": ("u_hist", None),
        "Tỷ trọng pin Li xe máy (ASM-05)": ("u_li", None),
        "Doanh số ô tô điện lịch sử (ASM-04)": ("u_car", None),
    }
    rows = []
    for name, (key, _) in tests.items():
        vals = []
        for u in (0.0, 1.0):
            d = F.draw_params()
            d[key] = u
            vals.append(metrics(F.simulate(scen, d))["li_eol_2030_t"])
        rows.append({"parameter": name, "low": vals[0], "high": vals[1]})
    seg_tests = [("Khối lượng pack xe máy Li (ASM-07)", "e2W-Li", "kg", P.PACK["e2W-Li"][1]),
                 ("Khối lượng pack ô tô (ASM-07)", "Ô tô-Li", "kg", P.PACK["Ô tô-Li"][1]),
                 ("Tuổi thọ pin xe máy Li (ASM-08)", "e2W-Li", "b_mean", P.BATT_LIFE["e2W-Li"][0]),
                 ("Hệ số k pin xe máy Li (ASM-08)", "e2W-Li", "b_k", P.BATT_LIFE["e2W-Li"][1]),
                 ("Tuổi thọ pin ô tô (ASM-08)", "Ô tô-Li", "b_mean", P.BATT_LIFE["Ô tô-Li"][0])]
    for name, s, field, rng in seg_tests:
        vals = []
        for v in (rng[0], rng[2]):
            d = F.draw_params()
            d[s][field] = v
            vals.append(metrics(F.simulate(scen, d))["li_eol_2030_t"])
        rows.append({"parameter": name, "low": vals[0], "high": vals[1]})
    for name, veh in [("Tuổi thọ xe máy (ASM-09)", "e2W"), ("Tuổi thọ ô tô (ASM-09)", "Ô tô")]:
        vals = []
        for v in (P.VEH_LIFE[veh][0][0], P.VEH_LIFE[veh][0][2]):
            d = F.draw_params()
            d["veh_" + veh] = v
            vals.append(metrics(F.simulate(scen, d))["li_eol_2030_t"])
        rows.append({"parameter": name, "low": vals[0], "high": vals[1]})
    t = pd.DataFrame(rows)
    t["base"] = base
    t["swing"] = (t.high - t.low).abs()
    return t.sort_values("swing", ascending=False).reset_index(drop=True)


def benchmark():
    df = F.simulate("Cơ sở", F.draw_params())
    sales = F.sales_by_segment("Cơ sở", F.draw_params())
    li_cum_2025 = sum(sales["e2W-Li"][y] for y in range(2015, 2026))
    li_cum_2022 = sum(sales["e2W-Li"][y] for y in range(2015, 2023))
    placed_gwh = sum((df[(df.year == y) & df.segment.isin(LI)].assign(
        g=lambda x: (x.placed_new_units + x.placed_repl_units) * x.segment.map(
            {s: F.draw_params()[s]["kwh"] for s in LI}) / 1e6).g.sum()) for y in range(2021, 2031))
    units_2030 = df[(df.year == 2030) & df.segment.isin(LI)].eval("placed_new_units + placed_repl_units").sum()
    rows = [
        ("Xe máy điện Li bán 2023 (mô hình) ≥ VinFast giao 2023", sales["e2W-Li"][2023], 70_300, "SRC-007", sales["e2W-Li"][2023] >= 70_300),
        ("Xe máy điện Li bán 2024 (mô hình) ≥ VinFast giao 2024", sales["e2W-Li"][2024], 70_980, "SRC-006", sales["e2W-Li"][2024] >= 70_980),
        ("Xe máy điện Li bán 2025 (mô hình) ≥ VinFast giao 2025", sales["e2W-Li"][2025], 406_498, "SRC-005", sales["e2W-Li"][2025] >= 406_498),
        ("Lũy kế xe máy Li 2015–2022 (mô hình) ≥ VinFast lũy kế đến 2022", li_cum_2022, 162_000, "SRC-007 (232.300 − 70.300)", li_cum_2022 >= 162_000),
        ("Lũy kế xe máy Li 2015–2025 (mô hình) ≥ VinFast lũy kế xe hai bánh", li_cum_2025, 709_775, "SRC-005", li_cum_2025 >= 709_775),
        ("Pin Li đưa ra thị trường lũy kế 2021–2030 (GWh) so với World Bank ~100 GWh năm 2030", placed_gwh, 100, "SRC-008 (thứ cấp)", None),
        ("Số pin Li đưa ra thị trường năm 2030 so với World Bank ~2 triệu pin", units_2030, 2_000_000, "SRC-008 (thứ cấp)", None),
    ]
    return pd.DataFrame(rows, columns=["check", "model", "reference", "source", "pass"])


if __name__ == "__main__":
    ls = lifetime_shift()
    ls.round(1).to_csv(OUT / "lifetime_shift.csv", index=False, encoding="utf-8", lineterminator="\n")
    tn = tornado()
    tn.round(1).to_csv(OUT / "tornado.csv", index=False, encoding="utf-8", lineterminator="\n")
    bm = benchmark()
    bm.round(1).to_csv(OUT / "benchmark.csv", index=False, encoding="utf-8", lineterminator="\n")
    print(ls.round(0).to_string()); print(tn.round(0).to_string()); print(bm.round(1).to_string())
