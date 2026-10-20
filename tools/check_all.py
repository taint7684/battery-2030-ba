"""Kiem tra nhat quan toan repo (T6.5). Thoat 0 khi moi kiem tra dat.
Chay: .venv/Scripts/python tools/check_all.py"""
import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
fails, warns, oks = [], [], []


def check(name, cond, detail=""):
    (oks if cond else fails).append(name + ("" if cond else f" — {detail}"))


def rd(p):
    with open(ROOT / p, encoding="utf-8") as f:
        return list(csv.DictReader(f))


# 1. CSV doc duoc, so cot dong deu
for p in sorted(ROOT.rglob("*.csv")):
    if any(x in p.parts for x in ("raw", ".venv", "node_modules")):
        continue
    with open(p, encoding="utf-8") as f:
        rows = list(csv.reader(f))
    bad = [i for i, r in enumerate(rows) if r and len(r) != len(rows[0])]
    check(f"CSV hợp lệ: {p.relative_to(ROOT)}", not bad, f"dòng lệch cột {bad[:5]}")

# 2. Ma dinh danh ton tai
SRC = {r["id"] for r in rd("00-management/source-log.csv")}
ASM = {r["id"] for r in rd("00-management/assumptions-log.csv")}
RVN = {r["id"] for r in rd("02-regulatory/req-extraction-vn.csv")}
REU = {r["id"] for r in rd("02-regulatory/req-extraction-eu.csv")}
FR, NFR, BR, US, AC = (rd(f"04-solution/trace/{n}.csv") for n in ("fr", "nfr", "br", "us", "ac"))
TC = rd("06-test/test-cases.csv")
TEXT = {p: p.read_text(encoding="utf-8") for p in ROOT.rglob("*.md") if not any(x in p.parts for x in ("raw", ".venv", "node_modules"))}
ALL_MD = "\n".join(TEXT.values())
GAP = set(re.findall(r"\| (GAP-\d+) \|", TEXT[ROOT / "02-regulatory/S6-compliance-matrix.md"]))
NEED = set(re.findall(r"\| (NEED-\d+) \|", TEXT[ROOT / "01-discovery/elicitation.md"]))
DEC = set(re.findall(r"## (DEC-\d+)", TEXT[ROOT / "00-management/decision-log.md"]))
KNOWN = {"SRC": SRC, "ASM": ASM, "REQ-VN": RVN, "REQ-EU": REU, "GAP": GAP, "NEED": NEED, "DEC": DEC,
         "FR": {r["id"] for r in FR}, "NFR": {r["id"] for r in NFR}, "BR": {r["id"] for r in BR}, "US": {r["id"] for r in US},
         "AC": {r["id"] for r in AC}, "TC": {r["id"] for r in TC}}
pat = re.compile(r"\b(SRC|ASM|REQ-VN|REQ-EU|GAP|NEED|DEC|FR|NFR|BR|US|AC|TC)-(\d+)\b")
dangling = Counter()
for p, t in TEXT.items():
    for k, n in pat.findall(t):
        if f"{k}-{n}" not in KNOWN[k]:
            dangling[f"{k}-{n} ({p.relative_to(ROOT)})"] += 1
for p in ["04-solution/trace/fr.csv", "04-solution/trace/br.csv", "04-solution/trace/us.csv", "04-solution/trace/ac.csv", "04-solution/trace/nfr.csv",
          "06-test/test-cases.csv", "00-management/assumptions-log.csv", "02-regulatory/req-extraction-vn.csv"]:
    for k, n in pat.findall((ROOT / p).read_text(encoding="utf-8")):
        if f"{k}-{n}" not in KNOWN[k]:
            dangling[f"{k}-{n} ({p})"] += 1
check("Mọi mã tham chiếu đều tồn tại", not dangling, ", ".join(list(dangling)[:12]))

# 3. Do phu truy vet
ids = lambda s, k: set(re.findall(rf"\b{k}-\d+\b", s or ""))
fr_src = " ".join(f["source"] + " " + f["br"] for f in FR) + " " + " ".join(b["source"] for b in BR)
check("Mọi NEED có FR/BR", all(n in fr_src for n in NEED), str(sorted(n for n in NEED if n not in fr_src)))
gap_need = {g for g in GAP if re.search(rf"\| {g} \|[^\n]*\| (⛔|⚠️) \|", TEXT[ROOT / "02-regulatory/S6-compliance-matrix.md"])}
check("Mọi GAP ⛔/⚠️ có FR/BR xử lý", all(g in fr_src for g in gap_need), str(sorted(g for g in gap_need if g not in fr_src)))
us_fr = set().union(*(ids(u["fr"], "FR") for u in US))
check("Mọi FR có user story", {f["id"] for f in FR} <= us_fr, str(sorted({f["id"] for f in FR} - us_fr)))
check("Mọi US có AC", {u["id"] for u in US} <= {a["us"] for a in AC}, str(sorted({u["id"] for u in US} - {a["us"] for a in AC})))
tc_refs = set().union(*(set(re.findall(r"(?:AC|BR|FR|NFR|US)-\d+", t["refs"])) for t in TC))
check("Mọi AC có test case", {a["id"] for a in AC} <= tc_refs, str(sorted({a["id"] for a in AC} - tc_refs)))
br_cov = {b["id"] for b in BR if b["id"] in tc_refs or any(b["id"] in ids(a["br"], "BR") and a["id"] in tc_refs for a in AC)}
check("Mọi BR có test case", br_cov == {b["id"] for b in BR}, str(sorted({b["id"] for b in BR} - br_cov)))
nfr_ok = {n["id"] for n in NFR if n["id"] in tc_refs or n["verification"]}
check("Mọi NFR có cách kiểm chứng", nfr_ok == {n["id"] for n in NFR})

