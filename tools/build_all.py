"""Chay lai toan bo du an theo thu tu va kiem tra. Chay: .venv/Scripts/python tools/build_all.py [--nhanh]
--nhanh: Monte Carlo 200 luot thay vi 1.000 (chi de thu nhanh; ban cong bo dung 1.000)."""
import os
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
PY = sys.executable
n = "200" if "--nhanh" in sys.argv else "1000"
STEPS = [
    [PY, "03-forecast/model/forecast.py", n],
    [PY, "03-forecast/model/sensitivity.py"],
    [PY, "03-forecast/model/charts.py"],
    [PY, "03-forecast/model/sankey.py"],
    [PY, "-m", "pytest", "-q", "tests"],
    [PY, "04-solution/synthetic/generator.py"],
    [PY, "05-ai-soh/soh_pipeline.py"],
    [PY, "07-business-case/model.py"],
    [PY, "07-business-case/report.py"],
    ["node", "06-test/e2e/run.js"],
    [PY, "tools/build_docs.py"],
    [PY, "08-package/build_site.py"],
    [PY, "tools/check_all.py"],
]
for cmd in STEPS:
    print("==>", " ".join(cmd[1:] if cmd[0] == PY else cmd))
    r = subprocess.run(cmd, cwd=ROOT, env=os.environ.copy())
    if r.returncode:
        sys.exit(f"Dung o buoc: {' '.join(cmd)}")
print("Hoan tat: moi buoc dat.")
