"""Bieu do va workbook cho S21. Chay sau model.py: .venv/Scripts/python 07-business-case/report.py"""
import csv
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parent
OUT = BASE / "outputs"
ROOT = BASE.parent
INK2, GRID, SURF = "#52514e", "#e4e3df", "#fcfcfb"
COL = {"A": "#2a78d6", "B": "#eb6834", "C": "#1baf7a"}
NAME = {"A": "A Tự tổ chức", "B": "B Đóng quỹ", "C": "C Ủy quyền PRO"}
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10, "axes.spines.top": False, "axes.spines.right": False, "figure.facecolor": SURF,
                     "axes.facecolor": SURF, "axes.grid": True, "grid.color": GRID, "axes.edgecolor": GRID, "xtick.color": INK2, "ytick.color": INK2})

npv = pd.read_csv(OUT / "npv_likely.csv")
pol = "Dự thảo (8% từ 2029, 15% từ 2032)"
d = npv[npv.policy == pol].set_index("group")
fig, axs = plt.subplots(1, 2, figsize=(9, 3.8), sharey=False)
for ax, g, title in [(axs[0], "Chì", "Ắc quy chì (B.1.1)"), (axs[1], "Li", "Pin Li (B.2.1)")]:
    vals = [d.loc[g, k] / 1000 for k in "ABC"]
    ax.bar([NAME[k] for k in "ABC"], vals, color=[COL[k] for k in "ABC"], width=0.6)
    ax.axhline(0, color="#0b0b0b", lw=0.8)
    for i, v in enumerate(vals):
        ax.text(i, v + (0.8 if v >= 0 else -0.8), f"{v:.1f}".replace(".", ","), ha="center", va="bottom" if v >= 0 else "top", color="#0b0b0b", fontsize=9)
    lo_, hi_ = min(vals + [0]), max(vals + [0]); ax.set_ylim(lo_ - (hi_ - lo_) * 0.15, hi_ + (hi_ - lo_) * 0.12)
    ax.set_title(title, loc="left", fontsize=11)
    ax.set_ylabel("NPV chi phí 2027–2035 (tỷ đồng)\nâm = có lãi")
    ax.tick_params(axis="x", labelsize=9)
fig.suptitle("NPV chi phí theo phương án — chính sách dự thảo, giá trị likely", x=0.01, ha="left", fontsize=11)
fig.tight_layout(); fig.savefig(OUT / "fig-npv.png", dpi=160); plt.close(fig)

tor = pd.read_csv(OUT / "tornado_li_A_minus_B.csv").head(8).iloc[::-1]
LBL = {"sl_price": "Giá pin đời thứ hai (ASM-18)", "sl_share": "Tỷ lệ đủ điều kiện đời thứ hai (ASM-10)", "sl_cost": "Chi phí tân trang (ASM-26)",
       "share": "Thị phần VELIX (ASM-13)", "fs_li": "Fs pin Li (ASM-16)", "gate_li": "Phí xử lý pin Li (ASM-23)", "col_2035": "Tỷ lệ thu hồi 2035 (ASM-27)",
       "col_2027": "Tỷ lệ thu hồi 2027 (ASM-27)", "collect_li": "Chi phí thu gom Li (ASM-22)", "plat_full_capex": "Đầu tư nền tảng (ASM-21)", "disc": "Chiết khấu (ASM-28)"}
fig, ax = plt.subplots(figsize=(8.5, 4))
for i, r in enumerate(tor.itertuples()):
    lo, hi = sorted([r.low / 1000, r.high / 1000])
    ax.barh(i, hi - lo, left=lo, color="#86b6ef", height=0.6)
ax.axvline(0, color="#eb6834", lw=1.5)
ax.text(0.3, len(tor) - 0.4, "← A rẻ hơn B   |   B rẻ hơn A →", color=INK2, fontsize=8)
ax.set_yticks(range(len(tor))); ax.set_yticklabels([LBL.get(p, p) for p in tor.param], fontsize=9)
ax.set_xlabel("NPV(A) − NPV(B), pin Li, tỷ đồng")
ax.set_title("Tham số quyết định lựa chọn cho pin Li", loc="left", fontsize=11)
ax.grid(axis="y", visible=False)
fig.tight_layout(); fig.savefig(OUT / "fig-tornado-li.png", dpi=160); plt.close(fig)

# Workbook: gia dinh, ket qua theo nam, NPV, xac suat
with pd.ExcelWriter(BASE / "cost-model.xlsx", engine="openpyxl") as xw:
    asm = pd.read_csv(ROOT / "00-management/assumptions-log.csv")
    asm[asm.id.isin([f"ASM-{i}" for i in (10, 13, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28)])].to_excel(xw, sheet_name="Gia dinh", index=False)
    pd.read_csv(OUT / "yearly_likely.csv").to_excel(xw, sheet_name="Theo nam (likely)", index=False)
    npv.to_excel(xw, sheet_name="NPV (trieu dong)", index=False)
    pd.read_csv(OUT / "mc_best_option.csv").to_excel(xw, sheet_name="Xac suat re nhat", index=False)
    pd.read_csv(OUT / "payback_A_vs_B.csv").to_excel(xw, sheet_name="Hoan von A vs B", index=False)
    pd.DataFrame([{"Ghi chu": "Workbook sinh tu 07-business-case/model.py + report.py. Don vi tien: trieu dong. Gia tri likely = moi tham so o mode; xac suat tu 2.000 luot Monte Carlo."}]).to_excel(xw, sheet_name="Doc truoc", index=False)
print("ok")
