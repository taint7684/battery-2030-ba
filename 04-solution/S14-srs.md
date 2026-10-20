# S14 — Đặc tả yêu cầu phần mềm (SRS)

Theo cấu trúc ISO/IEC/IEEE 29148. Danh mục FR, NFR, BR đầy đủ ở [S14-srs-appendix.md](S14-srs-appendix.md) (sinh tự động từ `04-solution/trace/*.csv`, không sửa tay).

## 1. Giới thiệu

| Mục | Nội dung |
|---|---|
| Mục đích | Đặc tả nền tảng Battery 2030 cho VELIX: quản lý vòng đời pin và trách nhiệm EPR |
| Phạm vi | 8 phân hệ (MOD-REG, COL, SOH, RTE, PTN, EPR, PSP, ADM); 33 FR, 11 NFR, 30 BR, 8 yêu cầu AI |
| Người đọc | Chủ sản phẩm, đội phát triển, kiểm thử, Tuân thủ |
| Thuật ngữ | [glossary.md](../00-management/glossary.md) |
| Tài liệu tham chiếu | NĐ 110/2026 (SRC-001); Luật BVMT 2020 (SRC-002); EU 2023/1542 (SRC-003); Battery Pass Data Model v1.2 (SRC-015); [S6](../02-regulatory/S6-compliance-matrix.md); [S13](S13-bpmn/to-be.md) |

## 2. Mô tả tổng quan

### 2.1 Bối cảnh hệ thống

[context-diagram.md](../01-discovery/context-diagram.md). Hệ thống nhận đơn bán từ ERP, phiếu tiếp nhận từ đại lý, kết quả cân và xác nhận tái chế từ đối tác; xuất tệp hồ sơ EPR để nộp thủ công lên Hệ thống thông tin EPR quốc gia (chưa có API công bố).

### 2.2 Vai trò người dùng

| Mã | Vai trò | Persona | Bên liên quan |
|---|---|---|---|
| ROLE-CMP | Cán bộ tuân thủ | P1 Chị Lan | SH-02 |
| ROLE-DLR | Đại lý / trạm đổi pin | P2 Anh Hùng | SH-05, SH-06 |
| ROLE-TEC | Kỹ thuật viên SoH | P4 Anh Quân | SH-03 |
| ROLE-TEC_LEAD | Trưởng dịch vụ | — | SH-03 |
| ROLE-LOG | Kho vận | — | SH-04 |
| ROLE-RCY | Đơn vị tái chế (cổng đối tác) | P3 Chị Mai | SH-08 |
| ROLE-MGT | Ban điều hành | — | SH-01 |
| ROLE-ADM | Quản trị hệ thống | — | SH-15 |
| ROLE-PUB | Người dùng xe (không đăng nhập) | — | SH-07 |

### 2.3 Ràng buộc

- Tỷ lệ R, Fs, hạn nộp có thể đổi từ 2029 (REQ-VN-11, REQ-VN-25) → tham số hóa (NFR-08).
- Đại lý có thể mất kết nối (NFR-02).
- Mô hình SoH chỉ chạy song song ở MVP (DEC-11).

## 3. Yêu cầu chức năng

