<!-- SINH TỰ ĐỘNG bởi tools/build_docs.py — không sửa tay -->

# S16 — Product backlog

Ưu tiên MoSCoW; điểm WSJF = (giá trị nghiệp vụ + tính cấp thiết + giảm rủi ro) / độ lớn, thang 1–10. Thứ tự và cắt MVP: [S16-story-map.md](S16-story-map.md).

| Epic | Số story | Must | Should |
|---|---|---|---|
| EP-01 Sổ đăng ký pin | 4 | 4 | 0 |
| EP-02 Thu hồi | 6 | 4 | 2 |
| EP-05 Đối tác và bàn giao | 4 | 4 | 0 |
| EP-03 Đánh giá SoH | 2 | 2 | 0 |
| EP-04 Điều phối | 3 | 2 | 1 |
| EP-06 Báo cáo EPR | 5 | 4 | 1 |
| EP-07 Hồ sơ pin | 1 | 0 | 1 |
| EP-08 Quản trị | 2 | 2 | 0 |

## EP-01 Sổ đăng ký pin

### US-01 · Must · MVP · WSJF 8

Là cán bộ tuân thủ, tôi muốn đăng ký model pin một lần để hệ thống tự gán nhóm Phụ lục I và nhóm EU cho mọi pin của model đó.

FR: FR-01

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-01 | Cán bộ tuân thủ ở màn Model pin | Lưu model hóa học LFP, mục đích phương tiện giao thông, khối lượng 11,5 kg | Model được gán nhóm VN "B.2.1 Pin Li/NiMH phương tiện giao thông" và nhóm EU "LMT" | BR-03 | TC-001, TC-003 |
| AC-02 | Cán bộ tuân thủ ở màn Model pin | Lưu model hóa học Chì, khối lượng 28 kg | Model được gán nhóm VN "B.1.1 Ắc quy chì" và nhóm EU "Pin xe điện (hạng L >25 kg)" | BR-03 | TC-002 |
| AC-03 | Cán bộ tuân thủ ở màn Model pin | Lưu model khi bỏ trống khối lượng hoặc hóa học | Không lưu; hiển thị lỗi ngay dưới trường thiếu | BR-03 | TC-004 |
| AC-04 | Model có bên ghi nhãn khác nhà sản xuất | Xem chi tiết model | Hiển thị cả nhà sản xuất và bên ghi nhãn; chủ thể EPR là bên ghi nhãn | BR-05 | TC-005 |

### US-02 · Must · MVP · WSJF 10

Là cán bộ tuân thủ, tôi muốn mỗi pin bán ra hoặc xuất thay thế được cấp mã định danh duy nhất để truy được pin đến khi tái chế.

FR: FR-02

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-05 | ERP gửi đơn bán 1 xe model LF48 ngày 15/10/2026 | Hệ thống xử lý đơn | Tạo 1 pin trạng thái Đang lưu hành, ngày đưa ra thị trường 15/10/2026, mã dạng VLX-LF48-26-NNNNNNN-C với C đúng Luhn | BR-01; BR-02 | TC-006 |
| AC-06 | Đã có pin mang số thứ tự lớn nhất N | Hệ thống cấp mã cho pin tiếp theo (kể cả sau khi một pin bị hủy đăng ký) | Số thứ tự mới là N+1; không mã nào trùng mã đã cấp | BR-01 | TC-007 |

### US-03 · Must · MVP · WSJF 7

Là cán bộ tuân thủ, tôi muốn đánh dấu pin xuất khẩu, thử nghiệm hoặc đã có EPR của nhà cung cấp để khối lượng V không bị tính sai.

FR: FR-03

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-07 | Pin đã đăng ký năm 2026 | Cán bộ tuân thủ gắn cờ Xuất khẩu | Khối lượng pin bị loại khỏi V năm 2026 của nhóm tương ứng | BR-04 | TC-009 |
| AC-08 | Pin có cờ Nhà cung cấp đã thực hiện EPR | Tính V năm 2026 | Khối lượng pin không được cộng vào V | BR-04 | TC-010 |

