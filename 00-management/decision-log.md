# Nhật ký quyết định

Mỗi quyết định gồm: mã · ngày · bối cảnh · phương án đã xét · lựa chọn · lý do.

---

## DEC-01 — Đi tiếp đề tài sau kiểm tra khả thi (T0.3)

- **Ngày:** 2026-10-20

| Điểm kiểm | Kết quả | Kết luận | Nguồn |
|---|---|---|---|
| 1. Văn bản EPR Việt Nam | Tải được bản gốc NĐ 110/2026/NĐ-CP và Luật BVMT 72/2020 từ Cổng TTĐT Chính phủ (bản scan, đọc trực tiếp). | Đạt | SRC-001, SRC-002 |
| 2. Chuỗi doanh số xe điện | ICCT có chuỗi xe máy điện 2017–2021 và tỷ trọng 2024; VinFast 20-F có số giao 2023–2025; IEA bị chặn tải tự động. | Đạt có điều kiện — tam giác hóa và trình bày dạng khoảng (ASM-02, ASM-03) | SRC-005–007, SRC-011, SRC-020–022 |
| 3. Dữ liệu suy giảm pin cho demo SoH | NASA PCoE tải công khai. | Đạt | SRC-016 |
| 4. Giấy phép dữ liệu | Văn bản luật VN và EU tái sử dụng được; Battery Pass CC BY 4.0; ICCT và báo chí chỉ trích dẫn ngắn. | Đạt — không commit bản gốc của bên thứ ba | SRC-003, SRC-015 |

- **Lựa chọn:** đi tiếp, kèm DEC-03 (đổi khung pháp lý) và DEC-05 (cách xử lý IEA).

## DEC-02 — Khách hàng giả định

- **Ngày:** 2026-10-20
- **Lựa chọn:** **VELIX** (tên làm việc, hư cấu) — doanh nghiệp lắp ráp và nhập khẩu xe máy điện tại Việt Nam, bán cả mẫu pin LFP và mẫu ắc quy chì, phân phối qua mạng đại lý.

| Thuộc tính | Giá trị likely (min–max) | Mã |
|---|---|---|
| Thị phần xe máy điện | 5% (3–8%) | ASM-13 |
| Tỷ trọng mẫu pin Li | 75% (60–90%) | ASM-14 |
| Kênh bán | Đại lý ủy quyền; thí điểm trạm đổi pin tại Hà Nội | — |

- **Lý do:** cỡ vừa đủ để có nghĩa vụ EPR và đủ lớn để cân nhắc tự tổ chức thu hồi; không trùng doanh nghiệp thật.

## DEC-03 — Khung pháp lý cơ sở là NĐ 110/2026, không phải NĐ 08/2022

- **Ngày:** 2026-10-20
- **Bối cảnh:** Đề tài gốc lấy Luật BVMT 2020 và NĐ 08/2022 làm căn cứ. NĐ 110/2026 (hiệu lực 25/5/2026) đã bãi bỏ Chương VI và Phụ lục XXII, XXIII của NĐ 08/2022 (Điều 22.2), và áp dụng cho trách nhiệm từ năm 2026 trở đi (Điều 23.1).
- **Phát hiện chi phối thiết kế:**
  1. Pin Lithium và NiMH dùng cho phương tiện giao thông có tỷ lệ tái chế bắt buộc **0%** (Phụ lục I, mục B.2.1).
  2. Ắc quy chì có tỷ lệ **12%** (mục B.1.1), nên mẫu xe ắc quy chì của khách hàng đang có nghĩa vụ ngay.
  3. Tỷ lệ điều chỉnh tăng mỗi 3 năm, tối đa 10%/lần, lần đầu năm 2029 (Điều 5.2). Dự thảo sửa đổi đề xuất 8% từ 2029 và 15% từ 2032 (SRC-009, chưa ban hành).
- **Lựa chọn:** đóng khung nền tảng là **chuẩn bị tuân thủ cho mốc 2029**, đồng thời tuân thủ ngay nghĩa vụ ắc quy chì. Yêu cầu viết theo nguyên tắc; tỷ lệ, Fs, thời hạn là tham số cấu hình.
- **Lý do:** đúng luật hiện hành; câu chuyện "làn sóng 2030" trùng khớp với mốc chính sách 2029.

## DEC-04 — Ánh xạ nhóm pin giữa VN và EU

- **Ngày:** 2026-10-20
- **Bối cảnh:** EU tách *LMT battery* (kín, ≤25 kg, cho xe hạng L) khỏi *electric vehicle battery* (>25 kg hạng L, hoặc hạng M/N/O). VN gộp chung "Pin Lithium, Pin NiMH sử dụng cho phương tiện giao thông".
- **Lựa chọn:** nền tảng phân loại pin theo **hai trục**: nhóm theo Phụ lục I NĐ 110 (để báo cáo VN) và nhóm theo Điều 3 EU 2023/1542 (để tương thích passport). Pin xe máy điện của VELIX (≈14 kg) thuộc LMT; ắc quy chì xe máy thuộc "Ắc quy chì" (VN) và LMT (EU) nếu ≤25 kg.

