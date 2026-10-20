"""S9-S10 - Mo hinh du bao pin het han theo cohort x Weibull, co thay pin va thai bo phuong tien.
Chay: .venv/Scripts/python 03-forecast/model/forecast.py  -> ghi 03-forecast/outputs/
Mo hinh (moi cohort xe ban nam c, moi phan khuc):
  - Xe thai bo theo hazard Weibull cua phuong tien; pin trong xe thai bo -> het han.
  - Pin trong xe con song hong theo hazard Weibull cua pin; moi pin hong duoc thay pin moi (dua ra thi truong).
  - Can bang: pin dua ra thi truong = pin het han + pin dang dung (= xe con song).
"""
import json
import sys
from math import gamma
from pathlib import Path

import numpy as np
import pandas as pd

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, str(Path(__file__).resolve().parent))
import params as P  # noqa: E402

OUT = Path(__file__).resolve().parents[1] / "outputs"
VEH = {"e2W-Li": "e2W", "e2W-Chì": "e2W", "Ô tô-Li": "Ô tô"}
LIKELY = 0.5  # vi tri "likely" trong phan phoi tam giac khi chay tat dinh


def tri(lo_ml_hi, u):
    """Phan vi u cua phan phoi tam giac (min, mode, max); u=None -> tra mode."""
    a, c, b = lo_ml_hi
    if u is None or b == a:
        return c
    fc = (c - a) / (b - a)
    return a + np.sqrt(u * (b - a) * (c - a)) if u < fc else b - np.sqrt((1 - u) * (b - a) * (b - c))


def interp(anchors, year):
    ys = sorted(anchors)
    if year <= ys[0]:
        return anchors[ys[0]]
    if year >= ys[-1]:
        return anchors[ys[-1]]
    for y0, y1 in zip(ys, ys[1:]):
        if y0 <= year <= y1:
            w = (year - y0) / (y1 - y0)
            v0, v1 = anchors[y0], anchors[y1]
            if isinstance(v0, tuple):
                return tuple(a + w * (b - a) for a, b in zip(v0, v1))
            return v0 + w * (v1 - v0)


def weibull_cdf(t, mean, k):
    lam = mean / gamma(1 + 1 / k)
    t = np.maximum(np.asarray(t, dtype=float), 0)
    return 1 - np.exp(-(t / lam) ** k)


def hazard(mean, k, n=P.MAX_AGE + 2):
    """Xac suat hong trong nam tuoi a (0..n-1) voi dieu kien con song dau nam."""
    a = np.arange(n)
    F0, F1 = weibull_cdf(a, mean, k), weibull_cdf(a + 1, mean, k)
    h = (F1 - F0) / np.maximum(1 - F0, 1e-12)
    h[-1] = 1.0  # buoc het han o tuoi toi da
    return h


def draw_params(rng=None):
    """Mot bo tham so. rng=None -> bo 'likely' (tat dinh)."""
    u = (lambda: None) if rng is None else rng.random
    d = {"u_hist": u(), "u_car": u(), "u_li": u()}
    for s in P.SEGMENTS:
        uk = u()
        d[s] = {"kwh": tri(P.PACK[s][0], uk), "kg": tri(P.PACK[s][1], uk),  # kWh va kg dong bien
                "b_mean": tri(P.BATT_LIFE[s][0], u()), "b_k": tri(P.BATT_LIFE[s][1], u()),
                "sl": tri(P.SECOND_LIFE[s], u())}
    for v in VEH.values():
        d.setdefault("veh_" + v, tri(P.VEH_LIFE[v][0], u()))
    d["u_formal_li"], d["u_formal_pb"] = u(), u()
    return d


def sales_by_segment(scen, d):
    """Doanh so xe (chiec) theo phan khuc va nam."""
    out = {s: {} for s in P.SEGMENTS}
    li_anchor = {y: v for y, v in P.LI_SHARE.items()}
    pick = {"Chậm": 0, "Cơ sở": 1, "Nhanh": 2}[scen]
    for y in P.YEARS:
        if y <= 2025:
            e2w = tri(P.E2W_HIST[y][0], d["u_hist"]) * 1000
            li = tri(interp(li_anchor, y), d["u_li"])
            car = tri(P.CAR_HIST[y][0], d["u_car"]) * 1000 if y in P.CAR_HIST else 0.0
        else:
            e2w = interp(P.E2W_SCEN[scen], y) * 1000
            fut = {k: v for k, v in li_anchor.items() if k >= 2025}
            li = interp({k: (v[pick] if k > 2025 else tri(v, d["u_li"])) for k, v in fut.items()}, y)
            car = interp(P.CAR_SCEN[scen], y) * 1000
        out["e2W-Li"][y] = e2w * li
        out["e2W-Chì"][y] = e2w * (1 - li)
        out["Ô tô-Li"][y] = car
    return out