### US-04 · Must · MVP · WSJF 5

Là kỹ thuật viên, tôi muốn tra cứu pin theo mã, model, trạng thái để tìm nhanh hồ sơ.

FR: FR-04

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-09 | Sổ đăng ký có pin ở nhiều trạng thái | Lọc theo trạng thái Đã thu hồi và model LF60 | Chỉ hiển thị pin thỏa cả hai điều kiện; số dòng khớp bộ đếm | — | TC-011 |

## EP-02 Thu hồi

### US-05 · Must · MVP · WSJF 6

Là kho vận, tôi muốn quản lý điểm thu hồi và hồ sơ chủ nguồn thải để chỉ điểm đủ điều kiện mới nhận pin.

FR: FR-05

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-10 | Điểm P04 chưa có hồ sơ chủ nguồn thải | Kho vận bấm Kích hoạt | Không kích hoạt; báo thiếu hồ sơ chủ nguồn thải CTNH | BR-09 | TC-012 |
| AC-11 | Điểm P04 đã nhập mã hồ sơ chủ nguồn thải và ngày hiệu lực | Kho vận bấm Kích hoạt | Điểm chuyển trạng thái Hoạt động | BR-09 | TC-013 |

### US-06 · Must · MVP · WSJF 10

Là trưởng dịch vụ đại lý, tôi muốn tiếp nhận pin của mọi hãng trong vài bước, không thu phí khách, để khách trả pin thay vì bán đồng nát.

FR: FR-06

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-12 | Đại lý ở điểm P01 đang hoạt động | Quét mã pin VELIX hợp lệ và lưu phiếu với checklist không có dấu hiệu nguy hiểm | Tạo phiếu; pin chuyển Đã thu hồi; phí người trả = 0; tồn kho P01 tăng đúng khối lượng | BR-06; BR-24 | TC-014 |
| AC-13 | Khách mang pin hãng khác không có mã VELIX | Đại lý chọn Pin hãng khác và nhập khối lượng cân | Pin được cấp mã tạm dạng TMP-… và gắn cờ Hãng khác; phiếu được lưu | BR-06 | TC-015, TC-073 |
| AC-14 | Đại lý ở điểm chưa kích hoạt | Mở màn tiếp nhận | Không cho lập phiếu; báo điểm chưa kích hoạt | BR-09 | TC-016 |

### US-07 · Must · MVP · WSJF 9

Là trưởng dịch vụ đại lý, tôi muốn checklist an toàn tự cảnh báo pin nguy hiểm để cách ly ngay.

FR: FR-06

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-15 | Đại lý lập phiếu | Tick ít nhất một dấu hiệu trong checklist (phồng/rò rỉ/nứt vỏ/va chạm/nóng) | Pin gắn cờ Nguy hiểm; hiển thị hướng dẫn cách ly; pin bị loại khỏi Đời thứ hai | BR-07 | TC-017 |

### US-08 · Should · R2 · WSJF 4

Là trưởng dịch vụ đại lý, tôi muốn tiếp nhận được khi mất mạng để không phải hẹn khách quay lại.

FR: FR-07

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-16 | Thiết bị mất kết nối | Đại lý lưu 2 phiếu rồi kết nối lại | Hai phiếu có số dạng [mã thiết bị]-[số thứ tự]; sau đồng bộ có đúng 2 phiếu, không trùng | BR-30 | TC-018 |

### US-09 · Must · MVP · WSJF 7

Là kho vận, tôi muốn nhận đề xuất gom lô khi điểm thu hồi gần đầy hoặc giữ pin quá hạn để không để pin tồn lâu.

FR: FR-08; FR-33

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-17 | Điểm P01 có sức chứa 400 kg | Tồn kho đạt từ 320 kg (80%) | Tạo đề xuất gom lô cho P01 lý do Sức chứa | BR-08 | TC-019 |
| AC-18 | Điểm có pin Nguy hiểm tiếp nhận 73 giờ trước | Mở màn Điểm thu hồi | Có đề xuất gom lô lý do Pin nguy hiểm >72 giờ | BR-08 | TC-020 |
| AC-19 | Điểm có pin tiếp nhận 31 ngày trước | Mở màn Điểm thu hồi | Có đề xuất gom lô lý do Lưu quá 30 ngày | BR-08 | TC-021 |

