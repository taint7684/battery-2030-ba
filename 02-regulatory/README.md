# 02 — Pháp lý

| Tệp | Nội dung |
|---|---|
| [S6-compliance-matrix.md](S6-compliance-matrix.md) | Ma trận tuân thủ VN × EU, 18 chủ đề |
| [req-extraction-vn.csv](req-extraction-vn.csv) | 31 nghĩa vụ trích nguyên văn từ Luật BVMT 2020 và NĐ 110/2026 |
| [req-extraction-eu.csv](req-extraction-eu.csv) | 28 nghĩa vụ trích nguyên văn từ EU 2023/1542 (và 2025/1561) |
| [passport-field-map.csv](passport-field-map.csv) | 93 thuộc tính Battery Pass v1.2 ánh xạ sang nhu cầu VN và phạm vi nền tảng |

## Tải lại văn bản gốc (thư mục `raw/` không commit)

```bash
mkdir -p 02-regulatory/raw && cd 02-regulatory/raw
# Việt Nam (bản scan có chữ ký số — đọc bằng ảnh, không trích chữ được)
curl -L -o nd110-2026.pdf https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/110-ndcp.signed.pdf
curl -L -o luat72-2020.pdf https://datafiles.chinhphu.vn/cpp/files/vbpq/2021/02/72.signed.pdf
# EU qua Cellar (EUR-Lex chặn tải tự động)
for c in 32023R1542 32025R1561; do
  curl -L -H "Accept: application/xhtml+xml" -H "Accept-Language: eng" -o $c.html http://publications.europa.eu/resource/celex/$c
done
# Battery Pass data model (CC BY 4.0)
git clone --depth 1 https://github.com/batterypass/BatteryPassDataModel.git bp-datamodel
```

Hoặc chạy một lệnh: `.venv/Scripts/python tools/fetch_sources.py` (tải mọi nguồn của dự án, chuyển EU HTML sang `eu2023-1542.txt`). Bản text dùng cho `tools/eu_article.py` và mục kiểm trích dẫn của `tools/check_all.py` chạy được; sinh lại bảng ánh xạ bằng `tools/build_passport_map.py`.

## Cách đọc trang của nghị định

Các trang được chuyển thành ảnh bằng PyMuPDF rồi đọc trực tiếp; vị trí đã dùng: NĐ 110 trang 1–8 (Điều 1–9), 16–20 (Điều 18–24), Phụ lục I trang 1–4, Phụ lục II trang 1–2; Luật BVMT trang 45–46 (Điều 54–55).