## DEC-05 — Số liệu IEA bị chặn tải tự động

- **Ngày:** 2026-10-20
- **Bối cảnh:** iea.org trả HTTP 403 cho mọi cách tải tự động.
- **Lựa chọn:** dùng ICCT và VinFast 20-F làm nguồn chính; số IEA 2025 (~735 nghìn xe máy điện) chỉ dùng để đối chiếu ở S11, nhãn Unverified.
- **Cần người thực hiện:** tải tay *Global EV Outlook 2026 — data* (Excel) để thay nhãn Unverified.

## DEC-06 — Phạm vi dữ liệu demo SoH

- **Ngày:** 2026-10-20
- **Lựa chọn:** dùng NASA PCoE (SRC-016). CALCE chuyển Hướng mở rộng.
- **Lý do:** NASA tải trực tiếp, có đủ chu kỳ để huấn luyện và kiểm thử theo từng pin; demo chỉ cần chứng minh luồng yêu cầu AI (ngưỡng, độ bất định, người duyệt), không cần bao phủ mọi hóa học pin.

## DEC-07 — Câu hỏi RQ3 trình bày theo ngưỡng công suất

- **Ngày:** 2026-10-20
- **Bối cảnh:** không có số công suất tái chế pin Li có phép công bố công khai (ASM-12).
- **Lựa chọn:** trả lời RQ3 bằng "năm lượng pin Li hết hạn vượt 2 / 5 / 10 / 30 nghìn tấn/năm" theo từng kịch bản, thay vì một năm giao cắt duy nhất.
- **Lý do:** biến điểm thiếu dữ liệu thành phát hiện có thể kiểm chứng; đồng thời kiểm luận điểm của chính sách "chưa đủ pin thải để vận hành nhà máy hiệu quả" (SRC-008).

## DEC-08 — Tham số vận hành tại điểm thu hồi

- **Ngày:** 2026-10-20
- **Bối cảnh:** BR-08 cần ngưỡng gom lô. NĐ 110 không quy định ngưỡng; các mức dưới đây là **chính sách nội bộ đề xuất**, không phải yêu cầu pháp lý.
- **Lựa chọn:** gom lô khi tồn kho ≥80% sức chứa khai báo (PAR-03), pin Nguy hiểm lưu >72 giờ (PAR-04), pin lưu >30 ngày (PAR-05). Mọi ngưỡng là tham số cấu hình.
- **Lý do:** pin Li thải có nguy cơ cháy khi lưu chứa sai (SRC-003 Phụ lục XII Part A); đại lý không muốn giữ pin lâu (INT-02).

## DEC-09 — M1: chốt baseline yêu cầu

- **Ngày:** 2026-10-20
- **Nội dung:** 31 REQ-VN, 28 REQ-EU, 18 chủ đề GAP (6 ⛔ · 7 ⚠️ · 5 ✏️), 12 NEED. Câu hỏi pháp lý mở LQ-01 – LQ-05 không chặn thiết kế vì đã tham số hóa (D-EPR-1).

## DEC-10 — M2: đóng băng dự báo `forecast-v1`

- **Ngày:** 2026-10-20
- **Nội dung:** tham số tại `03-forecast/model/params.py`; 1.000 lượt Monte Carlo, seed 2030. Kết quả dùng cho S21: pin Li hết hạn Cơ sở 2030 ≈15 nghìn tấn (P50), 2035 ≈71 nghìn tấn; ắc quy chì ≈33 nghìn tấn/năm năm 2030.
- **Thay đổi sau mốc:** phải đổi tag và chạy lại S9–S11, S21.

## DEC-11 — Mô hình SoH chạy chế độ song song ở MVP

- **Ngày:** 2026-10-20
- **Bối cảnh:** Demo S17 đạt AIR-01 (MAE 2,53) và AIR-02 (độ phủ 88,5%) nhưng không đạt AIR-03 (87,1%) và AIR-04 (đo tay 94,6%) ở ngưỡng 70%.
- **Phương án đã xét:** (a) bật tự động với ngưỡng nới; (b) chạy song song, mọi pin đo tay, thu dữ liệu; (c) bỏ mô hình.
- **Lựa chọn:** (b). Bật quyết định tự động khi AIR-03 và AIR-04 đạt trên ít nhất 500 pin VELIX có cả kết quả mô hình và đo tay.
- **Lý do:** (a) vi phạm mục tiêu đã đặt trước; (c) mất cơ hội giảm thời gian đo. BR-10 vẫn giữ nguyên trong thiết kế.

## DEC-12 — Quy trình To-Be có trung tâm kiểm định

- **Ngày:** 2026-10-20
- **Lựa chọn:** pin đi theo hai chặng chứng từ: điểm thu hồi → Trung tâm kiểm định VELIX (lô gom, mã GL-) → đối tác (lô bàn giao, mã CT-). Ắc quy chì được phân loại Tái chế tại trung tâm mà không cần SoH.
- **Lý do:** đại lý không có thiết bị đo; tập trung đánh giá SoH tại một nơi; mỗi chặng có chứng từ riêng theo REQ-VN-21.