### US-12 · Should · MVP · WSJF 5

Là người dùng xe, tôi muốn tra cứu điểm trả pin gần tôi và cách thải pin an toàn.

FR: FR-10

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-24 | Người dùng ở cổng công khai | Tìm theo tỉnh/thành Hà Nội | Hiển thị điểm đang hoạt động ở Hà Nội, giờ mở cửa và hướng dẫn an toàn; không hiển thị tên hay số điện thoại người trả pin | BR-28 | TC-023 |

## EP-05 Đối tác và bàn giao

### US-10 · Must · MVP · WSJF 8

Là kho vận, tôi muốn lập lô và chứng từ giao nhận có danh sách pin để bàn giao cho đơn vị tái chế.

FR: FR-09

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-20 | Kho vận chọn các pin Chờ tái chế tại P01 và đơn vị nhận R01 (giấy phép hợp lệ) | Bấm Lập lô | Sinh lô có số chứng từ duy nhất dạng CT-2026-NNNN, danh sách pin và tổng khối lượng gửi | BR-16 | TC-022, TC-044 |

### US-11 · Must · MVP · WSJF 7

Là nhân viên tiếp nhận ở đơn vị tái chế, tôi muốn xác nhận khối lượng cân và ghi chênh lệch để chứng từ khớp từng ký.

FR: FR-09

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-21 | Lô đã gửi tổng 120 kg | Đơn vị tái chế nhập khối lượng cân 121 kg | Chênh lệch 0,83% ≤ 2%; xác nhận thành công, không yêu cầu lý do | BR-16 | TC-045 |
| AC-22 | Lô đã gửi tổng 120 kg | Đơn vị tái chế nhập 116 kg và không nhập lý do | Không cho xác nhận; yêu cầu lý do vì chênh lệch 3,33% > 2% | BR-16 | TC-047 |
| AC-23 | Lô gửi 120 kg | Nhập 116 kg kèm lý do | Xác nhận thành công và tạo thông báo cho Tuân thủ | BR-16 | TC-047 |

### US-18 · Must · MVP · WSJF 9

Là cán bộ tuân thủ, tôi muốn quản lý giấy phép đối tác và bị chặn bàn giao khi giấy phép không hợp lệ để không vi phạm REQ-VN-19.

FR: FR-17; FR-18

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-41 | Đối tác R03 có giấy phép hết hạn 30/09/2026 | Kho vận lập lô giao R03 ngày 20/10/2026 | Chặn lập lô; báo giấy phép hết hạn | BR-15 | TC-041 |
| AC-42 | Đối tác R02 chỉ được phép nhóm B.1.1 | Kho vận lập lô có pin LFP giao R02 | Chặn lập lô; báo nhóm B.2.1 không có trong giấy phép | BR-15 | TC-042 |
| AC-43 | Giấy phép R01 hết hạn trong 45 ngày | Mở màn Đối tác | R01 có nhãn cảnh báo Sắp hết hạn | BR-15 | TC-043 |

### US-19 · Must · MVP · WSJF 8

Là đơn vị tái chế, tôi muốn xác nhận pin đã tái chế theo quy cách để khối lượng được tính vào kết quả của VELIX.

FR: FR-19; FR-30

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-44 | Lô đã xác nhận khối lượng cân | Đơn vị tái chế xác nhận Đã tái chế theo quy cách | Mọi pin trong lô chuyển Đã tái chế; hồ sơ pin đóng, chỉ đọc; khối lượng cộng vào kết quả tái chế của nhóm | BR-17; BR-26; BR-24 | TC-048 |
| AC-45 | Pin đã tái chế | Người dùng mở hồ sơ pin | Không có nút sửa; nhãn Hồ sơ đã đóng | BR-26 | TC-048 |

## EP-03 Đánh giá SoH

