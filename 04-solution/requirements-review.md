# Rà soát chất lượng yêu cầu (ISO/IEC/IEEE 29148 §5.2.5)

Phạm vi: 33 FR, 11 NFR, 30 BR, 27 US, 64 AC trong `04-solution/trace/`. Phần cơ học do `tools/check_all.py` kiểm; phần định tính do BA rà từng dòng.

## 1. Đặc tính từng yêu cầu

| Đặc tính (29148) | Cách kiểm | Kết quả | Hành động đã làm |
|---|---|---|---|
| Cần thiết | Mỗi FR có nguồn NEED/REQ/GAP; mỗi NEED và GAP ⛔/⚠️ có FR/BR | Đạt (`check_all.py` mục 3) | Bổ sung GAP-06, GAP-07, GAP-13 vào nguồn FR-23, FR-01, FR-24 |
| Không phụ thuộc cách hiện thực | Rà câu chữ: không nêu công nghệ trong FR | Đạt | NFR-07 nêu chuẩn liên thông (ISO/IEC 15459, OpenAPI) vì là yêu cầu tích hợp, không phải lựa chọn công nghệ |
| Rõ nghĩa | Mọi ngưỡng có số và mã tham số (PAR-01 – PAR-11) | Đạt | Ngưỡng định lượng từ bản đầu (72 giờ, 30 ngày, 3 phút); không có từ mơ hồ (§3) |
| Đầy đủ | Mỗi BR có điều kiện kích hoạt và phản ứng (EARS) | Đạt | Ví dụ: BR-23 có nhánh "Chưa đủ dữ liệu" khi thiếu năm |
| Đơn nhất | Một FR một khả năng | Đạt có ghi chú | FR-06 gộp tiếp nhận + checklist + BMS vì cùng một thao tác của người dùng |
| Khả thi | Đối chiếu prototype | Đạt | Mọi FR có màn hình trong prototype, trừ FR-24 xuất tệp nộp (có CSV, chưa có API quốc gia — LQ-05) |
| Kiểm chứng được | Mỗi AC/BR có test case; NFR có cách kiểm chứng | Đạt (73 TC; 3 NFR kiểm ở SIT/UAT) | Thêm TC-072, TC-073 sau rà soát |
| Đúng | Đối chiếu nguyên văn luật | Đạt | Sửa trích dẫn EU (DEF-05) |
| Truy vết được | RTM hai chiều | Đạt | `06-test/rtm.md` |

## 2. Tập yêu cầu

| Đặc tính | Kết quả | Ghi chú |
|---|---|---|
| Đầy đủ | Đạt | Phủ 7 bước To-Be S13 và 6 use case |
| Nhất quán | Đạt sau sửa | DEF-04 (ma trận quyền ↔ prototype); DEF-06 (tên trường passport ↔ S15) |
| Khả thi trong ràng buộc | Đạt | MVP 25 story / 5 sprint (S16) |
| Có giới hạn | Đạt | Ngoài phạm vi ghi ở S1 §3, S12 §5 |

## 3. Từ ngữ mơ hồ đã loại

Tìm trong `trace/*.csv` các từ "phù hợp", "nhanh chóng", "kịp thời", "thân thiện", "tối ưu", "v.v.":

| Từ | Số lần còn lại | Ghi chú |
|---|---|---|
| Cả 6 từ | 0 | Đếm bằng `grep` trên `trace/*.csv`. "phù hợp" chỉ còn trong trích dẫn nguyên văn luật ở `02-regulatory/req-extraction-vn.csv` ("giấy phép môi trường ... có nội dung phù hợp") — giữ nguyên vì là văn bản gốc |