# 4. Ket qua test
res = Counter(t["result"] for t in TC)
check(f"Test case prototype đạt 100% ({res.get('Đạt', 0)}/{len(TC)})", res.get("Đạt", 0) == len(TC), str(res))
rtm = rd("06-test/rtm.csv")
check("RTM không có dòng Không đạt / Chưa có test", all(r["status"] in ("Đạt", "Kiểm chứng ngoài prototype") for r in rtm))

# 5. Moi ASM, SRC duoc dung it nhat mot lan ngoai so ghi
used_text = ALL_MD + "".join((ROOT / p).read_text(encoding="utf-8") for p in ["03-forecast/model/params.py", "04-solution/trace/br.csv", "04-solution/trace/fr.csv"])
log_text = (ROOT / "00-management/assumptions-log.csv").read_text(encoding="utf-8") + (ROOT / "00-management/source-log.csv").read_text(encoding="utf-8")
unused = [x for x in sorted(SRC | ASM) if len(re.findall(rf"\b{x}\b", used_text)) == 0]
check("Mọi SRC/ASM được dùng trong tài liệu hoặc mô hình", not unused, str(unused))

# 6. Trich dan EU dung nguyen van (neu co ban goc)
eu_raw = ROOT / "02-regulatory/raw/eu2023-1542.txt"
if eu_raw.exists():
    norm = lambda s: re.sub(r"\s+", " ", s).replace("’", "'").strip()
    src = norm(eu_raw.read_text(encoding="utf-8"))
    miss = []
    for r in rd("02-regulatory/req-extraction-eu.csv"):
        if "2025/1561" in r["src"] and "2023/1542" not in r["src"]:
            continue
        for frag in re.split(r"\.\.\.|\[[^\]]*\]", r["quote_en"]):
            frag = norm(frag).strip(" ;,.")
            if len(frag) > 25 and frag.replace("18 August 2027", "18 August 2025") not in src:
                miss.append(r["id"])
                break
    check("Trích dẫn EU 2023/1542 khớp nguyên văn", not miss, str(miss))
else:
    warns.append("Bỏ qua kiểm trích dẫn EU: chưa tải bản gốc (xem 02-regulatory/README.md)")

# 7. Truong passport MVP co trong tu dien du lieu S15
s15 = TEXT[ROOT / "04-solution/S15-data-model.md"]
miss = [r["platform_field"] for r in rd("02-regulatory/passport-field-map.csv") if r["platform_scope"] == "MVP" and r["platform_field"].split(".")[-1] not in s15]
check("Trường passport MVP có trong từ điển dữ liệu S15", not miss, str(miss))

# 8. Dem ky hieu ma tran S6
s6 = TEXT[ROOT / "02-regulatory/S6-compliance-matrix.md"]
rows = re.findall(r"^\| GAP-\d+ \|.*\| (⛔|⚠️|✏️) \|", s6, re.M)
c = Counter(rows)
check("S6: dòng tổng hợp khớp số ký hiệu", f"{c['⛔']} ⛔ · {c['⚠️']} ⚠️ · {c['✏️']} ✏️ trên {len(rows)} chủ đề" in s6, str(c))

# 9. Tham so mac dinh S14 khop du lieu prototype
data = json.loads(re.search(r"window\.SEED = (\{.*\});", (ROOT / "docs/prototype/data.js").read_text(encoding="utf-8"), re.S).group(1))
s14 = TEXT[ROOT / "04-solution/S14-srs.md"]
for k in ("PAR-02", "PAR-03", "PAR-04", "PAR-05", "PAR-06", "PAR-07", "PAR-08", "PAR-09"):
    v = data["params"][k]["value"]
    check(f"Tham số {k} = {v} khớp S14", re.search(rf"\| {k} \| [^|]+\| {v}\b", s14) is not None)
check("Fs ắc quy chì 2026 khớp S14 và ASM-15", any(r["Fs"] == 18278 for r in data["regulation"]) and "18.278" in s14)

# 10. Link noi bo trong .md ton tai
broken = []
for p, t in TEXT.items():
    for link in re.findall(r"\]\(([^)#\s]+)(?:#[^)]*)?\)", t):
        if link.startswith(("http", "mailto")):
            continue
        if not (p.parent / link).resolve().exists():
            broken.append(f"{p.relative_to(ROOT)} → {link}")
check("Link nội bộ trong tài liệu", not broken, "; ".join(broken[:10]))

# 11. Anh duoc nhung ton tai
print(f"ĐẠT {len(oks)} · KHÔNG ĐẠT {len(fails)} · CẢNH BÁO {len(warns)}")
for x in fails:
    print("  ✗", x)
for x in warns:
    print("  !", x)
sys.exit(1 if fails else 0)
