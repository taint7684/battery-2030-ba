# S8 — Kiểm kê dữ liệu và chuỗi đầu vào

## 1. Nguồn dữ liệu

| Nguồn | Mã | Độ phủ | Độ chi tiết | Giấy phép | Dùng cho | Trạng thái |
|---|---|---|---|---|---|---|
| ICCT — baseline xe hai bánh VN 2017–2021 | SRC-021 | 2017–2021 | Năm, toàn quốc | Trích dẫn có ghi nguồn | Doanh số xe máy điện lịch sử | Đã tải, đã đọc |
| ICCT — policy brief 03/2026 | SRC-020 | 2019–2024 | Năm, thị phần | Trích dẫn có ghi nguồn | Thị phần 2024; ~60% ắc quy chì | Đã tải, đã đọc |
| ICCT — tổng quan 11/2022 | SRC-022 | 2020–2022 | Mẫu xe, loại pin | Trích dẫn có ghi nguồn | Thông số pack, chu kỳ sống | Đã tải, đã đọc |
| VinFast 20-F FY2023/24/25 | SRC-005–007 | 2018–Q1/2026 | Năm, xe hai bánh và ô tô | Hồ sơ SEC công khai | Cận dưới doanh số; chuỗi ô tô điện | Đã tải, đã đọc |
| IEA Global EV Outlook 2026 | SRC-011 | 2025 | Năm | CC BY 4.0 | Doanh số xe máy điện 2025 | **Bị chặn tải tự động** (DEC-05) |
| Reuters / MarketScreener | SRC-013 | 2025 | Năm, ô tô VinFast VN | Báo chí | Ô tô điện 2025 | Đã đọc |
| Thanh Niên 08/4/2026 (dẫn World Bank) | SRC-008 | 2030–2050 | Năm | Báo chí | Đối chiếu (S11) | Đã đọc, nguồn thứ cấp |
| Marqstats / PowerSystems | SRC-018 | 2025 | Năm | Thương mại | Tổng thị trường xe hai bánh | Đã đọc phần tóm tắt |
| NASA PCoE Battery | SRC-016 | — | Chu kỳ sạc/xả | Công khai | Demo SoH (S17) | Tải ở P4-AI |

## 2. Chuỗi doanh số xe máy điện (nghìn xe/năm)

Giá trị likely; khoảng min–max dùng cho Monte Carlo. Nguồn ghi trong [params.py](model/params.py).

| Năm | Min | Likely | Max | Căn cứ |
|---|---|---|---|---|
| 2015 | 15 | 25 | 35 | ASM-03 ngoại suy |
| 2016 | 22 | 32 | 42 | ASM-03 ngoại suy |
| 2017 | 39,7 | 39,7 | 39,7 | SRC-021 |
| 2018 | 80 | 95 | 110 | ASM-03 nội suy |
| 2019 | 152 | 157 | 162 | SRC-020 (162), SRC-021 (152) |
| 2020 | 250 | 255 | 270 | SRC-022 (>250) |
| 2021 | 288 | 288 | 288 | SRC-020, SRC-021 |
| 2022 | 250 | 290 | 330 | ASM-03 |
| 2023 | 240 | 280 | 320 | ASM-03 |
| 2024 | 250 | 270 | 306 | SRC-020 (~9%) × ASM-02 |
| 2025 | 600 | 735 | 950 | SRC-011 (Unverified); cận dưới theo VinFast 406.498 (SRC-005) |

Tỷ trọng pin Li (ASM-05): 5% (2015) → 25% (2021) → 40% (2022–2024) → 65% (2025) → 85% (2030) → 90% (2035).

## 3. Chuỗi ô tô điện (nghìn xe/năm)

| Năm | Min | Likely | Max | Căn cứ |
|---|---|---|---|---|
| 2021 | 0,2 | 0,3 | 0,5 | SRC-007 |
| 2022 | 4 | 5 | 6 | Suy từ lũy kế VinFast (SRC-005–007) |
| 2023 | 28 | 33 | 36 | SRC-007 |
| 2024 | 85 | 92 | 100 | SRC-006 |
| 2025 | 165 | 185 | 205 | SRC-013 + hãng khác |

## 4. Kịch bản 2026–2035 (nghìn xe/năm, nội suy tuyến tính giữa các mốc)

| Kịch bản | Xe máy điện 2026 → 2030 → 2035 | Ô tô điện 2026 → 2030 → 2035 | Tỷ trọng Li xe máy 2030 / 2035 | Động lực |
|---|---|---|---|---|
| Chậm | 850 → 1.100 → 1.400 | 200 → 280 → 400 | 75% / 85% | Hà Nội triển khai chậm, không mở rộng tỉnh khác |
| Cơ sở | 1.000 → 1.400 → 2.000 | 240 → 380 → 600 | 85% / 90% | Lộ trình Chỉ thị 20 đúng hạn |
| Nhanh | 1.200 → 2.000 → 2.800 | 280 → 500 → 850 | 95% / 97% | Thêm TP.HCM và đô thị loại I áp lộ trình tương tự |

Căn cứ mốc 2026: VinFast giao 143.136 xe hai bánh Q1/2026 (+219% so cùng kỳ) (SRC-005).

## 5. Thông số pin

| Phân khúc | kWh/pack | kg/pack | Tuổi thọ pin TB (năm), k | Đời thứ hai | Căn cứ |
|---|---|---|---|---|---|
| Xe máy Li | 1,2 / **1,8** / 3,0 | 9 / **13,5** / 22 | 4 / **6** / 8; k 3,0 | 20 / **35** / 50% | ASM-07, -08, -10 |
| Xe máy ắc quy chì | 0,9 / **1,2** / 1,6 | 27 / **34** / 45 | 1,5 / **2** / 3; k 3,0 | 0% | ASM-07, -08 |
| Ô tô Li | 25 / **40** / 60 | 170 / **260** / 390 | 10 / **12** / 15; k 3,6 | 40 / **55** / 70% | ASM-07, -08, -10 |

Tuổi thọ phương tiện: xe máy 8 / **10** / 13 năm; ô tô 13 / **15** / 18 năm; k = 3,6 (ASM-09).

## 6. Lỗ hổng dữ liệu

| Mã | Thiếu | Xử lý |
|---|---|---|
| DG-01 | Doanh số xe máy điện 2022–2023 theo năm | Khoảng ±15% quanh thị phần ~9–10% (ASM-03) |
| DG-02 | Số liệu IEA gốc | Tải tay (DEC-05) |
| DG-03 | Tỷ trọng hóa học pin theo năm | ICCT 2022–2024 + VinFast; khoảng (ASM-05) |
| DG-04 | Thu gom phi chính thức | Phát hiện của S11 §4 (ASM-11) |
| DG-05 | Công suất tái chế pin Li trong nước | Trả lời theo ngưỡng (DEC-07) |