### US-13 · Must · MVP · WSJF 9

Là kỹ thuật viên, tôi muốn thấy SoH ước lượng kèm độ tin cậy và danh sách pin cần đo tay để chỉ đo những pin cần đo.

FR: FR-11; FR-12

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-25 | Pin có đủ dữ liệu BMS và mô hình trả SoH 82% khoảng [79; 85] | Kỹ thuật viên mở hồ sơ SoH | Hiển thị SoH 82% và khoảng tin cậy 90%; hồ sơ SoH hợp lệ nguồn Mô hình | BR-10 | TC-024 |
| AC-26 | Pin thiếu trường bắt buộc của dữ liệu BMS | Hệ thống đánh giá SoH | Pin vào hàng Chờ đo tay lý do Thiếu dữ liệu BMS | BR-10 | TC-025 |
| AC-27 | Mô hình trả SoH 71% khoảng [67; 75] với ngưỡng đời thứ hai 70% | Hệ thống đánh giá SoH | Pin vào hàng Chờ đo tay lý do Khoảng tin cậy chứa ngưỡng | BR-10 | TC-026 |
| AC-28 | Mô hình trả khoảng tin cậy rộng 12 điểm | Hệ thống đánh giá SoH | Pin vào hàng Chờ đo tay lý do Độ không chắc chắn cao | BR-10 | TC-027 |

### US-14 · Must · MVP · WSJF 7

Là kỹ thuật viên, tôi muốn nhập kết quả đo tay hoặc ghi đè kết quả có lý do để hồ sơ SoH phản ánh đúng thực tế.

FR: FR-13; FR-32

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-29 | Pin ở hàng Chờ đo tay | Kỹ thuật viên nhập SoH đo tay 76% | Hồ sơ SoH hợp lệ nguồn Đo tay; pin rời hàng chờ | BR-10; BR-11 | TC-029 |
| AC-30 | Pin có SoH mô hình 82% | Kỹ thuật viên ghi đè thành 68% mà không nhập lý do | Không lưu; yêu cầu lý do | BR-14 | TC-030 |
| AC-31 | Pin có SoH mô hình 82% | Ghi đè thành 68% kèm lý do | Lưu; nhật ký ghi người, thời điểm, 82 → 68, lý do | BR-14 | TC-031 |

## EP-04 Điều phối

### US-15 · Must · MVP · WSJF 9

Là kỹ thuật viên, tôi muốn hệ thống đề xuất hướng điều phối theo quy tắc để quyết định nhất quán.

FR: FR-14

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-32 | Pin LFP SoH hợp lệ 82%, không cờ Nguy hiểm, ngưỡng 70% | Mở màn Điều phối | Đề xuất Đời thứ hai | BR-12 | TC-032 |
| AC-33 | Pin LFP SoH hợp lệ 65% | Mở màn Điều phối | Đề xuất Tái chế | BR-12 | TC-033 |
| AC-34 | Pin ắc quy chì SoH bất kỳ | Mở màn Điều phối | Đề xuất Tái chế; lựa chọn Đời thứ hai bị vô hiệu | BR-12; BR-29 | TC-035 |
| AC-35 | Pin gắn cờ Nguy hiểm SoH 90% | Mở màn Điều phối | Đề xuất Tái chế; Đời thứ hai bị vô hiệu | BR-07; BR-12 | TC-017 |
| AC-36 | Pin chưa có hồ sơ SoH hợp lệ | Người dùng cố chọn Đời thứ hai | Không cho chọn; báo cần hồ sơ SoH | BR-11 | TC-036 |

### US-16 · Must · MVP · WSJF 6

Là trưởng dịch vụ, tôi muốn phê duyệt quyết định Đời thứ hai do người khác đề xuất để kiểm soát rủi ro bán pin yếu.

