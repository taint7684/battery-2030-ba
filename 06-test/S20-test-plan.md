# S20 — Kế hoạch kiểm thử, kết quả và UAT

## 1. Phạm vi và cách tiếp cận

| Mục | Nội dung |
|---|---|
| Đối tượng | Prototype [docs/prototype](../docs/prototype/index.html) — hiện thực 30 BR và luồng của 27 user story trên dữ liệu giả lập |
| Mức kiểm thử | Hệ thống (end-to-end qua giao diện) + quy tắc (gọi trực tiếp lớp `domain.js` cho giá trị biên) |
| Công cụ | Playwright (Chromium), trình chạy [e2e/run.js](e2e/run.js); bộ test [e2e/tests.js](e2e/tests.js) là nguồn duy nhất sinh [test-cases.csv](test-cases.csv) |
| Dữ liệu | [generator.py](../04-solution/synthetic/generator.py), seed 2030; mỗi test bắt đầu từ dữ liệu sạch (`App.reset()`) |
| Ngoài phạm vi | NFR-03 sẵn sàng, NFR-04 bảo mật, NFR-11 sao lưu — kiểm ở SIT/UAT trên hạ tầng thật |

### Kỹ thuật thiết kế test case

| Ký hiệu | Kỹ thuật | Ví dụ |
|---|---|---|
| EP | Phân vùng tương đương | Pin VELIX / pin hãng khác (TC-014, TC-015) |
| BVA | Giá trị biên | LMT 25,0 / 25,1 kg (TC-003); chênh lệch 2,00% / 2,01% (TC-046); SoH 70,0 / 69,9 (TC-034); độ rộng 10,0 / 10,1 (TC-028); giấy phép 60 / 61 ngày (TC-043) |
| DT | Bảng quyết định | Điều phối R1–R5 (TC-017, TC-032 – TC-035); chuyển đo tay S1–S4 (TC-024 – TC-027) |
| ST | Chuyển trạng thái | 8 × 8 cặp trạng thái (TC-064); hủy đăng ký (TC-007) |
| UC | Luồng use case | Bàn giao đời thứ hai (TC-040); xác nhận tái chế (TC-048) |
| NFR | Phi chức năng | 360 px (TC-070); nhật ký chỉ đọc (TC-069) |

## 2. Tiêu chí vào / ra

| Tiêu chí vào | Tiêu chí ra |
|---|---|
| Mọi AC có test case (kiểm bằng `check_all.py`) | 100% test case đạt |
| Dữ liệu sinh lại được bằng seed cố định | Mọi BR có ít nhất một test case đạt |
| Prototype tải không lỗi JavaScript | RTM không còn dòng Không đạt / Chưa có test |

## 3. Kết quả

Chạy lại: `NODE_PATH=<node_modules có playwright> node 06-test/e2e/run.js` → [test-results.json](test-results.json), [test-cases.csv](test-cases.csv).

| Chỉ số | Giá trị |
|---|---|
| Số test case | 73 |
| Đạt | 73 (100%) |
| AC được phủ | 64/64 |
| BR được phủ | 30/30 |
| Yêu cầu trong RTM | 33 FR + 11 NFR; 41 Đạt, 3 kiểm chứng ngoài prototype ([rtm.md](rtm.md)) |
| Unit test mô hình dự báo | 9/9 đạt (`pytest tests`) |

## 4. Nhật ký lỗi phát hiện trong quá trình kiểm thử

