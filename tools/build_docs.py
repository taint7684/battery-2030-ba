"""Sinh tai lieu tu bang truy vet (04-solution/trace/*.csv) va ket qua test (06-test/test-cases.csv):
  04-solution/S14-srs-appendix.md · 04-solution/S16-backlog.md · 06-test/rtm.csv · 06-test/rtm.md
Chay: .venv/Scripts/python tools/build_docs.py"""
import csv
import re
import sys
from collections import defaultdict
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
T = ROOT / "04-solution" / "trace"
GEN = "<!-- SINH TỰ ĐỘNG bởi tools/build_docs.py — không sửa tay -->\n\n"


def rd(p):
    with open(p, encoding="utf-8") as f:
        return list(csv.DictReader(f))


def ids(s, prefix):
    return re.findall(rf"{prefix}-\d+", s or "")


FR, NFR, BR, US, AC = (rd(T / f"{n}.csv") for n in ("fr", "nfr", "br", "us", "ac"))
TC = rd(ROOT / "06-test" / "test-cases.csv")
MOD = {"MOD-REG": "Sổ đăng ký pin", "MOD-COL": "Thu hồi", "MOD-SOH": "Đánh giá SoH", "MOD-RTE": "Điều phối",
       "MOD-PTN": "Đối tác", "MOD-EPR": "Báo cáo EPR", "MOD-PSP": "Hồ sơ pin", "MOD-ADM": "Quản trị"}
cell = lambda s: (s or "").replace("|", "\\|").replace("\n", " ")


def tcs_for(*keys):
    keys = set(keys)
    return sorted({t["id"] for t in TC if keys & set(re.findall(r"(?:AC|BR|FR|NFR|US)-\d+", t["refs"]))})


def appendix():
    L = [GEN + "# S14 — Phụ lục: danh mục yêu cầu\n", "## 1. Yêu cầu chức năng\n"]
    for m, name in MOD.items():
        rows = [f for f in FR if f["module"] == m]
        if not rows:
            continue
        L += [f"### {m} — {name}\n", "| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |", "|---|---|---|---|---|"]
        L += [f"| {f['id']} | {cell(f['requirement'])} | {f['priority']} | {cell(f['source'])} | {cell(f['br'])} |" for f in rows]
        L.append("")
    L += ["## 2. Yêu cầu phi chức năng\n", "| Mã | Nhóm | Yêu cầu | Thước đo | Nguồn | Cách kiểm chứng |", "|---|---|---|---|---|---|"]
    L += [f"| {n['id']} | {n['category']} | {cell(n['requirement'])} | {cell(n['metric'])} | {cell(n['source'])} | {cell(n['verification'])} |" for n in NFR]
    L += ["", "## 3. Quy tắc nghiệp vụ (EARS)\n", "| Mã | Phân hệ | Quy tắc | Tham số | Căn cứ | Test |", "|---|---|---|---|---|---|"]
    for b in BR:
        acs = [a["id"] for a in AC if b["id"] in ids(a["br"], "BR")]
        L.append(f"| {b['id']} | {b['module']} | {cell(b['rule_ears'])} | {cell(b['params'])} | {cell(b['source'])} | {', '.join(tcs_for(b['id'], *acs))} |")
    (ROOT / "04-solution" / "S14-srs-appendix.md").write_text("\n".join(L) + "\n", encoding="utf-8")


def backlog():
    L = [GEN + "# S16 — Product backlog\n",
         "Ưu tiên MoSCoW; điểm WSJF = (giá trị nghiệp vụ + tính cấp thiết + giảm rủi ro) / độ lớn, thang 1–10. Thứ tự và cắt MVP: [S16-story-map.md](S16-story-map.md).\n",
         "| Epic | Số story | Must | Should |", "|---|---|---|---|"]
    by = defaultdict(list)
    for u in US:
        by[u["epic"]].append(u)
    for e, us in by.items():
        L.append(f"| {e} | {len(us)} | {sum(u['priority'] == 'Must' for u in us)} | {sum(u['priority'] == 'Should' for u in us)} |")
    L.append("")
    for e, us in by.items():
        L.append(f"## {e}\n")
        for u in us:
            L += [f"### {u['id']} · {u['priority']} · {u['release']} · WSJF {u['wsjf']}\n", f"{u['story']}\n", f"FR: {u['fr']}\n",
                  "| AC | Given | When | Then | Quy tắc | Test |", "|---|---|---|---|---|---|"]
            for a in [a for a in AC if a["us"] == u["id"]]:
                L.append(f"| {a['id']} | {cell(a['given'])} | {cell(a['when'])} | {cell(a['then'])} | {cell(a['br'])} | {', '.join(tcs_for(a['id']))} |")
            L.append("")
    (ROOT / "04-solution" / "S16-backlog.md").write_text("\n".join(L), encoding="utf-8")


def rtm():
    res = {t["id"]: t["result"] for t in TC}
    rows = []
    for f in FR:
        us = [u["id"] for u in US if f["id"] in ids(u["fr"], "FR")]
        ac = [a["id"] for a in AC if a["us"] in us]
        br = ids(f["br"], "BR")
        tc = tcs_for(f["id"], *ac, *br)
        rows.append({"requirement": f["id"], "type": "FR", "source": f["source"], "br": "; ".join(br), "us": "; ".join(us),
                     "ac": "; ".join(ac), "tc": "; ".join(tc), "status": "Đạt" if tc and all(res[t] == "Đạt" for t in tc) else ("Chưa có test" if not tc else "Không đạt")})
    for n in NFR:
        tc = tcs_for(n["id"])
        st = "Đạt" if tc and all(res[t] == "Đạt" for t in tc) else ("Kiểm chứng ngoài prototype" if not tc else "Không đạt")
        rows.append({"requirement": n["id"], "type": "NFR", "source": n["source"], "br": "", "us": "", "ac": "", "tc": "; ".join(tc), "status": st})
    with open(ROOT / "06-test" / "rtm.csv", "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]), lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    L = [GEN + "# Ma trận truy vết yêu cầu (RTM)\n",
         "Chuỗi: nguồn (luật / nhu cầu / khoảng trống) → FR → BR → User story → AC → Test case → kết quả. Kiểm tự động bằng `tools/check_all.py`.\n",
         f"Tổng: {len(rows)} yêu cầu · Đạt {sum(r['status'] == 'Đạt' for r in rows)} · Kiểm chứng ngoài prototype {sum(r['status'] == 'Kiểm chứng ngoài prototype' for r in rows)} · Không đạt {sum(r['status'] == 'Không đạt' for r in rows)} · Chưa có test {sum(r['status'] == 'Chưa có test' for r in rows)}\n",
         "| Yêu cầu | Nguồn | BR | US | AC | Test case | Kết quả |", "|---|---|---|---|---|---|---|"]
    L += [f"| {r['requirement']} | {cell(r['source'])} | {r['br']} | {r['us']} | {r['ac']} | {r['tc']} | {r['status']} |" for r in rows]
    nfr_out = [n for n in NFR if not tcs_for(n["id"])]
    if nfr_out:
        L += ["", "NFR kiểm chứng ngoài prototype (UAT/SIT): " + "; ".join(f"{n['id']} — {n['verification']}" for n in nfr_out)]
    (ROOT / "06-test" / "rtm.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    return rows


if __name__ == "__main__":
    appendix()
    backlog()
    rows = rtm()
    from collections import Counter
    print("RTM:", Counter(r["status"] for r in rows))
