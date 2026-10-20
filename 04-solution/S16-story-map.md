# S16 — Story map và cắt MVP

Trục ngang là hành trình của pin; trục dọc là mức ưu tiên. Đường cắt MVP đặt theo mốc nộp hồ sơ EPR năm trách nhiệm 2026 (trước 01/4/2027, OBJ-1).

| Đăng ký | Thu hồi | Đánh giá | Điều phối | Bàn giao | Báo cáo | Quản trị |
|---|---|---|---|---|---|---|
| US-02 Cấp mã khi bán (10) | US-06 Tiếp nhận mọi hãng (10) | US-13 SoH + độ tin cậy (9) | US-15 Đề xuất theo quy tắc (9) | US-18 Giấy phép, chặn bàn giao (9) | US-22 V, R×V, F, bảo lưu (10) | US-26 Vai trò, phạm vi (7) |
| US-01 Model pin (8) | US-07 Checklist an toàn (9) | US-14 Đo tay, ghi đè (7) | US-16 Phê duyệt hai người (6) | US-10 Lô và chứng từ (8) | US-23 Xuất hồ sơ, nhắc hạn (8) | US-27 Nhật ký (5) |
| US-03 Cờ loại trừ (7) | US-09 Đề xuất gom lô (7) | | | US-19 Xác nhận tái chế (8) | US-20 Tham số theo năm (8) | |
| US-04 Tra cứu (5) | US-05 Điểm thu hồi (6) | | | US-11 Cân, chênh lệch (7) | US-21 Hình thức thực hiện (7) | |
| | US-12 Cổng công khai (5) | | | | US-24 Bảng điều khiển (6) | |
| | | | | | | |
| **— đường cắt MVP —** | | | | | | |
| | US-08 Ngoại tuyến (4) | | US-17 Bàn giao đời thứ hai (4) | | | |

Số trong ngoặc là điểm WSJF ([S16-backlog.md](S16-backlog.md)).

## Lý do cắt

| Story | Ưu tiên | Bản | Lý do |
|---|---|---|---|
| US-08 Ngoại tuyến | Should | R2 | MVP thí điểm 3 điểm có mạng ổn định; rủi ro mất mạng thấp hơn rủi ro trễ hạn EPR |
| US-17 Bàn giao đời thứ hai | Should | R2 | Lượng pin LFP đủ điều kiện đời thứ hai trước 2028 còn nhỏ (S9, S10); quyết định Đời thứ hai vẫn có ở MVP qua US-15, US-16 |

## Thứ tự sprint đề xuất (2 tuần/sprint)

| Sprint | Story | Mục tiêu sprint |
|---|---|---|
| 1 | US-01, US-02, US-03, US-04, US-26 | Có sổ đăng ký pin và phân quyền |
| 2 | US-05, US-06, US-07, US-09, US-12 | Tiếp nhận pin tại 3 điểm thí điểm |
| 3 | US-10, US-11, US-18, US-19 | Chuỗi chứng từ đến đơn vị tái chế |
| 4 | US-13, US-14, US-15, US-16 | Đánh giá SoH (chế độ song song, DEC-11) và điều phối |
| 5 | US-20, US-21, US-22, US-23, US-24, US-25, US-27 | Báo cáo EPR năm 2026, bảng điều khiển |
| R2 | US-08, US-17 | Ngoại tuyến; hồ sơ đời thứ hai |

## Definition of Ready / Definition of Done

| DoR — story được đưa vào sprint khi | DoD — story hoàn thành khi |
|---|---|
| Có AC Given/When/Then và mã BR | Mọi AC có test case tự động đạt |
| Dữ liệu mẫu và màn hình đã có trong prototype | RTM cập nhật, `tools/check_all.py` đạt |
| Phụ thuộc (ERP, giấy phép đối tác) đã xác định | Nhật ký kiểm toán ghi đủ thay đổi |
| Tham số liên quan có trong S14 §8 | Chủ sản phẩm nghiệm thu trên môi trường thử |