FR: FR-15

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-37 | Kỹ thuật viên A đề xuất Đời thứ hai cho pin | Kỹ thuật viên A (vai trò Trưởng dịch vụ) tự phê duyệt | Không cho phép; báo người duyệt phải khác người đề xuất | BR-13 | TC-037 |
| AC-38 | Kỹ thuật viên A đề xuất Đời thứ hai | Trưởng dịch vụ B phê duyệt | Pin chuyển trạng thái Đời thứ hai (đã duyệt) | BR-13; BR-24 | TC-038 |

### US-17 · Should · R2 · WSJF 4

Là kho vận, tôi muốn bàn giao pin đời thứ hai kèm hợp đồng và hồ sơ SoH để bên nhận có đủ bằng chứng.

FR: FR-16; FR-29

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-39 | Pin Đời thứ hai đã duyệt | Kho vận bàn giao cho S01 không nhập số hợp đồng | Không cho bàn giao; yêu cầu số hợp đồng hoặc hóa đơn | BR-25 | TC-039 |
| AC-40 | Pin Đời thứ hai đã duyệt | Bàn giao cho S01 kèm số hợp đồng | Hồ sơ gốc chuyển Đã bàn giao; tạo hồ sơ mới trạng thái passport repurposed liên kết hồ sơ gốc, chủ thể đưa ra thị trường là S01 | BR-25; BR-24 | TC-040 |

## EP-06 Báo cáo EPR

### US-20 · Must · MVP · WSJF 8

Là cán bộ tuân thủ, tôi muốn cấu hình R, Fs, hạn nộp và ngưỡng vận hành theo năm để không phải chờ sửa phần mềm khi quy định đổi.

FR: FR-20; FR-33

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-46 | Cán bộ tuân thủ ở màn Tham số quy định | Sửa Fs của B.1.1 năm 2026 | Giá trị mới áp dụng ngay cho tính F năm 2026; lưu nhật ký thay đổi | BR-19; BR-14 | TC-049 |
| AC-47 | Năm trách nhiệm 2025 | Mở báo cáo EPR năm 2025 | Hiển thị căn cứ NĐ 08/2022 và cảnh báo chưa nạp tham số năm 2025; không dùng tham số NĐ 110 | BR-22 | TC-050 |
| AC-48 | Ngưỡng gom lô PAR-03 đổi từ 80% sang 70% | Tồn kho P01 ở 75% | Có đề xuất gom lô cho P01 | BR-08 | TC-051 |

### US-21 · Must · MVP · WSJF 7

Là cán bộ tuân thủ, tôi muốn chọn hình thức thực hiện cho mỗi nhóm pin mỗi năm để hệ thống tính đúng nghĩa vụ.

FR: FR-21

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-49 | Nhóm B.1.1 năm 2026 đang chọn Đóng góp tài chính | Chọn thêm Tổ chức tái chế | Không cho chọn hai hình thức; mỗi nhóm một hình thức mỗi năm | BR-20 | TC-052 |
| AC-50 | Chọn Tổ chức tái chế cho B.1.1 | Lưu mà không chọn cách thức | Không lưu; yêu cầu chọn cách thức (tự thực hiện / hợp đồng / PRO / kết hợp) | BR-20 | TC-053 |

### US-22 · Must · MVP · WSJF 10

Là cán bộ tuân thủ, tôi muốn thấy V, khối lượng phải tái chế, kết quả, bảo lưu và số tiền F để lập hồ sơ có căn cứ.

FR: FR-22; FR-23

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-51 | Năm 2026, nhóm B.1.1, V = tổng khối lượng pin chì đưa ra thị trường 2026 không có cờ loại trừ, R = 12% | Mở báo cáo EPR | Khối lượng phải tái chế = 12% × V (làm tròn 0,1 kg) | BR-04; BR-19 | TC-054 |
| AC-52 | Nhóm B.1.1 chọn Đóng góp tài chính, Fs = 18.278 đ/kg | Mở báo cáo EPR | F = R × V × Fs (làm tròn đến đồng) hiển thị kèm công thức | BR-19 | TC-055 |
| AC-53 | Nhóm B.1.1 chọn Tổ chức tái chế, kết quả tái chế xác nhận vượt R × V | Mở báo cáo EPR | Phần vượt hiển thị ở Bảo lưu sang năm sau | BR-18; BR-17 | TC-056 |
| AC-54 | Nhóm B.2.1 năm 2026 có R = 0% | Mở báo cáo EPR | Khối lượng phải tái chế = 0 và F = 0; vẫn hiển thị V để theo dõi | BR-19 | TC-057 |

