<!-- SINH TỰ ĐỘNG bởi tools/build_docs.py — không sửa tay -->

# S14 — Phụ lục: danh mục yêu cầu

## 1. Yêu cầu chức năng

### MOD-REG — Sổ đăng ký pin

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-01 | Hệ thống phải cho phép đăng ký model pin với hóa học, dung lượng (Ah, kWh), điện áp danh định, khối lượng, nhà sản xuất, bên ghi nhãn, thời hạn bảo hành, liên kết tài liệu tháo dỡ và an toàn; và tự gán nhóm Phụ lục I và nhóm EU. | Must | NEED-01; NEED-11; GAP-01; GAP-02; GAP-07 | BR-03; BR-05 |
| FR-02 | Hệ thống phải nhận đơn bán và phiếu xuất pin thay thế từ ERP, tạo bản ghi pin với ngày đưa ra thị trường và cấp mã định danh duy nhất. | Must | NEED-02; GAP-15; REQ-VN-09 | BR-01; BR-02 |
| FR-03 | Hệ thống phải cho phép gắn cờ loại trừ (xuất khẩu, nghiên cứu/thử nghiệm) và cờ nhà cung cấp đã thực hiện EPR cho từng pin. | Must | REQ-VN-06; REQ-VN-10 | BR-04 |
| FR-04 | Hệ thống phải cho phép tra cứu sổ đăng ký pin theo mã định danh, số khung, model, nhóm, trạng thái và năm đưa ra thị trường. | Must | NEED-02 | — |

### MOD-COL — Thu hồi

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-05 | Hệ thống phải quản lý điểm thu hồi (đại lý, trạm đổi pin, đối tác) gồm địa chỉ, giờ mở cửa, sức chứa, hồ sơ chủ nguồn thải chất thải nguy hại và trạng thái kích hoạt. | Must | REQ-VN-28; GAP-05; GAP-11 | BR-09 |
| FR-06 | Hệ thống phải cho phép lập phiếu tiếp nhận pin gồm mã pin (quét hoặc nhập), pin hãng khác, checklist an toàn, khối lượng cân, ảnh và dữ liệu BMS tùy chọn, không thu phí người trả pin. | Must | NEED-03; GAP-05; REQ-EU-11 | BR-06; BR-07 |
| FR-07 | Hệ thống phải cho phép lập phiếu tiếp nhận khi mất kết nối và đồng bộ khi có kết nối. | Should | NEED-03 | BR-30 |
| FR-08 | Hệ thống phải theo dõi tồn kho từng điểm thu hồi và tạo đề xuất gom lô theo ngưỡng. | Must | NEED-04 | BR-08 |
| FR-09 | Hệ thống phải cho phép lập lô vận chuyển, sinh chứng từ giao nhận có số, và cho bên nhận xác nhận khối lượng cân với kiểm tra chênh lệch. | Must | NEED-07; REQ-VN-21; GAP-10 | BR-16 |
| FR-10 | Hệ thống phải cung cấp cổng tra cứu công khai điểm trả pin, giờ mở cửa và hướng dẫn thải pin an toàn. | Should | NEED-12; GAP-16 | BR-28 |

### MOD-SOH — Đánh giá SoH

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-11 | Hệ thống phải thu các tham số SoH theo Phụ lục VII EU 2023/1542 (dung lượng còn lại, điện trở, số chu kỳ tương đương, sự kiện xả sâu, thời gian ở nhiệt độ khắc nghiệt) từ dữ liệu BMS hoặc nhập tay. | Must | NEED-05; GAP-09; REQ-EU-14 | — |
| FR-12 | Hệ thống phải ước lượng SoH bằng mô hình kèm khoảng tin cậy 90% và chuyển pin sang hàng chờ đo tay theo điều kiện quy định. | Must | NEED-05; S18 | BR-10 |
| FR-13 | Hệ thống phải cho phép ghi kết quả đo tay và ghi đè kết quả có lý do, lưu vết thay đổi. | Must | NEED-05; S18 | BR-14 |