def formal_share(chem, year, u):
    a = P.FORMAL[chem]
    lo, hi = tri(a[2025], u), tri(a[2035], u)
    if year <= 2025:
        return lo
    if year >= 2035:
        return hi
    return lo + (year - 2025) / 10 * (hi - lo)


def simulate(scen, d):
    """Tra DataFrame theo phan khuc x nam: dua ra thi truong, het han, dang dung, dong chay."""
    sales = sales_by_segment(scen, d)
    years = P.YEARS
    idx = {y: i for i, y in enumerate(years)}
    rows = []
    for s in P.SEGMENTS:
        p = d[s]
        hv = hazard(d["veh_" + VEH[s]], P.VEH_LIFE[VEH[s]][1])
        hb = hazard(p["b_mean"], p["b_k"])
        n_y = len(years)
        new, repl, eol_fail, eol_scrap, stock = (np.zeros(n_y) for _ in range(5))
        for c in years:
            n = sales[s][c]
            if n <= 0:
                continue
            new[idx[c]] += n
            b = np.zeros(P.MAX_AGE + 2)  # pin dang dung trong xe con song, theo tuoi pin
            b[0] = n
            for t in range(0, years[-1] - c + 1):
                y = idx[c + t]
                scrap = b * hv[t]                # xe thai bo: pin di theo xe
                alive = b - scrap
                fail = alive * hb                # pin hong trong xe con song
                eol_scrap[y] += scrap.sum()
                eol_fail[y] += fail.sum()
                repl[y] += fail.sum()            # thay pin moi
                nb = np.zeros_like(b)
                nb[1:] = (alive - fail)[:-1]
                nb[0] = fail.sum()               # pin moi thay -> tuoi 0 nam sau
                nb[-1] += (alive - fail)[-1]
                b = nb
                stock[y] += b.sum()
        chem = "Chì" if s == "e2W-Chì" else "Li"
        for i, y in enumerate(years):
            eol = eol_fail[i] + eol_scrap[i]
            fs = formal_share(chem, y, d["u_formal_pb" if chem == "Chì" else "u_formal_li"])
            eol_t = eol * p["kg"] / 1000
            formal_t = eol_t * fs
            rows.append({"scenario": scen, "segment": s, "year": y,
                         "placed_new_units": new[i], "placed_repl_units": repl[i],
                         "placed_t": (new[i] + repl[i]) * p["kg"] / 1000,
                         "eol_units": eol, "eol_fail_units": eol_fail[i], "eol_scrap_units": eol_scrap[i],
                         "eol_t": eol_t, "eol_gwh": eol * p["kwh"] / 1e6, "stock_units": stock[i],
                         "formal_share": fs, "formal_t": formal_t, "informal_t": eol_t - formal_t,
                         "second_life_t": formal_t * p["sl"], "recycle_t": formal_t * (1 - p["sl"])})
    df = pd.DataFrame(rows)
    # Ty le thu gom kieu EU (REQ-EU-10): khoi luong thu gom chinh thuc nam t / binh quan dua ra thi truong 3 nam truoc
    df = df.sort_values(["segment", "year"])
    df["eu_collection_rate"] = df.groupby("segment")["formal_t"].transform(lambda x: x) / \
        df.groupby("segment")["placed_t"].transform(lambda x: x.shift(1).rolling(3).mean())
    return df.reset_index(drop=True)


def first_year_over(series_by_year, threshold):
    for y, v in series_by_year.items():
        if v >= threshold:
            return y
    return None


