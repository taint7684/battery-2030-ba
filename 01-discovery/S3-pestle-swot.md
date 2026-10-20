# S3 — PESTLE và SWOT

## 1. PESTLE — thị trường pin xe điện hết hạn tại Việt Nam

| Yếu tố | Dữ kiện | Tác động lên dự án | Nguồn |
|---|---|---|---|
| **P** Chính trị | Chỉ thị 20/CT-TTg: Hà Nội không còn xe máy xăng trong Vành đai 1 từ 01/7/2026, Vành đai 1–2 từ 01/01/2028, mở rộng Vành đai 3 từ 2030; triển khai theo giai đoạn | Doanh số xe máy điện tăng nhanh → dòng pin hết hạn sau 2030 lớn hơn | SRC-017 (Unverified) |
| **E** Kinh tế | Xe máy điện VN tăng hơn gấp đôi năm 2025, ~735 nghìn xe, >20% doanh số xe hai bánh; VinFast giao 406.498 xe hai bánh năm 2025, 143.136 xe Q1/2026 | Quy mô pin đưa ra thị trường đủ lớn để cân nhắc tự tổ chức thu hồi | SRC-005, SRC-011 |
| **E** Kinh tế | Chưa đủ pin thải để vận hành nhà máy tái chế hiệu quả (lý do chính sách nêu) | Lợi thế quy mô của PRO so với từng hãng tự làm | SRC-008 |
| **S** Xã hội | ~60% xe máy điện bán mỗi năm dùng ắc quy chì; tái chế ắc quy chì thủ công, thiếu an toàn | Rủi ro sức khỏe cộng đồng; áp lực truyền thông lên hãng | SRC-020 |
| **S** Xã hội | Người dùng sở hữu pin; chi phí xử lý pin thuộc sở hữu người dùng chưa phân định | Cần cơ chế khuyến khích người dùng trả pin | SRC-010 |
| **T** Công nghệ | LFP >2.000 chu kỳ, còn ~70% dung lượng; ắc quy chì 300–400 chu kỳ | Pin LFP có tiềm năng đời thứ hai; ắc quy chì chủ yếu tái chế | SRC-022 |
| **T** Công nghệ | BMS pin LMT ở EU phải lưu tham số SoH (Phụ lục VII) | Có chuẩn để thu dữ liệu SoH khi tiếp nhận | REQ-EU-13 |
| **L** Pháp lý | NĐ 110/2026: pin Li phương tiện 0%, ắc quy chì 12%, điều chỉnh 3 năm/lần từ 2029; hạn 01/4 và 20/4 | Nghĩa vụ ngay với ắc quy chì; chuẩn bị cho 2029 | SRC-001 |
| **L** Pháp lý | Dự thảo: pin xe điện 8% từ 2029, 15% từ 2032 | Kịch bản chính sách cho business case | SRC-009 |
| **E** Môi trường | Pin Li có nguy cơ cháy khi lưu chứa sai; EU yêu cầu biện pháp an toàn riêng cho pin Li thải | Yêu cầu lưu chứa an toàn tại điểm thu hồi | SRC-003 Phụ lục XII |

## 2. SWOT — VELIX

| | Tích cực | Tiêu cực |
|---|---|---|
| **Nội bộ** | **S — Điểm mạnh**<br/>• Mạng đại lý sẵn có làm điểm thu hồi<br/>• Kiểm soát dữ liệu từ lúc bán (số khung, số pin)<br/>• Mẫu pin LFP có giá trị đời thứ hai | **W — Điểm yếu**<br/>• Chưa có dữ liệu pin theo từng chiếc<br/>• Chưa có quan hệ với đơn vị tái chế có phép<br/>• Danh mục còn mẫu ắc quy chì (nghĩa vụ 12% ngay) |
| **Bên ngoài** | **O — Cơ hội**<br/>• Tỷ lệ pin Li 0% đến 2029: có 3 năm chuẩn bị<br/>• Nhu cầu lưu trữ điện cho pin đời thứ hai<br/>• Được tính pin cùng nhóm của hãng khác vào kết quả tái chế (REQ-VN-12) | **T — Thách thức**<br/>• Kênh phi chính thức trả giá cao hơn cho ắc quy chì<br/>• Tỷ lệ, Fs có thể tăng từ 2029<br/>• Thiếu công suất tái chế pin Li trong nước |

## 3. Chiến lược rút ra (TOWS)

| Mã | Kết hợp | Chiến lược | Vào thiết kế |
|---|---|---|---|
| ST-1 | S + O | Dùng đại lý làm điểm thu hồi, nhận pin mọi hãng để đạt chỉ tiêu sớm | MOD-COL; D-COL-1 |
| ST-2 | W + O | Gán mã định danh cho mọi pin bán từ nay, trước mốc 2029 | MOD-REG; OBJ-2 |
| ST-3 | S + T | Đánh giá SoH để bán pin LFP đời thứ hai, bù chi phí thu hồi | MOD-SOH, MOD-RTE; S21 |
| ST-4 | W + T | So sánh tự làm, đóng quỹ, PRO trước khi đầu tư | S21 |
