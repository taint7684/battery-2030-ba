"""S17 - Demo uoc luong SoH tu du lieu sac/xa NASA PCoE (SRC-016).
Dac trung chi lay tu chu ky SAC lien truoc va lan do tro khang gan nhat (du lieu BMS co the doc khi tiep nhan, khong can xa kiem tra).
Muc tieu: SoH = dung luong xa / 2,0 Ah danh dinh x 100.
Danh gia: leave-one-battery-out (4 lan); khoang tin cay 90% bang Conformalized Quantile Regression (CQR).
Chay: .venv/Scripts/python 05-ai-soh/soh_pipeline.py -> 05-ai-soh/outputs/"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import scipy.io as sio
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import LinearRegression

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parent
RAW = BASE / "data" / "raw" / "nasa" / "5. Battery Data Set" / "fy08"
OUT = BASE / "outputs"
CELLS = ["B0005", "B0006", "B0007", "B0018"]
RATED_AH = 2.0
FEATURES = ["full_cycles", "cc_time_s", "cv_time_s", "t_max_charge_c", "v_start_charge", "re_ohm", "rct_ohm"]
# Muc tieu AI (S18 AIR-01..AIR-04) - dat TRUOC khi do
TARGETS = {"mae_max": 3.0, "coverage_min": 0.85, "auto_acc_min": 0.97, "manual_rate_max": 0.30}
SEED = 2030


def load_cell(cell):
    m = sio.loadmat(RAW / f"{cell}.mat", simplify_cells=True)
    return m[cell]["cycle"]


def build_features(cell):
    """Moi dong = mot chu ky xa; dac trung tu chu ky sac ngay truoc no va do tro khang gan nhat."""
    rows, last_charge, last_imp, n = [], None, (np.nan, np.nan), 0
    for c in load_cell(cell):
        d = c["data"]
        if c["type"] == "charge":
            last_charge = d
        elif c["type"] == "impedance":
            re_, rct = d.get("Re"), d.get("Rct")
            if np.isscalar(re_) and np.isscalar(rct) and 0 < re_ < 1 and 0 < rct < 1:
                last_imp = (float(re_), float(rct))
        elif c["type"] == "discharge" and np.size(d.get("Capacity", [])) == 1:
            n += 1
            f = {"cell": cell, "full_cycles": n, "soh": float(d["Capacity"]) / RATED_AH * 100,
                 "re_ohm": last_imp[0], "rct_ohm": last_imp[1]}
            if last_charge is not None and np.size(last_charge["Time"]) > 50:
                t, v, i, temp = (np.asarray(last_charge[k], float) for k in ("Time", "Voltage_measured", "Current_measured", "Temperature_measured"))
                k_cc = np.argmax(v >= 4.2) if (v >= 4.2).any() else None
                if k_cc:
                    after = np.where((t > t[k_cc]) & (i < 0.5))[0]
                    f.update({"cc_time_s": t[k_cc] - t[0], "cv_time_s": (t[after[0]] - t[k_cc]) if len(after) else np.nan,
                              "t_max_charge_c": temp.max(), "v_start_charge": v[0]})
            rows.append(f)
    return pd.DataFrame(rows)


def dataset():
    df = pd.concat([build_features(c) for c in CELLS], ignore_index=True)
    return df.dropna(subset=FEATURES).reset_index(drop=True)


def gbr(**kw):
    return GradientBoostingRegressor(n_estimators=300, max_depth=3, learning_rate=0.05, subsample=0.8, random_state=SEED, **kw)


def cqr_fit_predict(train, test, alpha=0.10):
    """CQR: hoc quantile 5%/95% tren mot phan train, hieu chinh bang phan con lai (pin rieng biet)."""
    cells = sorted(train.cell.unique())
    cal_cell = cells[-1]
    fit, cal = train[train.cell != cal_cell], train[train.cell == cal_cell]
    lo_m = gbr(loss="quantile", alpha=alpha / 2).fit(fit[FEATURES], fit.soh)
    hi_m = gbr(loss="quantile", alpha=1 - alpha / 2).fit(fit[FEATURES], fit.soh)
    s = np.maximum(lo_m.predict(cal[FEATURES]) - cal.soh, cal.soh - hi_m.predict(cal[FEATURES]))
    q = np.quantile(s, min(1, (1 - alpha) * (1 + 1 / len(s))))
    return lo_m.predict(test[FEATURES]) - q, hi_m.predict(test[FEATURES]) + q


def evaluate(df, threshold=70.0, max_width=10.0):
    preds = []
    for cell in CELLS:  # leave-one-battery-out
        tr, te = df[df.cell != cell], df[df.cell == cell].copy()
        point = gbr().fit(tr[FEATURES], tr.soh)
        base1 = LinearRegression().fit(tr[["full_cycles"]], tr.soh)
        base2 = LinearRegression().fit(tr[FEATURES], tr.soh)
        te["pred"] = point.predict(te[FEATURES])
        te["pred_lr_cycles"] = base1.predict(te[["full_cycles"]])
        te["pred_lr_all"] = base2.predict(te[FEATURES])
        te["lo"], te["hi"] = cqr_fit_predict(tr, te)
        preds.append(te)
    p = pd.concat(preds, ignore_index=True)
    p["lo"] = np.minimum(p["lo"], p["pred"])
    p["hi"] = np.maximum(p["hi"], p["pred"])
    err = p.pred - p.soh

    def mae(col):
        return float(np.mean(np.abs(p[col] - p.soh)))
    cover = float(np.mean((p.soh >= p.lo) & (p.soh <= p.hi)))
    width = p.hi - p.lo
    # Quy tac BR-10 ap len demo: rong > max_width hoac khoang chua nguong -> do tay
    manual = (width > max_width) | ((p.lo <= threshold) & (threshold <= p.hi))
    auto = ~manual
    true_cls, pred_cls = p.soh >= threshold, p.pred >= threshold
    m = {"n_cycles": int(len(p)), "cells": CELLS, "threshold_pct": threshold, "max_width_pts": max_width,
         "mae": float(np.mean(np.abs(err))), "rmse": float(np.sqrt(np.mean(err ** 2))),
         "mae_baseline_cycles_only": mae("pred_lr_cycles"), "mae_baseline_linear_all": mae("pred_lr_all"),
         "coverage_90": cover, "mean_width": float(width.mean()),
         "manual_rate": float(manual.mean()), "auto_accuracy": float((true_cls[auto] == pred_cls[auto]).mean()),
         "accuracy_without_review": float((true_cls == pred_cls).mean()),
         "per_cell_mae": {c: float(np.mean(np.abs(g.pred - g.soh))) for c, g in p.groupby("cell")}}
    m["targets"] = TARGETS
    m["pass"] = {"AIR-01 MAE": m["mae"] <= TARGETS["mae_max"], "AIR-02 coverage": m["coverage_90"] >= TARGETS["coverage_min"],
                 "AIR-03 auto accuracy": m["auto_accuracy"] >= TARGETS["auto_acc_min"], "AIR-04 manual rate": m["manual_rate"] <= TARGETS["manual_rate_max"]}
    p["manual"] = manual
    return p, m


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    df = dataset()
    df.round(5).to_csv(OUT / "features.csv", index=False, encoding="utf-8", lineterminator="\n")
    p, m = evaluate(df)  # nguong PAR-07 = 70% cua he thong
    _, m80 = evaluate(df, threshold=80.0)
    m["sensitivity_threshold_80"] = {k: m80[k] for k in ("manual_rate", "auto_accuracy", "accuracy_without_review")}
    p.round(3).to_csv(OUT / "predictions.csv", index=False, encoding="utf-8", lineterminator="\n")
    (OUT / "metrics.json").write_text(json.dumps(m, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(m, ensure_ascii=False, indent=1))
