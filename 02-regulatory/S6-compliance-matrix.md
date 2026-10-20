# S6 — Ma trận tuân thủ EPR Việt Nam × EU Battery Regulation 2023/1542

> **Nguồn:** NĐ 110/2026/NĐ-CP (SRC-001) · Luật BVMT 2020 (SRC-002) · EU 2023/1542 (SRC-003) và sửa đổi 2025/1561 về thời hạn thẩm định chuỗi cung ứng (SRC-004) · tóm lược của Bộ Công Thương về cơ chế đóng góp EPR (SRC-014).
>
> **Miễn trừ.** Đây là phân tích nghiệp vụ phục vụ thiết kế hệ thống, không phải tư vấn pháp lý. Mọi dòng trích nguyên văn điều khoản gốc tại [req-extraction-vn.csv](req-extraction-vn.csv) và [req-extraction-eu.csv](req-extraction-eu.csv). Hiện trạng văn bản: ngày 20/10/2026.

## 1. Cách đọc

- **Việt Nam = yêu cầu bắt buộc.** Nền tảng phải đáp ứng NĐ 110/2026/NĐ-CP và Luật BVMT 2020.
- **EU = chuẩn tham chiếu.** Dùng để chỉ ra khoảng trống và thiết kế đón đầu. Khách hàng VELIX không bán pin vào EU (DEC-02).

| Mức | Nghĩa | Xử lý trong thiết kế |
|---|---|---|
| ⛔ | Việt Nam chưa có quy định tương ứng; thiếu nó thì không đo được mục tiêu của dự án (tỷ lệ thu hồi, đời thứ hai) | Nền tảng tự đặt yêu cầu theo chuẩn EU, gắn cờ *tự nguyện* |
| ⚠️ | Có quy định nhưng yếu, mơ hồ hoặc chỉ một phần | Đáp ứng VN; mở rộng trường dữ liệu để đạt mức EU |
| ✏️ | Khác biệt nhỏ, khác câu chữ, hoặc ngoài phạm vi nền tảng | Ghi nhận; không tạo yêu cầu riêng |

Mã phân hệ nền tảng (định nghĩa ở SRS S14): MOD-REG Sổ đăng ký pin · MOD-COL Thu hồi · MOD-SOH Đánh giá SoH · MOD-RTE Điều phối · MOD-EPR Báo cáo EPR · MOD-PSP Hồ sơ pin (passport) · MOD-PTN Đối tác.

## 2. Ba phát hiện chi phối

1. **Pin lithium xe điện hiện không có nghĩa vụ tái chế định lượng.** Phụ lục I NĐ 110 đặt tỷ lệ 0% (REQ-VN-16). Với F = R × V × Fs (REQ-VN-24), R = 0 nên số tiền đóng quỹ cũng bằng 0. Mốc điều chỉnh sớm nhất là 2029 (REQ-VN-11); dự thảo đề xuất 8% từ 2029, 15% từ 2032 (SRC-009).
2. **Ắc quy chì có nghĩa vụ ngay: 12%** (REQ-VN-15). Mẫu xe máy điện dùng ắc quy chì của VELIX phải đăng ký kế hoạch hoặc đóng quỹ từ năm trách nhiệm 2026, hạn trước 01/4/2027 (REQ-VN-22, REQ-VN-26).
3. **Việt Nam đo "khối lượng đã tái chế", EU đo "tỷ lệ thu gom".** VN không có chỉ tiêu thu gom, không có quy định đời thứ hai, không có định danh pin. Ba khoảng trống này là lý do nền tảng cần tồn tại: không có chúng thì không ai đo được pin đi đâu.

## 3. Ma trận

