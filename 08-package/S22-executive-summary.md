# S22 — Tóm tắt điều hành

**Battery 2030 — Nền tảng quản lý vòng đời và trách nhiệm thu hồi pin xe điện tại Việt Nam**
Khách hàng giả định: VELIX, hãng xe máy điện chịu nghĩa vụ EPR. Ngày: 20/10/2026.

## Kết luận một câu

Làn sóng pin Li hết hạn bắt đầu thật sự từ **2029–2030**, trùng với mốc điều chỉnh tỷ lệ tái chế của NĐ 110/2026. VELIX nên **tự tổ chức thu hồi ắc quy chì ngay**, **xây nền tảng định danh pin từ 2027**, và **quyết định hình thức EPR cho pin Li trước 30/6/2028** dựa trên giá pin đời thứ hai đo thực tế.

## Trả lời 7 câu hỏi nghiên cứu

| Mã | Câu hỏi | Trả lời | Chi tiết |
|---|---|---|---|
| RQ1 | EPR Việt Nam yêu cầu gì, yếu hơn EU ở đâu? | Pin Li dùng cho phương tiện giao thông: tỷ lệ tái chế bắt buộc **0%**; ắc quy chì **12%**; điều chỉnh 3 năm/lần từ 2029, mỗi lần tối đa +10%. So với EU: 6 khoảng trống ⛔ — không có chỉ tiêu thu gom, mạng thu hồi bắt buộc, quy định đời thứ hai, dữ liệu SoH, passport, đóng góp theo chi phí đầy đủ | [S6](../02-regulatory/S6-compliance-matrix.md) |
| RQ2 | Bao nhiêu pin hết hạn mỗi năm? | Pin Li: **≈15 nghìn tấn / 2,2 GWh năm 2030** (P10–P90: 11–20 nghìn tấn); **≈71 nghìn tấn / 10 GWh năm 2035**. Ắc quy chì xe máy ≈33 nghìn tấn/năm năm 2030 | [S9](../03-forecast/S9-forecast-results.md) |
| RQ3 | Năm nào vượt công suất tái chế? Bao nhiêu % dùng được đời thứ hai? | Không có công suất pin Li công bố trong nước; pin Li hết hạn vượt **10 nghìn tấn/năm vào 2029–2030**, **30 nghìn tấn/năm vào 2031–2034**. ≈45% đủ điều kiện kỹ thuật cho đời thứ hai, nhưng chỉ **≈16%** đến được đời thứ hai năm 2030 vì ≈65% pin Li đi kênh phi chính thức | [S9](../03-forecast/S9-forecast-results.md), [S10](../03-forecast/S10-material-flow.md) |
| RQ4 | Dự báo chắc đến đâu? | Đổi tuổi thọ ±2 năm làm mốc ngưỡng dịch ~1 năm, lượng 2030 đổi −32% đến +69%. Sai số chủ yếu đến từ thông số pin, không phải doanh số. Khớp số VinFast nộp SEC (5/5 phép kiểm) và ước tính World Bank (lệch 1%) | [S11](../03-forecast/S11-critique.md) |
| RQ5 | Nền tảng cần làm gì? | 8 phân hệ, 33 FR, 11 NFR, 30 BR; MVP 25 user story kịp hạn nộp hồ sơ 01/4/2027. Prototype 14 màn hình, **73/73 test case tự động đạt** | [S14](../04-solution/S14-srs.md), [S20](../06-test/S20-test-plan.md) |
| RQ6 | AI ước lượng SoH có dùng được không? | Đạt độ chính xác (MAE 2,53 điểm; độ phủ 88,5%) nhưng **chưa đạt yêu cầu vận hành** (94,6% pin vẫn phải đo tay). MVP chạy mô hình song song; bật tự động khi đạt AIR-03/04 trên dữ liệu pack VELIX | [S17](../05-ai-soh/S17-model-card.md), DEC-11 |
| RQ7 | Tự làm, đóng quỹ hay PRO? | Ắc quy chì: tự tổ chức thắng ở 100% lượt mô phỏng. Pin Li: tự tổ chức thắng ở 60–90% lượt tùy chính sách; hòa vốn khi giá pin đời thứ hai ≈0,67 triệu đ/kWh (dự thảo) | [S21](../07-business-case/S21-business-case.md) |

## Ba việc cần quyết định

| # | Quyết định | Hạn | Người quyết |
|---|---|---|---|
| 1 | Đăng ký hình thức "Tổ chức tái chế — hợp đồng đơn vị tái chế" cho ắc quy chì, năm trách nhiệm 2026 | 31/3/2027 | Ban điều hành |
| 2 | Phê duyệt MVP nền tảng (25 story, 5 sprint) và thí điểm tại 3 điểm thu hồi | Q4/2026 | Nhà tài trợ |
| 3 | Chọn hình thức EPR pin Li cho chu kỳ 2029–2031 theo dữ liệu thí điểm | 30/6/2028 | Ban điều hành |

## Giới hạn cần biết

- Số liệu doanh số 2022–2024 và giá trị kinh tế (phế liệu chì, pin đời thứ hai) là giả định mức tin cậy Thấp, trình bày theo khoảng.
- Phần thu gom phi chính thức không quan sát được trực tiếp.
- Dự thảo 8%/15% cho pin Li chưa được ban hành.
- Đây là phân tích nghiệp vụ, không phải tư vấn pháp lý.
