"""Tai lai nguon goc vao cac thu muc raw/ (khong commit). Chay: .venv/Scripts/python tools/fetch_sources.py"""
import html
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
REG, DATA, NASA = ROOT / "02-regulatory/raw", ROOT / "03-forecast/data/raw", ROOT / "05-ai-soh/data/raw"
SEC_UA = {"User-Agent": "Battery2030Research admin@battery2030.example"}  # SEC yeu cau khai bao User-Agent
FILES = [
    (REG / "nd110-2026.pdf", "https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/110-ndcp.signed.pdf", {}),           # SRC-001
    (REG / "luat72-2020.pdf", "https://datafiles.chinhphu.vn/cpp/files/vbpq/2021/02/72.signed.pdf", {}),               # SRC-002
    (REG / "32023R1542.html", "http://publications.europa.eu/resource/celex/32023R1542", {"Accept": "application/xhtml+xml", "Accept-Language": "eng"}),  # SRC-003
    (REG / "32025R1561.html", "http://publications.europa.eu/resource/celex/32025R1561", {"Accept": "application/xhtml+xml", "Accept-Language": "eng"}),  # SRC-004
    (DATA / "vinfast-20f-fy2025.htm", "https://www.sec.gov/Archives/edgar/data/1913510/000110465926052266/vfs-20251231x20f.htm", SEC_UA),  # SRC-005
    (DATA / "vinfast-20f-fy2024.htm", "https://www.sec.gov/Archives/edgar/data/1913510/000141057825000943/vfs-20241231x20f.htm", SEC_UA),  # SRC-006
    (DATA / "vinfast-20fa-fy2023.htm", "https://www.sec.gov/Archives/edgar/data/1913510/000141057824001584/vfs-20231231x20fa.htm", SEC_UA),  # SRC-007
    (DATA / "icct-2026-vn-ev-policies.pdf", "https://theicct.org/wp-content/uploads/2026/05/ID-516-%E2%80%93-Vietnam-EV-policies_policy-brief_final.pdf", {"User-Agent": "Mozilla/5.0"}),  # SRC-020
    (DATA / "icct-2025-2w-baseline.pdf", "https://theicct.org/wp-content/uploads/2025/02/ID-250-%E2%80%93-Vietnam-two-wheelers_report_final.pdf", {"User-Agent": "Mozilla/5.0"}),  # SRC-021
    (DATA / "icct-2022-e2w-growth.pdf", "https://theicct.org/wp-content/uploads/2022/10/asia-pacific-lvs-NDC-TIA-E2W-mkt-growth-Vietnam-nov22.pdf", {"User-Agent": "Mozilla/5.0"}),  # SRC-022
    (NASA / "nasa-battery.zip", "https://phm-datasets.s3.amazonaws.com/NASA/5.+Battery+Data+Set.zip", {}),              # SRC-016
]


def get(path, url, headers):
    if path.exists():
        print("co san", path.name)
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=300) as r, open(path, "wb") as f:
        f.write(r.read())
    print("da tai", path.name)


for p, u, h in FILES:
    try:
        get(p, u, h)
    except Exception as e:  # noqa: BLE001
        print("LOI", p.name, e)
# Chuyen EU HTML -> text cho tools/eu_article.py va check_all.py
src = REG / "32023R1542.html"
if src.exists():
    t = re.sub(r"<[^>]+>", " ", src.read_text(encoding="utf-8", errors="ignore"))
    t = re.sub(r"\n\s*\n+", "\n", re.sub(r"[ \t\r\f\v]+", " ", html.unescape(t)))
    (REG / "eu2023-1542.txt").write_text(t, encoding="utf-8")
if not (REG / "bp-datamodel").exists():
    subprocess.run(["git", "clone", "--depth", "1", "https://github.com/batterypass/BatteryPassDataModel.git", str(REG / "bp-datamodel")], check=False)
print("Giai nen NASA: unzip 05-ai-soh/data/raw/nasa-battery.zip, roi giai nen '1. BatteryAgingARC-FY08Q4.zip' vao nasa/5. Battery Data Set/fy08")
