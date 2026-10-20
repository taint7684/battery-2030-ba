"""S21 - Business case 3 phuong an thuc hien EPR cua VELIX, 2027-2035.
A = Tu to chuc tai che (nen tang day du + mang thu hoi dai ly + doi thu hai)
B = Dong gop tai chinh vao Quy BVMT (F = R x V x Fs)
C = Uy quyen PRO (phi = ty le x so tien dong quy tuong duong)
Tinh rieng tung nhom Phu luc I (B.1.1 ac quy chi, B.2.1 pin Li) vi moi nhom duoc chon mot hinh thuc (BR-20).
Dau vao: du bao S9 (kich ban Co so, gia tri likely) x thi phan VELIX (ASM-13). Chi phi tinh bang trieu dong.
Chay: .venv/Scripts/python 07-business-case/model.py"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / "outputs"
YEARS = list(range(2027, 2036))
# (min, likely, max) theo so ghi gia dinh
A = {
    "share": (0.03, 0.05, 0.08),                       # ASM-13
    "fs_pb": (15000, 18278, 22000),                     # ASM-15 dong/kg
    "fs_li": (15000, 25000, 40000),                     # ASM-16
    "plat_full_capex": (2500, 3500, 5000), "plat_full_opex": (500, 700, 1000),   # ASM-21 trieu dong
    "plat_lite_capex": (500, 800, 1200), "plat_lite_opex": (150, 200, 300),
    "collect_li": (6000, 9000, 15000), "collect_pb": (2000, 4000, 6000),          # ASM-22 dong/kg
    "gate_li": (5000, 12000, 20000),                    # ASM-23
    "scrap_pb": (6000, 10000, 15000),                   # ASM-24
    "pro_ratio": (0.60, 0.75, 0.90),                    # ASM-25
    "sl_price": (600000, 1000000, 1500000),             # ASM-18 dong/kWh
    "sl_cost": (300000, 500000, 800000),                # ASM-26
    "sl_share": (0.20, 0.35, 0.50),                     # ASM-10 (xe may)
    "col_2027": (0.25, 0.40, 0.55), "col_2035": (0.55, 0.75, 0.90),               # ASM-27
    "disc": (0.08, 0.10, 0.12),                         # ASM-28
}
R_LI = {"Chính sách hiện hành (0%)": {y: 0.0 for y in YEARS},                                          # SRC-001
        "Dự thảo (8% từ 2029, 15% từ 2032)": {y: 0.0 if y < 2029 else (0.08 if y < 2032 else 0.15) for y in YEARS},  # SRC-009, ASM-17
        "Cao (10% từ 2029, 20% từ 2032)": {y: 0.0 if y < 2029 else (0.10 if y < 2032 else 0.20) for y in YEARS}}
R_PB = 0.12  # REQ-VN-15; gia dinh giu nguyen den 2035
KWH_PER_KG_LI = 1.8 / 13.5  # ASM-07 likely: 1,8 kWh / 13,5 kg

fc = pd.read_csv(ROOT / "03-forecast/outputs/eol_likely.csv")
fc = fc[(fc.scenario == "Cơ sở") & fc.year.isin(YEARS)].set_index(["segment", "year"])


def tri(t, u):
    a, c, b = t
    if u is None or a == b:
        return c
    fc_ = (c - a) / (b - a)
    return a + np.sqrt(u * (b - a) * (c - a)) if u < fc_ else b - np.sqrt((1 - u) * (b - a) * (b - c))


def draw(rng=None, over=None):
    p = {k: tri(v, None if rng is None else rng.random()) for k, v in A.items()}
    p.update(over or {})
    return p


def yearly(p, r_li):
    """Chi phi rong (trieu dong, duong = chi) theo nam, nhom, phuong an."""
    rows = []
    carry = {"Chì": 0.0, "Li": 0.0}
    for i, y in enumerate(YEARS):
        col = p["col_2027"] + (p["col_2035"] - p["col_2027"]) * i / (len(YEARS) - 1)
        for g, seg, R, fs in [("Chì", "e2W-Chì", R_PB, p["fs_pb"]), ("Li", "e2W-Li", r_li[y], p["fs_li"])]:
            V = fc.loc[(seg, y), "placed_t"] * 1000 * p["share"]          # kg
            eol = fc.loc[(seg, y), "eol_t"] * 1000 * p["share"]
            req = R * V
            fund = req * fs / 1e6                                          # trieu dong
            # Phuong an A
            got = eol * col
            if g == "Chì":
                recyc, sl_kg = got, 0.0
                varc = got * p["collect_pb"] - got * p["scrap_pb"]
            else:
                sl_kg = got * p["sl_share"]
                recyc = got - sl_kg
                varc = got * p["collect_li"] + recyc * p["gate_li"] - sl_kg * KWH_PER_KG_LI * (p["sl_price"] - p["sl_cost"])
            avail = recyc + carry[g]
            short = max(0.0, req - avail)                                  # thieu -> mua them qua don vi tai che (cung chi phi/kg)
            carry[g] = max(0.0, avail - req)                               # bao luu (BR-18, REQ-VN-13)
            unit = (p["collect_pb"] - p["scrap_pb"]) if g == "Chì" else (p["collect_li"] + p["gate_li"])
            a_cost = (varc + short * unit) / 1e6
            rows.append({"year": y, "group": g, "V_t": V / 1000, "eol_t": eol / 1000, "required_t": req / 1000, "collected_t": got / 1000,
                         "second_life_t": sl_kg / 1000, "carry_t": carry[g] / 1000, "A_var": a_cost, "B_fund": fund, "C_pro": fund * p["pro_ratio"]})
    return pd.DataFrame(rows)


def npv(df, p):
    """NPV chi phi (trieu dong, 2027 = nam 0) cho tung phuong an; nen tang chia deu cho hai nhom theo khoi luong V."""
    disc = {y: 1 / (1 + p["disc"]) ** i for i, y in enumerate(YEARS)}
    out = {}
    for g in ("Chì", "Li"):
        d = df[df.group == g]
        w = d.V_t.sum() / df.V_t.sum()
        full = (p["plat_full_capex"] + sum(p["plat_full_opex"] * disc[y] for y in YEARS)) * w
        lite = (p["plat_lite_capex"] + sum(p["plat_lite_opex"] * disc[y] for y in YEARS)) * w
        out[g] = {"A": full + sum(r.A_var * disc[r.year] for r in d.itertuples()),
                  "B": lite + sum(r.B_fund * disc[r.year] for r in d.itertuples()),
                  "C": lite + sum(r.C_pro * disc[r.year] for r in d.itertuples())}
    return out


def breakeven(param, lo, hi, policy, group="Li", target=("A", "B")):
    """Gia tri cua tham so tai do NPV(A) = NPV(B), tim nhi phan."""
    f = lambda v: (lambda n: n[group][target[0]] - n[group][target[1]])(npv(yearly(draw(over={param: v}), R_LI[policy]), draw(over={param: v})))
    a, b = lo, hi
    if f(a) * f(b) > 0:
        return None
    for _ in range(60):
        m = (a + b) / 2
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
    return (a + b) / 2


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    base = draw()
    res, ylist = [], []
    for pol, r in R_LI.items():
        d = yearly(base, r)
        d["policy"] = pol
        ylist.append(d)
        n = npv(d, base)
        for g in n:
            res.append({"policy": pol, "group": g, **{k: round(v, 0) for k, v in n[g].items()}})
    pd.concat(ylist).round(2).to_csv(OUT / "yearly_likely.csv", index=False, encoding="utf-8", lineterminator="\n")
    npv_df = pd.DataFrame(res)
    npv_df["best"] = npv_df[["A", "B", "C"]].idxmin(axis=1)
    npv_df.to_csv(OUT / "npv_likely.csv", index=False, encoding="utf-8", lineterminator="\n")
    # Monte Carlo: xac suat moi phuong an re nhat
    rng = np.random.default_rng(2030)
    mc = []
    for _ in range(2000):
        p = draw(rng)
        for pol, r in R_LI.items():
            n = npv(yearly(p, r), p)
            for g in n:
                mc.append({"policy": pol, "group": g, **n[g], "best": min(n[g], key=n[g].get)})
    mc = pd.DataFrame(mc)
    prob = mc.groupby(["policy", "group"]).best.value_counts(normalize=True).unstack(fill_value=0).round(3)
    prob.to_csv(OUT / "mc_best_option.csv", encoding="utf-8", lineterminator="\n")
    q = mc.groupby(["policy", "group"])[["A", "B", "C"]].quantile([0.1, 0.5, 0.9]).round(0)
    q.to_csv(OUT / "mc_npv_quantiles.csv", encoding="utf-8", lineterminator="\n")
    pol = "Dự thảo (8% từ 2029, 15% từ 2032)"
    be = {"sl_price_li": breakeven("sl_price", 300000, 3000000, pol),
          "col_2035_li": breakeven("col_2035", 0.05, 1.0, pol),
          "share_li": breakeven("share", 0.005, 0.30, pol),
          "scrap_pb_A_vs_B": breakeven("scrap_pb", 0, 30000, pol, group="Chì"),
          "sl_price_li_current_policy": breakeven("sl_price", 300000, 3000000, "Chính sách hiện hành (0%)"),
          "sl_price_li_A_vs_C_draft": breakeven("sl_price", 300000, 3000000, pol, target=("A", "C"))}
    # Hoan von: dong tien tich luy cua A so voi B (ca hai nhom, chinh sach du thao, likely)
    d = yearly(base, R_LI[pol]).groupby("year")[["A_var", "B_fund"]].sum()
    cum, rows_pb = 0.0, []
    for i, y in enumerate(YEARS):
        a = d.loc[y, "A_var"] + base["plat_full_opex"] + (base["plat_full_capex"] if i == 0 else 0)
        b = d.loc[y, "B_fund"] + base["plat_lite_opex"] + (base["plat_lite_capex"] if i == 0 else 0)
        cum += b - a
        rows_pb.append({"year": y, "A_cost": round(a), "B_cost": round(b), "saving": round(b - a), "cumulative_saving": round(cum)})
    pb = pd.DataFrame(rows_pb)
    pb.to_csv(OUT / "payback_A_vs_B.csv", index=False, encoding="utf-8", lineterminator="\n")
    be["payback_year_A_vs_B"] = int(pb[pb.cumulative_saving > 0].year.min()) if (pb.cumulative_saving > 0).any() else None
    # Do nhay chenh lech NPV(A) - NPV(B) cho pin Li, chinh sach du thao
    tor = []
    for k, (lo, ml, hi) in A.items():
        vals = []
        for v in (lo, hi):
            p = draw(over={k: v})
            n = npv(yearly(p, R_LI[pol]), p)["Li"]
            vals.append(n["A"] - n["B"])
        tor.append({"param": k, "low": vals[0], "high": vals[1], "swing": abs(vals[1] - vals[0])})
    tor = pd.DataFrame(tor).sort_values("swing", ascending=False)
    tor.round(0).to_csv(OUT / "tornado_li_A_minus_B.csv", index=False, encoding="utf-8", lineterminator="\n")
    (OUT / "breakeven.json").write_text(json.dumps(be, ensure_ascii=False, indent=1), encoding="utf-8")
    print(npv_df.to_string()); print(prob.to_string()); print(be); print(tor.head(6).round(0).to_string())
