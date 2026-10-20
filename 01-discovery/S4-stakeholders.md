# S4 — Bên liên quan, lưới quyền lực/quan tâm, RACI

## 1. Danh sách bên liên quan

| Mã | Bên liên quan | Vai trò với pin | Mối quan tâm chính | Quyền lực | Quan tâm | Vai trò hệ thống |
|---|---|---|---|---|---|---|
| SH-01 | Ban điều hành VELIX | Chịu trách nhiệm pháp lý EPR | Chi phí, rủi ro phạt, thương hiệu | Cao | Cao | ROLE-MGT |
| SH-02 | Phòng Tuân thủ môi trường VELIX | Lập kế hoạch, kê khai, báo cáo EPR | Số liệu đúng, nộp đúng hạn | Cao | Cao | ROLE-CMP |
| SH-03 | Phòng Dịch vụ/Bảo hành VELIX | Thay pin, đánh giá pin | Quy trình tiếp nhận gọn | Trung bình | Cao | ROLE-TEC |
| SH-04 | Kho vận VELIX | Gom lô, vận chuyển pin thải | An toàn lưu chứa, chi phí vận chuyển | Trung bình | Trung bình | ROLE-LOG |
| SH-05 | Đại lý ủy quyền | Điểm bán và điểm thu hồi | Không tốn thêm thời gian, không rủi ro cháy | Trung bình | Trung bình | ROLE-DLR |
| SH-06 | Trạm đổi pin (thí điểm) | Đổi pin, thu pin xuống cấp | Theo dõi chu kỳ pin | Thấp | Cao | ROLE-DLR |
| SH-07 | Người dùng xe máy điện | Chủ sở hữu pin | Trả pin miễn phí, tiện, được hỗ trợ đổi pin | Thấp | Trung bình | ROLE-PUB |
| SH-08 | Đơn vị tái chế có giấy phép | Tái chế theo quy cách | Nguồn pin ổn định, chứng từ đầy đủ | Trung bình | Cao | ROLE-RCY |
| SH-09 | Đơn vị đời thứ hai (lưu trữ điện) | Mua pin còn SoH tốt | Hồ sơ SoH tin cậy, giá | Thấp | Cao | ROLE-SLI |
| SH-10 | PRO (đơn vị tổ chức trách nhiệm tái chế) | Nhận ủy quyền EPR | Số liệu nhiều hãng, nghiệm thu khối lượng | Trung bình | Cao | Bên ngoài (xuất dữ liệu) |
| SH-11 | Bộ Nông nghiệp và Môi trường | Ban hành R, Fs; vận hành hệ thống EPR | Tuân thủ, số liệu có căn cứ | Cao | Trung bình | Bên ngoài |
| SH-12 | Quỹ BVMT Việt Nam | Thu đóng góp tài chính | Nộp đúng, đủ, đúng hạn | Cao | Thấp | Bên ngoài |
| SH-13 | Thu gom phi chính thức | Mua pin cũ, tháo dỡ thủ công | Giá thu mua | Thấp | Trung bình | Không có (đối tượng cạnh tranh) |
| SH-14 | Nhà cung cấp pin (OEM pin) | Sản xuất pack, có dữ liệu BMS | Bảo mật dữ liệu, chia sẻ trách nhiệm EPR | Trung bình | Thấp | Bên ngoài (khai báo model) |
| SH-15 | Quản trị hệ thống VELIX | Vận hành nền tảng | Ổn định, bảo mật | Thấp | Trung bình | ROLE-ADM |

## 2. Lưới quyền lực / quan tâm

| | Quan tâm thấp | Quan tâm cao |
|---|---|---|
| **Quyền lực cao** | **Giữ hài lòng:** SH-11 Bộ NN&MT · SH-12 Quỹ BVMT | **Quản lý chặt:** SH-01 Ban điều hành · SH-02 Tuân thủ |
| **Quyền lực thấp–TB** | **Theo dõi:** SH-13 Phi chính thức · SH-14 OEM pin · SH-15 Quản trị | **Thông tin đầy đủ:** SH-03 Dịch vụ · SH-04 Kho vận · SH-05 Đại lý · SH-06 Trạm đổi pin · SH-07 Người dùng · SH-08 Tái chế · SH-09 Đời thứ hai · SH-10 PRO |

## 3. RACI — quy trình thu hồi To-Be

R = thực hiện · A = chịu trách nhiệm cuối · C = được hỏi ý kiến · I = được thông báo

| Hoạt động | Tuân thủ (SH-02) | Dịch vụ/SoH (SH-03) | Kho vận (SH-04) | Đại lý (SH-05/06) | Tái chế (SH-08) | Đời thứ hai (SH-09) | Ban điều hành (SH-01) |
|---|---|---|---|---|---|---|---|
| Đăng ký pin khi bán | A | — | — | R | — | — | I |
| Tiếp nhận pin trả về | I | C | — | R/A | — | — | — |
| Lưu chứa an toàn tại điểm thu | C | — | I | R/A | — | — | — |
| Gom lô và vận chuyển | I | — | R/A | C | C | — | — |
| Đánh giá SoH | I | R/A | — | — | — | — | — |
| Quyết định điều phối | C | R/A | — | — | — | — | I |
| Bàn giao tái chế | C | — | R | — | R | — | I |
| Bàn giao đời thứ hai | C | — | R | — | — | R | A |
| Lập và nộp báo cáo EPR | R/A | C | C | — | C | — | I |
| Nộp tiền đóng quỹ (nếu chọn) | R | — | — | — | — | — | A |

Mỗi hàng có đúng một A.