### MOD-RTE — Điều phối

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-14 | Hệ thống phải đề xuất hướng điều phối (Đời thứ hai, Tái chế) theo bảng quyết định và chặn hướng không hợp lệ. | Must | NEED-06; GAP-08 | BR-11; BR-12; BR-29 |
| FR-15 | Hệ thống phải yêu cầu phê duyệt quyết định Đời thứ hai bởi Trưởng dịch vụ khác người đề xuất. | Must | NEED-06 | BR-13 |
| FR-16 | Hệ thống phải cho phép bàn giao pin đời thứ hai cho đối tác kèm số hợp đồng hoặc hóa đơn và hồ sơ SoH. | Should | NEED-06; REQ-EU-15 | BR-11; BR-25 |

### MOD-PTN — Đối tác

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-17 | Hệ thống phải quản lý đối tác (tái chế, đời thứ hai, PRO, vận chuyển) và giấy phép môi trường gồm số, ngày hiệu lực, ngày hết hạn, nhóm pin được phép. | Must | NEED-08; REQ-VN-19 | BR-15 |
| FR-18 | Hệ thống phải chặn bàn giao lô khi giấy phép của đơn vị nhận không hợp lệ và cảnh báo giấy phép sắp hết hạn trong 60 ngày. | Must | NEED-08; D-PTN-1 | BR-15 |
| FR-19 | Hệ thống phải cho đơn vị tái chế xác nhận đã tái chế theo quy cách và (tùy chọn) khối lượng vật liệu thu hồi. | Must | REQ-VN-14; GAP-14 | BR-17; BR-26 |

### MOD-EPR — Báo cáo EPR

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-20 | Hệ thống phải quản lý bảng tham số quy định theo năm trách nhiệm và nhóm Phụ lục I: R, Fs, hạn nộp, văn bản căn cứ. | Must | GAP-18; D-EPR-1 | BR-19; BR-22 |
| FR-21 | Hệ thống phải cho chọn hình thức và cách thức thực hiện trách nhiệm tái chế cho mỗi nhóm trong mỗi năm. | Must | REQ-VN-17; REQ-VN-18 | BR-20 |
| FR-22 | Hệ thống phải tính V, khối lượng phải tái chế R × V, kết quả tái chế đã xác nhận và sổ bảo lưu theo nhóm và năm. | Must | NEED-01; NEED-09 | BR-04; BR-17; BR-18 |
| FR-23 | Hệ thống phải tính số tiền đóng góp F = R × V × Fs cho nhóm chọn đóng góp tài chính. | Must | NEED-09; REQ-VN-24; GAP-06 | BR-19 |
| FR-24 | Hệ thống phải xuất hồ sơ kế hoạch, báo cáo kết quả hoặc kê khai đóng góp theo năm và nhóm thành tệp CSV để nộp lên Hệ thống thông tin EPR quốc gia. | Must | NEED-09; REQ-VN-22; REQ-VN-26; GAP-13 | — |
| FR-25 | Hệ thống phải nhắc hạn nộp hồ sơ và nộp tiền. | Must | NEED-09 | BR-21 |
| FR-26 | Hệ thống phải hiển thị bảng điều khiển: tỷ lệ thu gom kiểu EU, phân bổ kết quả điều phối, khối lượng theo trạng thái, việc sắp đến hạn. | Should | NEED-10; GAP-04 | BR-23 |

### MOD-PSP — Hồ sơ pin

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-27 | Hệ thống phải hiển thị hồ sơ pin gồm các trường MVP của bảng ánh xạ passport và trạng thái vòng đời. | Should | NEED-11; GAP-15 | BR-24 |
| FR-28 | Hệ thống phải hiển thị dòng thời gian sự kiện của từng pin từ khi đăng ký đến khi đóng hồ sơ. | Must | NEED-02 | BR-24 |
| FR-29 | Hệ thống phải tạo hồ sơ mới cho pin đời thứ hai liên kết hồ sơ gốc. | Should | REQ-EU-22 | BR-25 |
| FR-30 | Hệ thống phải đóng hồ sơ pin đã tái chế ở chế độ chỉ đọc và lưu trữ theo thời hạn cấu hình. | Must | REQ-EU-23 | BR-26 |

### MOD-ADM — Quản trị