33 FR theo 8 phân hệ: [S14-srs-appendix.md §1](S14-srs-appendix.md#1-yêu-cầu-chức-năng). Use case lõi: [use-cases.md](use-cases.md).

### 3.1 Bảng quyết định điều phối (BR-11, BR-12, BR-29, BR-07)

| # | Nhóm Phụ lục I | Cờ Nguy hiểm | Hồ sơ SoH hợp lệ | SoH so với PAR-07 (70%) | Đề xuất | Cho chọn Đời thứ hai |
|---|---|---|---|---|---|---|
| R1 | B.1.1 Ắc quy chì | bất kỳ | không cần | — | Tái chế | Không |
| R2 | B.2.1 Li | Có | bất kỳ | bất kỳ | Tái chế | Không |
| R3 | B.2.1 Li | Không | Không | — | (chưa đề xuất) | Không — chờ SoH |
| R4 | B.2.1 Li | Không | Có | ≥ 70% | Đời thứ hai | Có (cần phê duyệt BR-13) |
| R5 | B.2.1 Li | Không | Có | < 70% | Tái chế | Không |

SoH dùng để so: giá trị ghi đè (nếu có) → đo tay → mô hình. Kiểm bằng TC-017, TC-032 – TC-036.

### 3.2 Quy tắc chuyển đo tay (BR-10)

| # | Thiếu trường BMS bắt buộc | Độ rộng khoảng 90% > PAR-06 (10 điểm) | Khoảng chứa ngưỡng PAR-07 | Kết quả |
|---|---|---|---|---|
| S1 | Có | — | — | Chờ đo tay — Thiếu dữ liệu BMS |
| S2 | Không | Có | — | Chờ đo tay — Độ không chắc chắn cao |
| S3 | Không | Không | Có | Chờ đo tay — Khoảng tin cậy chứa ngưỡng |
| S4 | Không | Không | Không | Hợp lệ — Mô hình |

Trường BMS bắt buộc (Phụ lục VII EU): dung lượng còn lại, mức tăng điện trở, số chu kỳ tương đương, số lần xả sâu, số giờ ở nhiệt độ khắc nghiệt.

## 4. Yêu cầu phi chức năng

11 NFR: [S14-srs-appendix.md §2](S14-srs-appendix.md#2-yêu-cầu-phi-chức-năng).

## 5. Phân quyền (RBAC) và phạm vi dữ liệu

X = được dùng · R = chỉ xem · — = không có quyền

| Chức năng | CMP | DLR | TEC | TEC_LEAD | LOG | RCY | MGT | ADM | PUB |
|---|---|---|---|---|---|---|---|---|---|
| Tổng quan | X | — | — | — | — | — | R | X | — |
| Sổ đăng ký pin | X | — | R | R | R | — | R | X | — |
| Model pin & ERP | X | — | — | — | — | — | — | X | — |
| Tiếp nhận pin | — | X (điểm mình) | — | — | — | — | — | X | — |
| Điểm thu hồi | R | R (điểm mình) | — | — | X | — | — | X | — |
| Đánh giá SoH | — | — | X | X | — | — | — | — | — |
| Điều phối | — | — | X (đề xuất) | X (phê duyệt) | X (bàn giao) | — | — | — | — |
| Lô & chứng từ | R | — | — | — | X | X (lô của mình) | — | X | — |
| Đối tác & giấy phép | X | — | — | — | R | — | — | X | — |
| Báo cáo EPR | X | — | — | — | — | — | R | — | — |
| Tham số quy định | X | — | — | — | — | — | — | — | — |
| Tham số vận hành | X | — | — | — | — | — | — | X | — |
| Nhật ký kiểm toán | R | — | — | — | — | — | — | R | — |
| Cổng công khai | X | X | X | X | X | X | X | X | X |

**Phạm vi dữ liệu (BR-27):** đại lý theo điểm thu hồi; đối tác theo lô được giao; mọi người dùng theo nhà sản xuất (tenant). Kiểm bằng TC-065 – TC-068.

## 6. Đặc tả báo cáo

| Mã | Báo cáo | Người dùng | Trường | Lọc | Quy tắc | Tần suất |
|---|---|---|---|---|---|---|
| RPT-01 | Báo cáo EPR năm | CMP, MGT | Năm, nhóm Phụ lục I, hình thức, cách thức, V (kg), R, R × V, kết quả đã xác nhận, bảo lưu, Fs, F, căn cứ | Năm trách nhiệm | BR-04, 17 – 22 | Hằng năm; xem trong năm |
| RPT-02 | Tệp nộp hồ sơ EPR (CSV UTF-8) | CMP | Như RPT-01, mã cột không dấu: `nam, nhom, hinh_thuc, cach_thuc, V_kg, R, phai_tai_che_kg, ket_qua_kg, bao_luu_kg, Fs_d_kg, F_d, can_cu` | Năm | FR-24 | Theo nhu cầu |
| RPT-03 | Bảng điều khiển | CMP, MGT | Pin đã đăng ký; pin thu hồi trong năm; tỷ lệ thu gom LMT kèm công thức; kết quả điều phối; hạn nộp; đề xuất gom lô; cảnh báo giấy phép; thông báo chênh lệch | — | BR-08, 15, 16, 21, 23 | Thời gian thực |
| RPT-04 | Hồ sơ pin (passport) | Theo quyền | 39 trường MVP theo [passport-field-map.csv](../02-regulatory/passport-field-map.csv); dòng thời gian | Mã pin | BR-24 – 26 | Theo nhu cầu |
| RPT-05 | Nhật ký kiểm toán | CMP, ADM | Thời điểm, người, đối tượng, trường, cũ, mới, lý do | — | BR-14 | Theo nhu cầu |

## 7. Yêu cầu cho mô hình AI ước lượng SoH

| Mã | Yêu cầu | Đo bằng | Kết quả demo (S17) |
|---|---|---|---|
| AIR-01 | Sai số tuyệt đối trung bình ≤ 3,0 điểm % trên tập kiểm thử tách theo từng pin | MAE leave-one-battery-out | 2,53 — Đạt |
| AIR-02 | Khoảng tin cậy 90% có độ phủ thực tế ≥ 85% | Tỷ lệ SoH thực nằm trong khoảng | 88,5% — Đạt |
| AIR-03 | Quyết định tự động (không qua đo tay theo BR-10) đúng ≥ 97% ở ngưỡng PAR-07 | So hướng điều phối với SoH thực | 87,1% — Không đạt |
| AIR-04 | Tỷ lệ pin phải đo tay ≤ 30% | Tỷ lệ theo BR-10 | 94,6% — Không đạt |
| AIR-05 | Mỗi kết quả trả về: SoH, cận dưới, cận trên, phiên bản mô hình, danh sách trường đầu vào thiếu | Hợp đồng API `POST /soh-estimates` | Thiết kế ([api-spec.yaml](api-spec.yaml)) |
| AIR-06 | Người dùng thấy độ tin cậy trước khi xác nhận; mọi ghi đè có lý do và lưu vết | TC-024 – TC-031 | Prototype — Đạt |
| AIR-07 | Giám sát trôi dạt: hằng tháng so MAE trên các pin vừa có cả mô hình và đo tay; MAE > 4 điểm thì tự chuyển 100% sang đo tay và báo Trưởng dịch vụ | Báo cáo giám sát | Thiết kế |
| AIR-08 | Không bật quyết định tự động khi AIR-03 hoặc AIR-04 chưa đạt trên ≥ 500 pin VELIX | Cổng phát hành | DEC-11 |

## 8. Tham số cấu hình

| Mã | Tham số | Mặc định | Căn cứ |
|---|---|---|---|
| PAR-01 | Tiền tố tổ chức trong mã định danh | VLX | BR-02 |
| PAR-02 | Ngưỡng khối lượng LMT | 25 kg | REQ-EU-01 |
| PAR-03 | Ngưỡng tồn kho gom lô | 80% sức chứa | DEC-08 |
| PAR-04 | Thời gian lưu tối đa pin Nguy hiểm | 72 giờ | DEC-08 |
| PAR-05 | Thời gian lưu tối đa tại điểm | 30 ngày | DEC-08 |
| PAR-06 | Độ rộng tối đa khoảng tin cậy | 10 điểm % | BR-10, S18 |
| PAR-07 | Ngưỡng SoH đời thứ hai | 70% | SRC-008, ASM-10 |
| PAR-08 | Ngưỡng chênh lệch khối lượng | 2% | BR-16 |
| PAR-09 | Thời hạn lưu trữ hồ sơ | 10 năm | NFR-06 |
| PAR-10 | Bảng R, Fs theo năm và nhóm | 2026: B.1.1 R 12%, Fs 18.278 đ/kg (Unverified); B.2.1 R 0% | REQ-VN-15, 16; ASM-15 |
| PAR-11 | Hạn nộp hồ sơ / nộp tiền | 01/04 · 20/04 năm sau | REQ-VN-22, 26, 27 |

## 9. Dữ liệu và giao tiếp

- Mô hình dữ liệu: [S15-data-model.md](S15-data-model.md).
- Giao tiếp và API: [interfaces.md](interfaces.md), [api-spec.yaml](api-spec.yaml).

## 10. Kiểm chứng

Mỗi yêu cầu có ít nhất một test case. Ma trận truy vết: [06-test/rtm.md](../06-test/rtm.md) — kiểm bằng `tools/check_all.py`.