| Mã | Chủ đề | Việt Nam (bắt buộc) | EU (tham chiếu) | Mức | Tác động lên nền tảng |
|---|---|---|---|---|---|
| GAP-01 | Phân loại pin | Một nhóm "Pin Lithium, Pin NiMH sử dụng cho phương tiện giao thông" (REQ-VN-16); ắc quy chì nhóm riêng (REQ-VN-15) | Tách LMT ≤25 kg và pin xe điện (REQ-EU-01) | ⚠️ | Mỗi pin gắn hai mã nhóm: nhóm PL I NĐ 110 và nhóm EU (DEC-04) → MOD-REG |
| GAP-02 | Chủ thể chịu trách nhiệm | Bên ghi nhãn; được trừ khối lượng linh kiện đã có EPR (REQ-VN-05, REQ-VN-10) | Producer = bên đưa ra thị trường lần đầu (REQ-EU-02) | ✏️ | Lưu bên ghi nhãn và nhà cung cấp pin; tránh tính trùng → MOD-REG, MOD-EPR |
| GAP-03 | Đăng ký | Đăng ký kế hoạch tái chế hằng năm trên hệ thống EPR quốc gia (REQ-VN-22) | Đăng ký nhà sản xuất trước khi bán, khai nhóm và hóa học pin (REQ-EU-02, REQ-EU-03) | ✏️ | Lập kế hoạch năm từ sổ đăng ký pin → MOD-EPR |
| GAP-04 | Chỉ tiêu | Tỷ lệ tái chế theo khối lượng đưa ra thị trường cùng năm; Li 0%, chì 12% (REQ-VN-09, -15, -16) | Chỉ tiêu thu gom LMT 51% (2028), 61% (2031); mẫu số là bình quân 3 năm bán trước (REQ-EU-09, REQ-EU-10) | ⛔ | Tính cả hai chỉ số: khối lượng tái chế theo VN (bắt buộc) và tỷ lệ thu gom theo công thức EU (KPI tự nguyện) → MOD-EPR |
| GAP-05 | Mạng thu hồi | Không bắt buộc; "tự thực hiện tái chế" cho phép điểm thu hồi tại đại lý (Điều 3.8) | Thu hồi miễn phí, phủ toàn lãnh thổ, không phân biệt hãng (REQ-EU-07, -08, -11, -12) | ⛔ | Quản lý điểm thu hồi (đại lý, trạm đổi pin, đối tác), nhận pin mọi hãng, không thu phí người dùng → MOD-COL |
| GAP-06 | Đóng góp tài chính | F = R × V × Fs; Fs do Bộ trưởng ban hành (REQ-VN-24, -25) | Đóng góp bù toàn bộ chi phí thu gom, xử lý, báo cáo (REQ-EU-04) | ⛔ | Bảng tính F tham số hóa R, Fs theo năm; so sánh với chi phí thực để ra quyết định phương án → MOD-EPR, S21 |
| GAP-07 | Điều chỉnh phí theo thiết kế (eco-modulation) | Không có | Phí PRO điều chỉnh theo nhóm, hóa học, tái sử dụng (REQ-EU-05) | ⚠️ | Lưu hóa học pin và trạng thái đời thứ hai để tính được khi VN áp dụng → MOD-REG |
| GAP-08 | Đời thứ hai | Không có quy định; quy cách cho pin Li có "xuất khẩu ... cho đơn vị tái chế, tân trang ở nước ngoài" (REQ-VN-16) | Bằng chứng đánh giá SoH + hợp đồng chuyển giao (REQ-EU-15); đơn vị đưa pin đời thứ hai ra thị trường thành producer mới (REQ-EU-16) | ⛔ | Quyết định điều phối chỉ hợp lệ khi có hồ sơ SoH; xuất phiếu chuyển giao có hợp đồng → MOD-SOH, MOD-RTE |
| GAP-09 | Dữ liệu SoH | Không có | BMS lưu tham số SoH theo Phụ lục VII; bên mua hợp pháp được đọc (REQ-EU-13, -14) | ⛔ | Thu tham số SoH theo Phụ lục VII khi tiếp nhận; mô hình ước lượng khi thiếu → MOD-SOH, S18 |
| GAP-10 | Chứng từ chuỗi giao nhận | Hồ sơ thu gom, chuyển giao, tiếp nhận, xuất kho theo dõi riêng; mẫu chứng từ CTNH (REQ-VN-21) | Báo cáo lượng giao xử lý, xuất khẩu, giao tái sử dụng (REQ-EU-19) | ✏️ | Mỗi lần giao nhận sinh một chứng từ có mã, liên kết pin và lô → MOD-COL, MOD-RTE |
| GAP-11 | Điểm thu gom từ hộ gia đình | Không cần giấy phép xử lý CTNH nhưng phải làm nghĩa vụ chủ nguồn thải CTNH (REQ-VN-28) | Điểm thu gom tại nhà phân phối không cần giấy phép chất thải (Art. 60(6)) | ✏️ | Mỗi điểm thu hồi lưu hồ sơ chủ nguồn thải và giới hạn lưu chứa → MOD-COL |
| GAP-12 | Đối tác xử lý | Đơn vị tái chế phải có giấy phép môi trường phù hợp; PRO nghiệm thu khối lượng, không ủy quyền lại (REQ-VN-19, -20) | Chọn đơn vị xử lý theo tiêu chí minh bạch (Art. 57(8)) | ⚠️ | Chặn bàn giao cho đối tác hết hạn giấy phép → MOD-PTN |
| GAP-13 | Báo cáo | Kế hoạch + kết quả tái chế, hoặc kê khai đóng quỹ, trước 01/4; nộp tiền trước 20/4 (REQ-VN-22, -26, -27) | Báo cáo năm: bán, thu gom, tỷ lệ thu gom, giao xử lý, xuất khẩu, giao tái sử dụng (REQ-EU-19) | ⚠️ | Báo cáo EPR VN đúng hạn + bộ chỉ số EU làm KPI nội bộ → MOD-EPR |
| GAP-14 | Hiệu suất tái chế | Quy cách tái chế theo giải pháp, không có tỷ lệ thu hồi vật liệu (REQ-VN-14) | Hiệu suất tái chế pin Li 65% → 70%; thu hồi Li 50% → 80% (REQ-EU-17, -18) | ⚠️ | Lưu khối lượng vật liệu thu hồi do nhà tái chế báo về (tùy chọn) → MOD-PTN |
| GAP-15 | Định danh và passport | Không có | Passport cho mỗi pin LMT/xe điện từ 18/2/2027; mã định danh ISO/IEC 15459; trạng thái original/repurposed/re-used/remanufactured/waste; đóng khi đã tái chế (REQ-EU-20 – 24) | ⛔ | Mã định danh duy nhất cho từng pin từ lúc đăng ký; hồ sơ pin theo khung Battery Pass; vòng đời trạng thái khớp Annex XIII → MOD-REG, MOD-PSP |
| GAP-16 | Người dùng cuối | Không có nghĩa vụ | Thải pin riêng tại điểm chỉ định (REQ-EU-28) | ⚠️ | Thông tin điểm trả pin gần nhất cho người dùng (cổng tra cứu) → MOD-COL |
| GAP-17 | Thiết kế, chuỗi cung ứng, hàm lượng tái chế | Không có | Tháo thay pin LMT (REQ-EU-25); thẩm định chuỗi cung ứng từ 18/8/2027 (REQ-EU-26); hàm lượng tái chế LMT từ 2033 (REQ-EU-27) | ✏️ | Ngoài phạm vi; passport chừa trường dữ liệu |
| GAP-18 | Chuyển tiếp và thay đổi quy định | Năm ≤2025 theo NĐ 08; từ 2026 theo NĐ 110 (REQ-VN-31); tỷ lệ và Fs điều chỉnh 3 năm/lần từ 2029 (REQ-VN-11, -25) | Ngày áp dụng cố định theo điều khoản; Ủy ban có quyền sửa bằng văn bản ủy quyền | ⚠️ | Bảng tham số quy định có hiệu lực theo năm trách nhiệm → MOD-EPR (cấu hình) |

