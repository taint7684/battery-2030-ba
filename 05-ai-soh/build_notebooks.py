"""Sinh va chay 4 notebook demo SoH (luu kem ket qua). Chay: .venv/Scripts/python 05-ai-soh/build_notebooks.py"""
import sys
from pathlib import Path

import nbformat as nbf
from nbconvert.preprocessors import ExecutePreprocessor

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parent
NB = BASE / "notebooks"
NB.mkdir(exist_ok=True)
SETUP = ("import sys, json\nsys.path.insert(0, '..')\nimport numpy as np, pandas as pd, matplotlib.pyplot as plt\n"
         "import soh_pipeline as S\nplt.rcParams.update({'figure.figsize': (8, 4), 'axes.spines.top': False, 'axes.spines.right': False, 'axes.grid': True, 'grid.color': '#e4e3df'})\n"
         "COL = {'B0005': '#2a78d6', 'B0006': '#eb6834', 'B0007': '#1baf7a', 'B0018': '#6250d6'}")
NOTEBOOKS = {
    "01-eda.ipynb": [
        ("md", "# 01 — Khám phá dữ liệu NASA PCoE\n\nBốn cell Li-ion 18650 dung lượng danh định 2,0 Ah (B0005, B0006, B0007, B0018), chạy sạc CC-CV và xả CC 2 A ở 24°C đến khi dung lượng giảm 30% (README của bộ dữ liệu, SRC-016).\n\n**SoH** = dung lượng xả / 2,0 Ah × 100."),
        ("code", SETUP + "\ndf = S.dataset()\ndf.groupby('cell').agg(chu_ky=('full_cycles', 'max'), soh_dau=('soh', 'first'), soh_cuoi=('soh', 'last')).round(1)"),
        ("code", "fig, ax = plt.subplots()\nfor c, g in df.groupby('cell'):\n    ax.plot(g.full_cycles, g.soh, color=COL[c], lw=2, label=c)\nax.axhline(70, color='#888', ls=':'); ax.text(2, 71, 'ngưỡng điều phối PAR-07 = 70%', color='#555')\nax.axhline(80, color='#888', ls=':'); ax.text(2, 81, '80% (độ nhạy)', color='#555')\nax.set_xlabel('số chu kỳ'); ax.set_ylabel('SoH (%)'); ax.set_title('Suy giảm dung lượng theo chu kỳ', loc='left'); ax.legend(frameon=False)\nplt.tight_layout(); plt.savefig('../outputs/fig-fade.png', dpi=150); plt.show()"),
        ("md", "**Quan sát.** Dung lượng giảm gần tuyến tính, có các bước hồi phục ngắn sau thời gian nghỉ. Các cell dừng ở quanh 70% SoH, nên dữ liệu **ít điểm dưới 70%** — hạn chế cho bài toán quyết định ở ngưỡng 70%."),
    ],
    "02-features.ipynb": [
        ("md", "# 02 — Đặc trưng từ dữ liệu có thể đọc khi tiếp nhận\n\nChỉ dùng dữ liệu của **lần sạc liền trước** và **lần đo trở kháng gần nhất** — tương ứng tham số Phụ lục VII EU 2023/1542 (số chu kỳ, điện trở) và dữ liệu BMS ghi được. Không dùng dữ liệu xả (vì xả kiểm tra chính là phép đo tay tốn thời gian).\n\n| Đặc trưng | Ý nghĩa |\n|---|---|\n| full_cycles | Số chu kỳ tương đương |\n| cc_time_s | Thời gian sạc dòng không đổi đến 4,2 V |\n| cv_time_s | Thời gian sạc áp không đổi đến khi dòng < 0,5 A |\n| t_max_charge_c | Nhiệt độ cao nhất khi sạc |\n| v_start_charge | Điện áp lúc bắt đầu sạc |\n| re_ohm, rct_ohm | Điện trở điện phân và điện trở chuyển điện tích |"),
        ("code", SETUP + "\ndf = S.dataset()\ndf[S.FEATURES + ['soh']].corr()['soh'].drop('soh').round(2).sort_values()"),
        ("code", "fig, axs = plt.subplots(1, 2, figsize=(10, 4))\nfor c, g in df.groupby('cell'):\n    axs[0].scatter(g.cc_time_s, g.soh, s=8, color=COL[c], label=c)\n    axs[1].scatter(g.re_ohm, g.soh, s=8, color=COL[c])\naxs[0].set_xlabel('thời gian sạc CC (s)'); axs[1].set_xlabel('Re (ohm)'); axs[0].set_ylabel('SoH (%)'); axs[0].legend(frameon=False)\nplt.tight_layout(); plt.show()"),
        ("md", "**Quan sát.** Thời gian sạc CC giảm khi pin già (pin chạm 4,2 V sớm hơn), tương quan mạnh với SoH. Điện trở tăng theo tuổi nhưng chỉ đo định kỳ, nên mang ít thông tin hơn."),
    ],
    "03-model.ipynb": [
        ("md", "# 03 — Mô hình và khoảng tin cậy\n\n- **Mô hình điểm:** Gradient Boosting.\n- **Đường cơ sở:** hồi quy tuyến tính theo số chu kỳ; hồi quy tuyến tính đủ đặc trưng.\n- **Khoảng tin cậy 90%:** Conformalized Quantile Regression — học phân vị 5% và 95%, hiệu chỉnh bằng một cell riêng để đảm bảo độ phủ.\n- **Kiểm định:** để riêng từng cell (leave-one-battery-out), tránh rò rỉ dữ liệu giữa các chu kỳ của cùng một pin."),
        ("code", SETUP + "\ndf = S.dataset()\np, m = S.evaluate(df)\npd.Series({'MAE Gradient Boosting': m['mae'], 'MAE tuyến tính đủ đặc trưng': m['mae_baseline_linear_all'], 'MAE tuyến tính theo chu kỳ': m['mae_baseline_cycles_only'], 'RMSE': m['rmse'], 'Độ phủ khoảng 90%': m['coverage_90'], 'Độ rộng TB (điểm %)': m['mean_width']}).round(3)"),
        ("code", "g = p[p.cell == 'B0006']\nfig, ax = plt.subplots()\nax.fill_between(g.full_cycles, g.lo, g.hi, color='#86b6ef', alpha=.5, lw=0, label='khoảng 90% (CQR)')\nax.plot(g.full_cycles, g.soh, color='#0b0b0b', lw=1.5, label='SoH thực')\nax.plot(g.full_cycles, g.pred, color='#2a78d6', lw=2, label='SoH dự đoán')\nax.axhline(70, color='#888', ls=':')\nax.set_xlabel('chu kỳ'); ax.set_ylabel('SoH (%)'); ax.set_title('Cell B0006 (để riêng khi huấn luyện)', loc='left'); ax.legend(frameon=False)\nplt.tight_layout(); plt.savefig('../outputs/fig-pred-b0006.png', dpi=150); plt.show()"),
    ],
    "04-evaluation.ipynb": [
        ("md", "# 04 — Đánh giá theo yêu cầu AI (S18)\n\nÁp đúng quy tắc BR-10 của nền tảng: chuyển **đo tay** khi khoảng tin cậy rộng hơn 10 điểm hoặc chứa ngưỡng điều phối. Mục tiêu AIR-01…AIR-04 được đặt **trước khi đo**."),
        ("code", SETUP + "\nm = json.load(open('../outputs/metrics.json', encoding='utf-8'))\npd.DataFrame([\n  ['AIR-01', 'MAE ≤ 3,0 điểm', round(m['mae'], 2), m['pass']['AIR-01 MAE']],\n  ['AIR-02', 'Độ phủ khoảng 90% ≥ 85%', round(m['coverage_90'], 3), m['pass']['AIR-02 coverage']],\n  ['AIR-03', 'Độ chính xác quyết định tự động ≥ 97% (ngưỡng 70%)', round(m['auto_accuracy'], 3), m['pass']['AIR-03 auto accuracy']],\n  ['AIR-04', 'Tỷ lệ chuyển đo tay ≤ 30%', round(m['manual_rate'], 3), m['pass']['AIR-04 manual rate']],\n], columns=['Mã', 'Yêu cầu', 'Đo được', 'Đạt'])"),
        ("code", "pd.DataFrame({'Ngưỡng 70%': [m['manual_rate'], m['auto_accuracy'], m['accuracy_without_review']], 'Ngưỡng 80%': [m['sensitivity_threshold_80'][k] for k in ('manual_rate', 'auto_accuracy', 'accuracy_without_review')]}, index=['Tỷ lệ đo tay', 'Độ chính xác khi tự động', 'Độ chính xác nếu bỏ bước người duyệt']).round(3)"),
        ("md", "**Kết luận.** Mô hình đạt yêu cầu độ chính xác (AIR-01, AIR-02) nhưng **chưa đạt yêu cầu vận hành** (AIR-03, AIR-04) trên dữ liệu demo: khoảng tin cậy còn rộng vì chỉ có 4 cell, và dữ liệu NASA dừng quanh 70% SoH — đúng vùng ngưỡng quyết định. Nếu bỏ bước người duyệt, độ chính xác phân loại ở ngưỡng 70% chỉ khoảng 79%. Quy tắc BR-10 làm đúng việc của nó: chặn quyết định tự động khi mô hình không chắc.\n\n→ Quyết định DEC-11: ở MVP mô hình chạy **chế độ song song (shadow)**, mọi pin đo tay; chỉ bật quyết định tự động khi AIR-03 và AIR-04 đạt trên dữ liệu pack của VELIX."),
    ],
}

for name, cells in NOTEBOOKS.items():
    nb = nbf.v4.new_notebook()
    nb.cells = [nbf.v4.new_markdown_cell(c) if k == "md" else nbf.v4.new_code_cell(c) for k, c in cells]
    nb.metadata["kernelspec"] = {"name": "python3", "display_name": "Python 3", "language": "python"}
    ExecutePreprocessor(timeout=900, kernel_name="python3").preprocess(nb, {"metadata": {"path": str(NB)}})
    nbf.write(nb, NB / name)
    print("ok", name)