| Mã | Yêu cầu | Ưu tiên | Nguồn | Quy tắc |
|---|---|---|---|---|
| FR-31 | Hệ thống phải quản lý người dùng, vai trò và phạm vi dữ liệu (điểm thu hồi, đối tác, nhà sản xuất). | Must | S4; GAP-12 | BR-27 |
| FR-32 | Hệ thống phải ghi nhật ký kiểm toán cho mọi thay đổi dữ liệu nghiệp vụ và cho phép tra cứu. | Must | S18; REQ-VN-22 | BR-14 |
| FR-33 | Hệ thống phải cho quản lý tham số vận hành PAR-01 – PAR-11 mà không cần sửa mã nguồn. | Must | D-EPR-1; DEC-08 | BR-08 |

## 2. Yêu cầu phi chức năng

| Mã | Nhóm | Yêu cầu | Thước đo | Nguồn | Cách kiểm chứng |
|---|---|---|---|---|---|
| NFR-01 | Hiệu năng | Thao tác tiếp nhận một pin tại điểm thu hồi (từ mở form đến lưu phiếu) không quá 3 phút với người dùng đã được hướng dẫn; mỗi màn hình phản hồi trong 2 giây ở phân vị 95 với 1 triệu hồ sơ pin. | ≤3 phút; ≤2 s p95 | INT-02; NEED-03 | Kiểm thử (TC-071) + đo thời gian ở UAT |
| NFR-02 | Ngoại tuyến | Thiết bị tại điểm thu hồi lưu được ít nhất 200 phiếu khi mất kết nối và đồng bộ không tạo phiếu trùng. | ≥200 phiếu; 0 phiếu trùng | BR-30 | Kiểm thử (TC-018) |
| NFR-03 | Sẵn sàng | Hệ thống sẵn sàng 99,5% mỗi tháng trong giờ 07:00–21:00. | 99,5% | S1 §4 | Phân tích kiến trúc + giám sát vận hành |
| NFR-04 | Bảo mật | Mã hóa đường truyền TLS 1.2 trở lên; mật khẩu lưu dạng băm có muối; xác thực hai lớp cho vai trò Tuân thủ và Quản trị. | 100% phiên | S14 §5 | Kiểm tra cấu hình + kiểm thử bảo mật ở SIT |
| NFR-05 | Quyền riêng tư | Chỉ thu thông tin cá nhân của người trả pin khi cần liên hệ và có đồng ý; cổng công khai không hiển thị dữ liệu cá nhân; tuân thủ pháp luật bảo vệ dữ liệu cá nhân hiện hành. | 0 trường cá nhân trên cổng công khai | BR-28 | Kiểm thử (TC-023) |
| NFR-06 | Lưu vết | Nhật ký kiểm toán không cho sửa, xóa; lưu tối thiểu theo PAR-09. | 10 năm | BR-14; BR-26 | Kiểm thử (TC-031, TC-069) |
| NFR-07 | Liên thông | Mã định danh tương thích ISO/IEC 15459; xuất hồ sơ pin dạng JSON theo tên thuộc tính Battery Pass Data Model v1.2; API REST mô tả bằng OpenAPI 3. | Kiểm bằng lược đồ | REQ-EU-21; SRC-015 | Kiểm thử (TC-008) + kiểm lược đồ OpenAPI |
| NFR-08 | Cấu hình | Thay R, Fs, hạn nộp, ngưỡng vận hành không cần phát hành phần mềm mới. | 0 lần sửa mã | D-EPR-1; DEC-08 | Kiểm thử (TC-049, TC-051) |
| NFR-09 | Khả dụng | Màn hình tiếp nhận dùng được trên điện thoại rộng 360 px; giao diện tiếng Việt. | 360 px | INT-02 | Kiểm thử (TC-070) |
| NFR-10 | Đa tenant | Dữ liệu tách theo nhà sản xuất; truy vấn không trả dữ liệu của tenant khác. | 0 bản ghi chéo | BR-27 | Kiểm thử (TC-068) |
| NFR-11 | Sao lưu | Sao lưu hằng ngày; mục tiêu điểm khôi phục 24 giờ, thời gian khôi phục 8 giờ. | RPO 24 h; RTO 8 h | S1 §4 | Diễn tập khôi phục ở UAT |

## 3. Quy tắc nghiệp vụ (EARS)