**Tổng hợp:** 6 ⛔ · 7 ⚠️ · 5 ✏️ trên 18 chủ đề.

## 4. Quyết định thiết kế rút ra

| Mã | Quyết định | Từ |
|---|---|---|
| D-REG-1 | Định danh duy nhất cho từng pin ngay khi đưa ra thị trường, định dạng tương thích ISO/IEC 15459 | GAP-15 |
| D-REG-2 | Hai trục phân loại pin (VN · EU) | GAP-01 |
| D-COL-1 | Nhận pin mọi hãng, miễn phí, ghi nguồn gốc pin của hãng khác riêng (được tính theo REQ-VN-12) | GAP-05, REQ-VN-12 |
| D-SOH-1 | Không có hồ sơ SoH thì không được chọn đời thứ hai | GAP-08, GAP-09 |
| D-EPR-1 | Tỷ lệ R, Fs, hạn nộp là tham số theo năm trách nhiệm; không ghi cứng | GAP-18 |
| D-EPR-2 | Song song hai chỉ số: khối lượng tái chế (VN) và tỷ lệ thu gom bình quân 3 năm (EU) | GAP-04 |
| D-PTN-1 | Chặn bàn giao khi giấy phép đối tác hết hạn | GAP-12 |

## 5. Câu hỏi pháp lý mở

| Mã | Câu hỏi | Ảnh hưởng | Cách xử lý tạm |
|---|---|---|---|
| LQ-01 | Định mức Fs của TT 07/2025/TT-BTNMT (ban hành theo NĐ 08/2022) có tiếp tục áp dụng sau NĐ 110/2026 đến khi Bộ ban hành mức mới không? | Phương án B của business case | Dùng Phụ lục IXa TT 07/2025: chì 18.278, pin sạc 54.876 đ/kg (SRC-023; ASM-15, ASM-16) |
| LQ-02 | Pin Li thải từ xe máy điện có thuộc danh mục chất thải nguy hại cần chứng từ CTNH khi vận chuyển không? | Chi phí logistics, mẫu chứng từ | Thiết kế theo mẫu chứng từ CTNH (REQ-VN-21) — phương án an toàn |
| LQ-03 | Pin đời thứ hai bán lại trong nước có phải đăng ký là sản phẩm mới đưa ra thị trường không? | Ai chịu EPR cho pin đời thứ hai | Áp nguyên tắc EU Art. 56(2): đơn vị đưa ra thị trường chịu EPR (ghi nhận, không bắt buộc) |
| LQ-04 | Dự thảo sửa đổi Luật BVMT (trình Quốc hội 10/2026) có thêm chỉ tiêu thu gom pin xe điện không? | Phạm vi MOD-EPR | Tham số hóa chỉ tiêu (D-EPR-1) |
| LQ-05 | Mẫu biểu kế hoạch/báo cáo theo NĐ 110 (Bộ trưởng quy định) có trường nào ngoài khối lượng? | Định dạng xuất báo cáo | Mô hình hóa theo các trường nêu trong Điều 7, 8 |