def run(n_mc=1000, seed=2030):
    OUT.mkdir(parents=True, exist_ok=True)
    likely = {sc: simulate(sc, draw_params()) for sc in P.SCENARIOS}
    lk = pd.concat(likely.values(), ignore_index=True)
    lk.round(4).to_csv(OUT / "eol_likely.csv", index=False, encoding="utf-8", lineterminator="\n")

    rng = np.random.default_rng(seed)
    rec = []
    for sc in P.SCENARIOS:
        for _ in range(n_mc):
            df = simulate(sc, draw_params(rng))
            g = df.assign(li=df.segment.ne("e2W-Chì")).groupby(["li", "year"])[["eol_t", "eol_gwh", "eol_units", "second_life_t"]].sum()
            li = g.loc[True]
            row = {"scenario": sc}
            for y in P.YEARS:
                row[f"li_t_{y}"] = li.loc[y, "eol_t"]
                row[f"li_gwh_{y}"] = li.loc[y, "eol_gwh"]
                row[f"pb_t_{y}"] = g.loc[(False, y), "eol_t"]
                row[f"sl_t_{y}"] = li.loc[y, "second_life_t"]
            rec.append(row)
    mc = pd.DataFrame(rec)
    summ = []
    for sc in P.SCENARIOS:
        m = mc[mc.scenario == sc]
        for y in P.YEARS:
            for metric, col in [("Li_eol_t", f"li_t_{y}"), ("Li_eol_gwh", f"li_gwh_{y}"), ("Chì_eol_t", f"pb_t_{y}"), ("Li_second_life_t", f"sl_t_{y}")]:
                q = m[col].quantile([0.1, 0.5, 0.9]).values
                summ.append({"scenario": sc, "metric": metric, "year": y, "p10": q[0], "p50": q[1], "p90": q[2]})
    ms = pd.DataFrame(summ)
    ms.round(4).to_csv(OUT / "eol_mc_summary.csv", index=False, encoding="utf-8", lineterminator="\n")

    # RQ3: nam pin Li het han vuot nguong cong suat (DEC-07) - theo tung luot mo phong
    cross = []
    for sc in P.SCENARIOS:
        m = mc[mc.scenario == sc]
        for th in P.CAPACITY_THRESHOLDS_KT:
            yrs = [first_year_over({y: r[f"li_t_{y}"] for y in P.YEARS}, th * 1000) for _, r in m.iterrows()]
            yrs_num = pd.Series([y if y else 9999 for y in yrs])
            q = yrs_num.quantile([0.1, 0.5, 0.9], interpolation="nearest").values
            lk_sc = lk[(lk.scenario == sc) & lk.segment.ne("e2W-Chì")].groupby("year").eol_t.sum()
            cross.append({"scenario": sc, "threshold_kt": th, "year_likely": first_year_over(lk_sc.to_dict(), th * 1000),
                          "year_p10": int(q[0]), "year_p50": int(q[1]), "year_p90": int(q[2]),
                          "share_runs_reached_by_2035": float(np.mean([y is not None for y in yrs]))})
    cr = pd.DataFrame(cross).replace(9999, "sau 2035")
    cr.to_csv(OUT / "crossover.csv", index=False, encoding="utf-8", lineterminator="\n")

    # Sankey 2030 (likely) cho tung kich ban
    sankey = {}
    for sc, df in likely.items():
        y = df[df.year == 2030].set_index("segment")
        nodes, links = [], []
        def nid(name):
            if name not in nodes:
                nodes.append(name)
            return nodes.index(name)
        for s in P.SEGMENTS:
            r = y.loc[s]
            links += [(f"Hết hạn: {s}", "Thu hồi chính thức", r.formal_t), (f"Hết hạn: {s}", "Phi chính thức / thất thoát", r.informal_t)]
            if r.second_life_t > 0:
                links.append(("Thu hồi chính thức", "Đời thứ hai", r.second_life_t))
        tot_formal = y.formal_t.sum()
        links.append(("Thu hồi chính thức", "Tái chế có phép", tot_formal - y.second_life_t.sum()))
        sankey[sc] = {"year": 2030, "unit": "tấn", "nodes": [], "links": []}
        for a, b, v in links:
            sankey[sc]["links"].append({"source": nid(a), "target": nid(b), "value": round(float(v), 1)})
        sankey[sc]["nodes"] = nodes
        sankey[sc]["placed_on_market_t"] = round(float(y.placed_t.sum()), 1)
        sankey[sc]["stock_units"] = round(float(y.stock_units.sum()))
    (OUT / "sankey_2030.json").write_text(json.dumps(sankey, ensure_ascii=False, indent=1), encoding="utf-8")
    return lk, ms, cr, sankey


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
    lk, ms, cr, sk = run(n_mc=n)
    base = lk[lk.scenario == "Cơ sở"]
    print(base[base.year.isin([2025, 2028, 2030, 2032, 2035])].groupby(["year", "segment"])[["placed_t", "eol_units", "eol_t", "eol_gwh"]].sum().round(0))
    print(cr)
