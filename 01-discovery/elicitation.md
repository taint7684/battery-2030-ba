# Khai thác yêu cầu

> **Ghi chú phương pháp.** Dự án không có khách hàng thật. Các buổi phỏng vấn dưới đây là **phỏng vấn giả lập**: BA đóng vai từng bên liên quan, câu trả lời dựng từ văn bản luật (SRC-001–004), số liệu công khai (SRC-005–022) và báo chí ngành (SRC-008–010). Mọi câu trả lời có căn cứ được ghi mã nguồn; câu trả lời suy luận ghi *[giả định]*.

## 1. Kế hoạch

| Kỹ thuật | Đối tượng | Mục đích | Đầu ra |
|---|---|---|---|
| Phân tích tài liệu | NĐ 110, Luật BVMT, EU 2023/1542 | Bóc tách nghĩa vụ | REQ-VN, REQ-EU |
| Phỏng vấn (giả lập) | SH-02, SH-05, SH-08, SH-03 | Hiểu luồng As-Is, điểm đau | NEED-xx |
| Workshop (giả lập) | SH-01, SH-02, SH-03 | Chốt phạm vi MVP, quy tắc điều phối | DEC, BR |
| Quan sát (giả lập) | Xưởng dịch vụ đại lý | Thời gian tiếp nhận, điều kiện lưu chứa | NFR |
| Prototype | Tất cả vai trò | Kiểm luồng To-Be | Phản hồi vòng 1 |

## 2. Bộ câu hỏi (36 câu)

**Tuân thủ (SH-02)**
1. Năm trách nhiệm 2026 VELIX chọn tổ chức tái chế hay đóng quỹ cho ắc quy chì?
2. Khối lượng V lấy từ nguồn nào: hóa đơn, phiếu xuất kho, hay tờ khai hải quan?
3. Pin đi kèm xe và pin bán thay thế có tách được không?
4. Nhà cung cấp pin đã tự thực hiện EPR cho phần pin chưa (REQ-VN-10)?
5. Có pin xuất khẩu hoặc dùng thử nghiệm cần loại khỏi V không (REQ-VN-06)?
6. Ai ký và chịu trách nhiệm số liệu nộp lên hệ thống EPR?
7. Đã từng bị cơ quan đối chiếu số liệu với thuế/hải quan chưa (REQ-VN-30)?
8. Báo cáo nội bộ nào cần ngoài mẫu của Bộ?
9. Cần giữ hồ sơ EPR bao nhiêu năm?

**Đại lý (SH-05/06)**
10. Mỗi tháng đại lý thay bao nhiêu pin/ắc quy?
11. Pin cũ hiện đi đâu sau khi thay?
12. Khách có mang pin của hãng khác đến không?
13. Đại lý có chỗ lưu chứa riêng, có thiết bị chữa cháy không?
14. Pin phồng, rò rỉ, va chạm hiện xử lý thế nào?
15. Thời gian chấp nhận được cho một lần tiếp nhận pin?
16. Xưởng có mạng ổn định không? Dùng máy tính hay điện thoại?
17. Có đọc được dữ liệu BMS tại xưởng không?
18. Bao lâu thì kho đầy và cần gom?

**Đơn vị tái chế (SH-08)**
19. Cơ sở có giấy phép môi trường cho nhóm pin nào, còn hạn đến khi nào?
20. Mẫu biên bản giao nhận đang dùng?
21. Chênh lệch khối lượng bao nhiêu thì phải giải trình?
22. Có báo lại khối lượng vật liệu thu hồi được không?
23. Có nhận pin Li hay chỉ ắc quy chì?
24. Thời gian từ nhận đến xác nhận đã tái chế?

**Dịch vụ / SoH (SH-03)**
25. Hiện đo SoH bằng cách nào, mất bao lâu?
26. Ngưỡng SoH nào thì pin còn dùng được cho lưu trữ điện?
27. Những tình trạng vật lý nào loại pin khỏi đời thứ hai ngay?
28. Dữ liệu BMS có những trường nào (Phụ lục VII EU)?
29. Ai được quyền ghi đè kết quả mô hình?