### US-23 · Must · MVP · WSJF 8

Là cán bộ tuân thủ, tôi muốn xuất hồ sơ nộp và được nhắc hạn để không trễ hạn 01/4 và 20/4.

FR: FR-24; FR-25

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-55 | Ngày hiện tại 20/10/2026 | Mở bảng điều khiển | Hiển thị hạn 01/4/2027 và 20/4/2027 cho năm trách nhiệm 2026; nhắc khi còn 30, 7, 1 ngày | BR-21 | TC-058 |
| AC-56 | Báo cáo năm 2026 đã tính | Bấm Xuất CSV | Tải tệp có các cột năm, nhóm, hình thức, V (kg), R, khối lượng phải tái chế, kết quả, bảo lưu, Fs, F | — | TC-059 |

### US-24 · Should · MVP · WSJF 6

Là ban điều hành, tôi muốn xem tỷ lệ thu gom, kết quả điều phối và việc sắp đến hạn trên một trang.

FR: FR-26

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-57 | Có dữ liệu đưa ra thị trường 2023–2025 và thu gom 2026 | Mở bảng điều khiển | Tỷ lệ thu gom LMT = thu gom 2026 / bình quân đưa ra thị trường 2023–2025; hiển thị công thức | BR-23 | TC-060 |
| AC-58 | Thiếu dữ liệu một trong ba năm trước | Tính tỷ lệ thu gom | Hiển thị Chưa đủ dữ liệu thay vì một con số | BR-23 | TC-061 |

## EP-07 Hồ sơ pin

### US-25 · Should · MVP · WSJF 6

Là kỹ thuật viên hoặc đối tác đời thứ hai, tôi muốn xem hồ sơ pin và dòng thời gian sự kiện để biết lịch sử pin.

FR: FR-27; FR-28

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-59 | Pin đã qua tiếp nhận và đánh giá SoH | Mở hồ sơ pin | Hiển thị trường MVP (mã, model, hóa học, khối lượng, nhóm VN/EU, ngày đưa ra thị trường, SoH, trạng thái passport) và dòng thời gian sự kiện theo thứ tự | BR-24 | TC-062 |
| AC-60 | Pin đang Đang lưu hành | Người dùng cố chuyển thẳng sang Đã tái chế | Không cho phép; chỉ chuyển theo vòng đời | BR-24 | TC-063 |

## EP-08 Quản trị

### US-26 · Must · MVP · WSJF 7

Là quản trị, tôi muốn gán vai trò và phạm vi dữ liệu để mỗi người chỉ thấy dữ liệu của mình.

FR: FR-31

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-61 | Người dùng vai trò Đại lý thuộc P01 | Mở danh sách phiếu tiếp nhận | Chỉ thấy phiếu của P01 | BR-27 | TC-065 |
| AC-62 | Người dùng vai trò Đơn vị tái chế R01 | Mở danh sách lô | Chỉ thấy lô giao cho R01 | BR-27 | TC-066 |
| AC-63 | Người dùng vai trò Đại lý | Mở màn Báo cáo EPR | Không có quyền; menu không hiển thị mục Báo cáo EPR | BR-27 | TC-067 |

### US-27 · Must · MVP · WSJF 5

Là cán bộ tuân thủ, tôi muốn tra nhật ký kiểm toán để giải trình khi cơ quan đối chiếu số liệu.

FR: FR-32

| AC | Given | When | Then | Quy tắc | Test |
|---|---|---|---|---|---|
| AC-64 | Đã có thay đổi SoH và tham số | Cán bộ tuân thủ mở Nhật ký | Mỗi thay đổi có thời điểm, người, đối tượng, giá trị cũ, giá trị mới; không có thao tác sửa/xóa | BR-14 | TC-031, TC-069 |
