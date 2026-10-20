"""Ve bieu do PNG cho tai lieu S9-S11 (che do sang). Mau theo bang mau tham chieu da kiem dinh
(slot 1 xanh duong, 2 cam, 3 xanh ngoc - 3 slot dau dat moi cap). Chay sau forecast.py va sensitivity.py."""
import json
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
OUT = Path(__file__).resolve().parents[1] / "outputs"
SEG_COLOR = {"e2W-Li": "#2a78d6", "e2W-Chì": "#eb6834", "Ô tô-Li": "#1baf7a"}
SEG_LABEL = {"e2W-Li": "Xe máy — pin Li", "e2W-Chì": "Xe máy — ắc quy chì", "Ô tô-Li": "Ô tô — pin Li"}
INK, INK2, GRID, SURF = "#0b0b0b", "#52514e", "#e4e3df", "#fcfcfb"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10, "axes.edgecolor": GRID, "axes.labelcolor": INK2,
                     "xtick.color": INK2, "ytick.color": INK2, "axes.spines.top": False, "axes.spines.right": False,
                     "figure.facecolor": SURF, "axes.facecolor": SURF, "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.6})


def kt(x):
    return x / 1000


def fig_segments(lk):
    d = lk[(lk.scenario == "Cơ sở") & lk.year.between(2025, 2035)]
    fig, ax = plt.subplots(figsize=(8, 4.2))
    bottom = None
    years = sorted(d.year.unique())
    for s in ["e2W-Chì", "e2W-Li", "Ô tô-Li"]:
        v = d[d.segment == s].set_index("year").loc[years, "eol_t"].map(kt).values
        ax.bar(years, v, bottom=bottom, color=SEG_COLOR[s], width=0.72, label=SEG_LABEL[s], edgecolor=SURF, linewidth=2)
        bottom = v if bottom is None else bottom + v
    ax.set_ylabel("nghìn tấn pin hết hạn / năm")
    ax.set_title("Pin hết hạn theo phân khúc — kịch bản Cơ sở (giá trị likely)", loc="left", color=INK, fontsize=11)
    ax.legend(frameon=False, loc="upper left")
    ax.set_xticks(years)
    fig.tight_layout(); fig.savefig(OUT / "fig-eol-segments.png", dpi=160); plt.close(fig)


def fig_fan(ms):
    fig, ax = plt.subplots(figsize=(8, 4.2))
    b = ms[(ms.metric == "Li_eol_t") & (ms.scenario == "Cơ sở") & ms.year.between(2025, 2035)]
    ax.fill_between(b.year, kt(b.p10), kt(b.p90), color="#86b6ef", alpha=0.45, linewidth=0, label="Cơ sở: khoảng P10–P90")
    styles = {"Chậm": ("#52514e", (0, (4, 3))), "Cơ sở": ("#2a78d6", "solid"), "Nhanh": ("#52514e", (0, (1, 2)))}
    for sc, (c, ls) in styles.items():
        m = ms[(ms.metric == "Li_eol_t") & (ms.scenario == sc) & ms.year.between(2025, 2035)]
        ax.plot(m.year, kt(m.p50), color=c, linestyle=ls, linewidth=2, label=f"{sc}: trung vị (P50)")
        ax.annotate(f"{sc} {kt(m.p50.iloc[-1]):.0f}", (2035, kt(m.p50.iloc[-1])), xytext=(4, 0), textcoords="offset points",
                    va="center", color=INK2, fontsize=9)
    for th in (10, 30):
        ax.axhline(th, color="#a8a7a1", linewidth=1, linestyle=(0, (2, 2)))
        ax.text(2025.1, th + 1, f"ngưỡng {th} nghìn t/năm", color=INK2, fontsize=8)
    ax.set_xlim(2025, 2036.3); ax.set_xticks(range(2025, 2036))
    ax.set_ylabel("nghìn tấn pin Li hết hạn / năm")
    ax.set_title("Pin lithium hết hạn (xe máy + ô tô) — 3 kịch bản, 1.000 lượt Monte Carlo", loc="left", color=INK, fontsize=11)
    ax.legend(frameon=False, loc="upper left", fontsize=9)
    fig.tight_layout(); fig.savefig(OUT / "fig-li-fan.png", dpi=160); plt.close(fig)


def fig_tornado(tn):
    tn = tn.iloc[::-1]
    fig, ax = plt.subplots(figsize=(8, 4.4))
    base = tn.base.iloc[0]
    for i, r in enumerate(tn.itertuples()):
        lo, hi = sorted([r.low, r.high])
        ax.barh(i, kt(lo - base), left=kt(base), color="#eb6834", height=0.6)
        ax.barh(i, kt(hi - base), left=kt(base), color="#2a78d6", height=0.6)
    ax.axvline(kt(base), color=INK, linewidth=1)
    ax.set_yticks(range(len(tn))); ax.set_yticklabels(tn.parameter, fontsize=9)
    ax.set_xlabel("nghìn tấn pin Li hết hạn năm 2030 (kịch bản Cơ sở)")
    ax.set_title(f"Độ nhạy một tham số mỗi lần — gốc {kt(base):.1f} nghìn tấn".replace(".", ",") + f"", loc="left", color=INK, fontsize=11)
    ax.text(0.99, 0.02, "cam: phía giảm · xanh: phía tăng", transform=ax.transAxes, ha="right", color=INK2, fontsize=8)
    ax.grid(axis="y", visible=False)
    fig.tight_layout(); fig.savefig(OUT / "fig-tornado.png", dpi=160); plt.close(fig)


def fig_shift(ls_csv_lk):
    import forecast as F  # noqa: E402
    fig, ax = plt.subplots(figsize=(8, 4))
    for shift, c, st in [(-2, "#eb6834", "solid"), (0, "#2a78d6", "solid"), (2, "#1baf7a", "solid")]:
        d = F.draw_params()
        for s in ("e2W-Li", "Ô tô-Li"):
            d[s]["b_mean"] = max(1.0, d[s]["b_mean"] + shift)
        df = F.simulate("Cơ sở", d)
        s = df[df.segment.ne("e2W-Chì") & df.year.between(2025, 2035)].groupby("year").eol_t.sum()
        lab = {-2: "tuổi thọ −2 năm", 0: "tuổi thọ gốc", 2: "tuổi thọ +2 năm"}[shift]
        ax.plot(s.index, kt(s.values), color=c, linewidth=2, linestyle=st, label=lab)
        ax.annotate(f"{kt(s.iloc[-1]):.0f}", (2035, kt(s.iloc[-1])), xytext=(4, 0), textcoords="offset points", va="center", color=INK2, fontsize=9)
    ax.set_xticks(range(2025, 2036)); ax.set_xlim(2025, 2035.8)
    ax.set_ylabel("nghìn tấn pin Li hết hạn / năm")
    ax.set_title("Đổi tuổi thọ pin Li ±2 năm — kịch bản Cơ sở", loc="left", color=INK, fontsize=11)
    ax.legend(frameon=False, loc="upper left")
    fig.tight_layout(); fig.savefig(OUT / "fig-lifetime-shift.png", dpi=160); plt.close(fig)


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    lk = pd.read_csv(OUT / "eol_likely.csv")
    ms = pd.read_csv(OUT / "eol_mc_summary.csv")
    tn = pd.read_csv(OUT / "tornado.csv")
    fig_segments(lk); fig_fan(ms); fig_tornado(tn); fig_shift(None)
    print("da ve 4 bieu do")