| Mã | Mô tả | Mức | Phát hiện bởi | Nguyên nhân | Sửa | Test hồi quy |
|---|---|---|---|---|---|---|
| DEF-01 | Gửi form ghi đè SoH, lập lô, kích hoạt điểm làm trang tải lại, mất trạng thái | Cao | TC-030, TC-031, TC-041, TC-042 | Gán `form.onsubmit` đè thuộc tính `return false`, trình duyệt gửi form thật | Chặn gửi form mặc định ở mức tài liệu | TC-030, TC-031, TC-041, TC-042 |
| DEF-02 | Đề xuất gom lô không xuất hiện khi tồn kho đúng 80% | Trung bình | TC-019 (BVA) | So sánh số thực: 80% × sức chứa lớn hơn tồn kho ở chữ số thập phân thứ 15 | Thêm dung sai 1e-9 | TC-019, TC-051 |
| DEF-03 | Ô Hóa học của pin hãng khác luôn hiện | Thấp | Rà soát ảnh màn hình | CSS `display:grid` đè thuộc tính `hidden` | Thêm `[hidden]{display:none!important}` | TC-073 |
| DEF-04 | Quản trị sửa được R, Fs (trái ma trận quyền S14 §5) | Trung bình | Đối chiếu SRS ↔ prototype | Thiếu điều kiện vai trò | Khóa ô R, Fs với vai trò khác CMP | TC-072 |
| DEF-05 | Câu trích dẫn EU nối các mục liệt kê, không còn nguyên văn | Thấp | `check_all.py` | Bỏ ký hiệu (a), (b) khi trích | Thêm "..." đánh dấu lược bỏ | Kiểm trích dẫn trong `check_all.py` |
| DEF-06 | Tên trường bảng ánh xạ passport lệch từ điển dữ liệu | Thấp | Rà soát chéo S15 | Đặt tên trước khi có S15 | Thống nhất tên; thêm kiểm tự động | `check_all.py` mục 7 |

## 5. Kế hoạch UAT

| Mục | Nội dung |
|---|---|
| Thời gian | 2 tuần trước go-live MVP |
| Người tham gia | Chị Lan (Tuân thủ), Anh Hùng (Đại lý P01), Anh Quân và Anh Minh (Dịch vụ), Anh Tuấn (Kho vận), Chị Mai (Đơn vị tái chế R01) |
| Môi trường | Bản dựng UAT, dữ liệu ERP thật đã ẩn danh của 3 tháng |
| Tiêu chí chấp nhận | 100% kịch bản UAT đạt; không còn lỗi mức Cao; số liệu V năm 2026 khớp đối soát ERP/hải quan trong ±0,5% |

### Kịch bản UAT

| Mã | Kịch bản (theo use case) | Người thực hiện | Kết quả mong đợi | Đạt / Không |
|---|---|---|---|---|
| UAT-01 | Đơn bán thật từ ERP sinh mã pin (UC-01) | Tuân thủ | 100% đơn trong ngày có mã, không trùng | |
| UAT-02 | Tiếp nhận 20 pin, gồm 2 pin hãng khác và 1 pin phồng (UC-02) | Đại lý P01 | Mỗi pin ≤ 3 phút; pin phồng có hướng dẫn cách ly | |
| UAT-03 | Gom lô về trung tâm, cân lệch 1% và 3% (UC-02, UC-05) | Kho vận | 3% bắt buộc lý do, Tuân thủ nhận thông báo | |
| UAT-04 | Đánh giá SoH 10 pin, chế độ song song (UC-03, DEC-11) | Dịch vụ | Mọi pin đo tay; kết quả mô hình lưu để so | |
| UAT-05 | Điều phối 1 pin Đời thứ hai, người khác duyệt (UC-04) | Dịch vụ | Không tự duyệt được | |
| UAT-06 | Lập lô cho đối tác giấy phép sắp hết hạn và đã hết hạn (UC-05) | Kho vận | Cảnh báo / chặn đúng | |
| UAT-07 | Lập báo cáo EPR năm 2026 và xuất CSV (UC-06) | Tuân thủ | V khớp đối soát; F đúng công thức | |
| UAT-08 | Diễn tập khôi phục sao lưu (NFR-11) | Quản trị | Khôi phục trong 8 giờ, mất tối đa 24 giờ dữ liệu | |

### Biên bản nghiệm thu (mẫu)

| Mục | Nội dung |
|---|---|
| Hệ thống / phiên bản | Battery 2030 — MVP |
| Số kịch bản đạt / tổng | ___ / 8 |
| Lỗi còn mở (mức) | ___ |
| Kết luận | ☐ Chấp nhận · ☐ Chấp nhận có điều kiện · ☐ Không chấp nhận |
| Chủ sản phẩm | Ký, ghi rõ họ tên, ngày |
| Nhà tài trợ | Ký, ghi rõ họ tên, ngày |