| Mã | Phân hệ | Quy tắc | Tham số | Căn cứ | Test |
|---|---|---|---|---|---|
| BR-01 | MOD-REG | KHI một pin được đưa ra thị trường (đơn bán hoặc phiếu xuất pin thay thế được xác nhận), HỆ THỐNG PHẢI cấp cho pin một mã định danh duy nhất; mã đã cấp không được cấp lại cho pin khác, kể cả khi pin bị hủy đăng ký. | — | D-REG-1; REQ-EU-21; NEED-02 | TC-006, TC-007, TC-008 |
| BR-02 | MOD-REG | HỆ THỐNG PHẢI tạo mã định danh theo cấu trúc tương thích ISO/IEC 15459: tiền tố tổ chức của VELIX + mã model + hai số cuối năm đưa ra thị trường + số thứ tự 7 chữ số + chữ số kiểm tra Luhn tính trên dãy số năm và số thứ tự; ví dụ VLX-LF48-26-0001234-4. | Tiền tố tổ chức (PAR-01) | REQ-EU-21 | TC-006 |
| BR-03 | MOD-REG | KHI đăng ký model pin, HỆ THỐNG PHẢI tự gán (a) nhóm Phụ lục I NĐ 110 theo hóa học và mục đích sử dụng: chì → B.1.1 Ắc quy chì; Li hoặc NiMH dùng cho phương tiện giao thông → B.2.1 (phương tiện); và (b) nhóm EU theo khối lượng: kín và ≤25 kg cho xe hạng L → LMT, >25 kg → pin xe điện. | Ngưỡng LMT 25 kg (PAR-02) | DEC-04; REQ-VN-15; REQ-VN-16; REQ-EU-01 | TC-001, TC-002, TC-003, TC-004 |
| BR-04 | MOD-EPR | KHI tính khối lượng V của một năm trách nhiệm và một nhóm Phụ lục I, HỆ THỐNG PHẢI cộng khối lượng các pin có ngày đưa ra thị trường thuộc năm đó, loại trừ pin có cờ xuất khẩu hoặc nghiên cứu/thử nghiệm và pin có cờ nhà cung cấp đã thực hiện EPR. | — | REQ-VN-06; REQ-VN-09; REQ-VN-10; NEED-01 | TC-009, TC-010, TC-054 |
| BR-05 | MOD-REG | HỆ THỐNG PHẢI ghi chủ thể chịu trách nhiệm EPR của mỗi pin là bên ghi nhãn hàng hóa; khi bên ghi nhãn khác bên sản xuất thì lưu cả hai. | — | REQ-VN-05 | TC-005 |
| BR-06 | MOD-COL | KHI một điểm thu hồi tiếp nhận pin, HỆ THỐNG PHẢI cho phép tiếp nhận pin của mọi hãng, không phát sinh phí cho người trả pin, không yêu cầu mua pin mới; pin không có mã VELIX được cấp mã tạm và gắn cờ Hãng khác. | — | D-COL-1; REQ-EU-11; REQ-VN-12; NEED-03 | TC-014, TC-015, TC-073 |
| BR-07 | MOD-COL | NẾU checklist an toàn khi tiếp nhận có ít nhất một dấu hiệu: phồng, rò rỉ, nứt vỏ, đã va chạm, nóng bất thường, THÌ HỆ THỐNG PHẢI gắn cờ Nguy hiểm, yêu cầu lưu chứa cách ly và loại pin khỏi đời thứ hai. | — | SRC-003 Phụ lục XII Part A; NEED-04 | TC-017 |
| BR-08 | MOD-COL | KHI tồn kho tại một điểm thu hồi đạt từ 80% sức chứa khai báo, HOẶC có pin gắn cờ Nguy hiểm lưu quá 72 giờ, HOẶC có pin lưu quá 30 ngày, HỆ THỐNG PHẢI tạo đề xuất gom lô cho Kho vận. | 80% (PAR-03); 72 giờ (PAR-04); 30 ngày (PAR-05) | NEED-04; DEC-08 | TC-019, TC-020, TC-021, TC-051 |
| BR-09 | MOD-COL | HỆ THỐNG PHẢI chỉ kích hoạt một điểm thu hồi khi điểm đó có hồ sơ chủ nguồn thải chất thải nguy hại (mã số và ngày hiệu lực). | — | REQ-VN-28 | TC-012, TC-013, TC-016 |
| BR-10 | MOD-SOH | KHI mô hình ước lượng SoH cho một pin, HỆ THỐNG PHẢI hiển thị SoH và khoảng tin cậy 90%; NẾU dữ liệu BMS thiếu trường bắt buộc, HOẶC độ rộng khoảng tin cậy lớn hơn 10 điểm phần trăm, HOẶC khoảng tin cậy chứa ngưỡng điều phối, THÌ HỆ THỐNG PHẢI chuyển pin sang trạng thái Chờ đo tay. | Độ rộng tối đa 10 điểm (PAR-06) | S18; NEED-05 | TC-024, TC-025, TC-026, TC-027, TC-028, TC-029 |
| BR-11 | MOD-RTE | HỆ THỐNG PHẢI không cho phép chọn hướng Đời thứ hai cho pin chưa có hồ sơ SoH hợp lệ (đo tay hoặc mô hình đủ tin cậy). | — | D-SOH-1; REQ-EU-15 | TC-029, TC-036 |
| BR-12 | MOD-RTE | KHI pin có hồ sơ SoH hợp lệ, HỆ THỐNG PHẢI đề xuất hướng điều phối theo bảng quyết định: ắc quy chì → Tái chế; cờ Nguy hiểm → Tái chế; SoH ≥ ngưỡng đời thứ hai → Đời thứ hai; SoH < ngưỡng → Tái chế. | Ngưỡng đời thứ hai 70% (PAR-07) | SRC-008; ASM-10; NEED-06 | TC-017, TC-032, TC-033, TC-034, TC-035 |
| BR-13 | MOD-RTE | KHI một quyết định Đời thứ hai được đề xuất, HỆ THỐNG PHẢI yêu cầu phê duyệt bởi người có vai trò Trưởng dịch vụ khác người đề xuất trước khi bàn giao. | — | S4 RACI; NEED-06 | TC-037, TC-038 |
| BR-14 | MOD-SOH | KHI người dùng ghi đè kết quả SoH hoặc hướng điều phối đề xuất, HỆ THỐNG PHẢI bắt buộc nhập lý do và lưu vết người, thời điểm, giá trị cũ, giá trị mới. | — | S18 | TC-030, TC-031, TC-049, TC-069 |
| BR-15 | MOD-PTN | NẾU giấy phép môi trường của đơn vị nhận đã hết hạn tại ngày bàn giao HOẶC không bao gồm nhóm Phụ lục I của pin trong lô, THÌ HỆ THỐNG PHẢI chặn bàn giao lô. | — | REQ-VN-19; D-PTN-1; NEED-08 | TC-041, TC-042, TC-043 |
| BR-16 | MOD-COL | KHI một lô được giao nhận, HỆ THỐNG PHẢI sinh chứng từ giao nhận có số duy nhất kèm danh sách pin và khối lượng gửi; KHI bên nhận nhập khối lượng cân, NẾU chênh lệch vượt 2% THÌ HỆ THỐNG PHẢI bắt buộc ghi lý do và thông báo cho Tuân thủ. | Ngưỡng chênh lệch 2% (PAR-08) | REQ-VN-21; NEED-07 | TC-022, TC-044, TC-045, TC-046, TC-047 |
| BR-17 | MOD-EPR | HỆ THỐNG PHẢI chỉ tính khối lượng vào kết quả tái chế khi đơn vị tái chế xác nhận đã tái chế theo quy cách của nhóm Phụ lục I tương ứng. | — | REQ-VN-14 | TC-048, TC-056 |
| BR-18 | MOD-EPR | KHI kết quả tái chế của một năm trách nhiệm vượt khối lượng phải tái chế R × V, HỆ THỐNG PHẢI ghi phần vượt vào sổ bảo lưu và cho phép dùng cho các năm sau. | — | REQ-VN-13 | TC-056 |
| BR-19 | MOD-EPR | KHI nhóm sản phẩm chọn hình thức Đóng góp tài chính, HỆ THỐNG PHẢI tính F = R × V × Fs, trong đó R và Fs lấy từ bảng tham số có hiệu lực của năm trách nhiệm. | R; Fs (PAR-10) | REQ-VN-24; REQ-VN-25; D-EPR-1 | TC-049, TC-054, TC-055, TC-057 |
| BR-20 | MOD-EPR | HỆ THỐNG PHẢI cho mỗi nhóm Phụ lục I chọn đúng một hình thức trong một năm trách nhiệm (Tổ chức tái chế hoặc Đóng góp tài chính); với Tổ chức tái chế, phải chọn cách thức: tự thực hiện, hợp đồng đơn vị tái chế, ủy quyền PRO hoặc kết hợp. | — | REQ-VN-17; REQ-VN-18; REQ-VN-02 | TC-052, TC-053 |
| BR-21 | MOD-EPR | HỆ THỐNG PHẢI nhắc hạn nộp kế hoạch, báo cáo hoặc kê khai trước ngày 01/4 và hạn nộp tiền trước ngày 20/4 của năm sau năm trách nhiệm, vào các mốc 30, 7 và 1 ngày trước hạn. | Hạn 01/4 và 20/4 (PAR-11) | REQ-VN-22; REQ-VN-26; REQ-VN-27; NEED-09 | TC-058 |
| BR-22 | MOD-EPR | HỆ THỐNG PHẢI áp bộ tham số quy định theo năm trách nhiệm: năm từ 2025 trở về trước theo NĐ 08/2022; từ 2026 theo NĐ 110/2026. | — | REQ-VN-31 | TC-050 |
| BR-23 | MOD-EPR | HỆ THỐNG PHẢI tính tỷ lệ thu gom năm t của từng nhóm EU bằng khối lượng thu gom chính thức năm t chia bình quân khối lượng đưa ra thị trường của ba năm t−1, t−2, t−3; hiển thị Chưa đủ dữ liệu khi thiếu năm nào. | — | REQ-EU-10; D-EPR-2; NEED-10 | TC-060, TC-061 |
| BR-24 | MOD-PSP | HỆ THỐNG PHẢI chỉ cho phép chuyển trạng thái pin theo vòng đời: Đang lưu hành → Đã thu hồi → Đã đánh giá → (Đời thứ hai hoặc Chờ tái chế) → Đã bàn giao → Đã tái chế; trạng thái passport tương ứng original → waste → repurposed (đời thứ hai) hoặc waste (tái chế). | — | REQ-EU-24; NEED-11 | TC-014, TC-038, TC-040, TC-048, TC-062, TC-063, TC-064 |
| BR-25 | MOD-PSP | KHI một pin được bàn giao cho đời thứ hai, HỆ THỐNG PHẢI tạo hồ sơ pin mới trạng thái repurposed liên kết hồ sơ gốc và ghi đơn vị nhận là chủ thể đưa ra thị trường. | — | REQ-EU-22; REQ-EU-16; LQ-03 | TC-039, TC-040 |
| BR-26 | MOD-PSP | KHI đơn vị tái chế xác nhận đã tái chế, HỆ THỐNG PHẢI đóng hồ sơ pin (chỉ đọc) và lưu trữ hồ sơ trong thời hạn cấu hình. | 10 năm (PAR-09) | REQ-EU-23; NEED-11 | TC-048 |
| BR-27 | MOD-ADM | HỆ THỐNG PHẢI giới hạn dữ liệu theo phạm vi: đại lý chỉ thấy điểm thu hồi của mình; đối tác chỉ thấy lô giao cho mình; mọi dữ liệu thuộc về một nhà sản xuất (tenant) và không hiển thị chéo giữa các nhà sản xuất. | — | GAP-12; S14 §5 | TC-065, TC-066, TC-067, TC-068, TC-072 |
| BR-28 | MOD-COL | HỆ THỐNG PHẢI không hiển thị dữ liệu cá nhân của người trả pin trên cổng tra cứu công khai; cổng chỉ hiển thị điểm trả pin, giờ mở cửa và hướng dẫn an toàn. | — | NEED-12 | TC-023 |
| BR-29 | MOD-RTE | HỆ THỐNG PHẢI không đề xuất và không cho phép chọn Đời thứ hai cho pin nhóm Ắc quy chì. | — | ASM-10; SRC-022 | TC-035 |
| BR-30 | MOD-COL | KHI thiết bị tại điểm thu hồi mất kết nối, HỆ THỐNG PHẢI cho phép lập phiếu tiếp nhận, lưu tạm trên thiết bị với số phiếu duy nhất (mã thiết bị + số thứ tự) và đồng bộ khi có kết nối mà không tạo trùng. | — | NEED-03; INT-02 | TC-018 |