**Ban điều hành (SH-01)**
30. Ngân sách cho thu hồi và nền tảng?
31. Có muốn bán pin đời thứ hai hay chỉ tái chế?
32. Có sẵn sàng tham gia PRO cùng các hãng khác không?
33. Khi nào cần quyết định phương án cho chu kỳ 2029?

**Người dùng (SH-07)**
34. Khách có biết phải trả pin ở đâu không?
35. Điều gì khiến khách bán pin cho người thu mua phế liệu thay vì trả hãng?
36. Khách muốn nhận lại gì khi trả pin (giảm giá pin mới, điểm thưởng)?

## 3. Ghi chép phỏng vấn giả lập (tóm tắt)

| Buổi | Bên | Điểm chính | Căn cứ |
|---|---|---|---|
| INT-01 | SH-02 Tuân thủ | Số pin bán ra lấy từ 3 file (bán hàng, kho, hải quan), lệch nhau; chưa tách pin kèm xe với pin thay thế; chưa có chứng từ giao nhận theo lô | REQ-VN-21, REQ-VN-30; *[giả định]* về file |
| INT-02 | SH-05 Đại lý | Pin cũ để góc xưởng, bán cho người thu mua; khách có mang ắc quy hãng khác; chấp nhận tối đa 3 phút/lần; mạng chập chờn cuối tuần | SRC-010, SRC-020; *[giả định]* thời gian |
| INT-03 | SH-08 Tái chế | Cần biên bản theo mẫu chứng từ CTNH; cần danh sách pin theo lô; chênh lệch khối lượng phải ghi lý do | REQ-VN-19, REQ-VN-21 |
| INT-04 | SH-03 Dịch vụ | Đo dung lượng đầy đủ mất nhiều giờ; pin phồng, rò rỉ, va chạm thì tái chế ngay; cần độ tin cậy của ước lượng | REQ-EU-13–15; *[giả định]* thời gian đo |
| WS-01 | SH-01, 02, 03 | Chốt MVP 7 phân hệ; nhận pin mọi hãng; đời thứ hai chỉ khi có hồ sơ SoH; ngưỡng điều phối do Dịch vụ đề xuất, Ban điều hành duyệt | DEC-03, D-SOH-1 |

## 4. Nhu cầu rút ra

| Mã | Nhu cầu | Bên | Từ |
|---|---|---|---|
| NEED-01 | Biết chính xác khối lượng pin đưa ra thị trường theo nhóm Phụ lục I, năm và chủ thể chịu trách nhiệm | SH-02 | INT-01, REQ-VN-04, -09 |
| NEED-02 | Mỗi pin có một mã định danh duy nhất, truy được từ lúc bán đến khi tái chế | SH-02, SH-03 | INT-01, GAP-15 |
| NEED-03 | Tiếp nhận pin trả về nhanh, nhận mọi hãng, làm được khi mất mạng | SH-05, SH-07 | INT-02, GAP-05 |
| NEED-04 | Lưu chứa an toàn và gom lô kịp thời tại điểm thu hồi | SH-05, SH-04 | INT-02, REQ-VN-28 |
| NEED-05 | Đánh giá SoH nhanh, có độ tin cậy, có người duyệt khi không chắc | SH-03 | INT-04, GAP-09 |
| NEED-06 | Quyết định đời thứ hai hay tái chế theo quy tắc rõ ràng, có hồ sơ | SH-03, SH-01 | WS-01, GAP-08 |
| NEED-07 | Chuỗi chứng từ giao nhận theo lô, khớp khối lượng, đúng mẫu | SH-08, SH-02 | INT-03, REQ-VN-21 |
| NEED-08 | Chỉ giao pin cho đối tác có giấy phép còn hiệu lực | SH-02 | REQ-VN-19 |
| NEED-09 | Lập kế hoạch, báo cáo, kê khai EPR đúng hạn với tham số theo năm | SH-02 | REQ-VN-22, -26, -27, GAP-18 |
| NEED-10 | Theo dõi tỷ lệ thu gom và kết quả điều phối để ra quyết định | SH-01 | GAP-04, OBJ-3 |
| NEED-11 | Hồ sơ pin theo khung battery passport để sẵn sàng chia sẻ dữ liệu | SH-01, SH-09 | GAP-15 |
| NEED-12 | Người dùng tra cứu được điểm trả pin và cách thải pin an toàn | SH-07 | GAP-16, INT-02 |
