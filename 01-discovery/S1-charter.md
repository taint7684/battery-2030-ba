# S1 — Project charter

| Mục | Nội dung |
|---|---|
| Tên dự án | Battery 2030 — Nền tảng quản lý vòng đời và trách nhiệm thu hồi pin xe điện |
| Khách hàng (giả định) | VELIX — doanh nghiệp lắp ráp, nhập khẩu xe máy điện tại Việt Nam (DEC-02) |
| Nhà tài trợ | Giám đốc vận hành VELIX |
| Chủ sản phẩm | Trưởng phòng Tuân thủ môi trường VELIX |
| BA | Người thực hiện dự án |
| Ngày lập | 20/10/2026 |

## 1. Vấn đề

VELIX đưa ra thị trường mỗi năm hàng chục nghìn pin LFP và ắc quy chì nhưng không biết pin nào đang ở đâu, bao giờ hết hạn và đi qua kênh nào sau khi hết hạn. Ắc quy chì đã có nghĩa vụ tái chế 12% từ năm trách nhiệm 2026 (REQ-VN-15). Pin lithium dùng cho phương tiện giao thông có tỷ lệ 0% nhưng mốc điều chỉnh đầu tiên là 2029 (REQ-VN-11), và dự thảo đề xuất 8% (SRC-009). Không có dữ liệu thì VELIX không lập được báo cáo EPR có căn cứ, không đo được tỷ lệ thu hồi và không chọn được phương án tài chính.

## 2. Mục tiêu (SMART)

| Mã | Mục tiêu | Thước đo | Mốc |
|---|---|---|---|
| OBJ-1 | Nộp kế hoạch/kê khai EPR năm trách nhiệm 2026 đúng hạn, số liệu truy được đến từng pin | Hồ sơ nộp trước 01/4/2027; 100% khối lượng V khớp sổ đăng ký | 31/3/2027 |
| OBJ-2 | Gán mã định danh cho 100% pin đưa ra thị trường từ ngày vận hành | Tỷ lệ pin bán ra có mã | 3 tháng sau go-live |
| OBJ-3 | Đo được tỷ lệ thu gom pin Li theo công thức bình quân 3 năm (chuẩn EU) | Chỉ số có trên dashboard, cập nhật tháng | 12 tháng sau go-live |
| OBJ-4 | Mọi pin thu hồi có quyết định điều phối dựa trên hồ sơ SoH | Tỷ lệ pin có hồ sơ SoH trước quyết định = 100% | Từ go-live |
| OBJ-5 | Chọn phương án thực hiện EPR (tự tổ chức · đóng quỹ · PRO) cho chu kỳ 2029–2031 | Quyết định có business case được duyệt | 30/6/2028 |

## 3. Phạm vi

**Trong phạm vi:** dự báo pin hết hạn cấp quốc gia (xe máy điện, ô tô điện); nền tảng cho VELIX gồm 7 phân hệ: Sổ đăng ký pin, Thu hồi, Đánh giá SoH, Điều phối, Báo cáo EPR, Hồ sơ pin, Đối tác; demo mô hình ước lượng SoH; business case 3 phương án.

**Ngoài phạm vi:** công nghệ tái chế; thiết kế cell pin; xe buýt, xe tải; tích hợp trực tiếp với Hệ thống thông tin EPR quốc gia (chưa công bố API — nền tảng xuất file theo mẫu); thanh toán; tư vấn pháp lý.

## 4. Ràng buộc và giả định chính

| Loại | Nội dung | Mã |
|---|---|---|
| Pháp lý | Khung hiện hành NĐ 110/2026; tỷ lệ và Fs có thể đổi từ 2029 | DEC-03, RSK-01 |
| Dữ liệu | Không có số công khai về thu gom phi chính thức và công suất tái chế pin Li | ASM-11, ASM-12 |
| Ngân sách | Dự án portfolio: chi phí 0đ, công cụ miễn phí | — |
| Kỹ thuật | Đại lý có thể mất mạng khi tiếp nhận pin | NFR S14 |

## 5. Bên liên quan chính

Xem [S4-stakeholders.md](S4-stakeholders.md). Người ra quyết định: Giám đốc vận hành (nhà tài trợ), Trưởng phòng Tuân thủ (chủ sản phẩm). Người dùng chính: cán bộ tuân thủ EPR, đại lý, nhân viên tiếp nhận ở đơn vị tái chế.

## 6. Sản phẩm bàn giao

S1–S23 theo [ROADMAP.md](../ROADMAP.md) §6.

## 7. Tiêu chí hoàn thành

- Mọi yêu cầu truy được lên điều luật hoặc nhu cầu, và xuống test case (RTM không lỗ hổng, kiểm bằng script).
- Mọi số liệu có mã nguồn SRC hoặc mã giả định ASM.
- Prototype chạy được 6 luồng lõi; mọi test case của prototype có kết quả.
