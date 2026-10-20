"""In nguyen van mot dieu cua EU 2023/1542 tu ban text da trich (02-regulatory/raw/eu2023-1542.txt).
Chay: py tools/eu_article.py 77 [59 60 ...]"""
import re, sys
sys.stdout.reconfigure(encoding="utf-8")
lines = open("02-regulatory/raw/eu2023-1542.txt", encoding="utf-8").read().split("\n")
starts = [i for i, l in enumerate(lines) if re.fullmatch(r"\s*Article \d+\s*", l)]
# ban text lap lai tieu de o phan muc luc; lay lan xuat hien dau tien co than bai
for n in sys.argv[1:]:
    for k, i in enumerate(starts):
        if lines[i].strip() == f"Article {n}":
            j = starts[k + 1] if k + 1 < len(starts) else len(lines)
            print("\n".join(l.strip() for l in lines[i:j]))
            print("-" * 40)
            break
