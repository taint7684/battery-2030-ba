# Context diagram (mức 0)

Hệ thống: **Nền tảng Battery 2030 của VELIX** (gọi tắt: nền tảng).

```mermaid
flowchart LR
  ERP[Hệ thống bán hàng / ERP VELIX]
  OEM[Nhà cung cấp pin]
  DLR[Đại lý / trạm đổi pin]
  USR[Người dùng xe]
  TEC[Trung tâm kiểm định SoH]
  RCY[Đơn vị tái chế có phép]
  SLI[Đơn vị đời thứ hai]
  PRO[PRO]
  EPR[Hệ thống thông tin EPR quốc gia]
  FUND[Quỹ BVMT Việt Nam]
  SYS((Nền tảng<br/>Battery 2030))

  ERP -- "Đơn bán: số khung, số pin, ngày bán" --> SYS
  OEM -- "Thông số model pin, xác nhận EPR linh kiện" --> SYS
  DLR -- "Phiếu tiếp nhận pin, ảnh, dữ liệu BMS" --> SYS
  SYS -- "Ngưỡng kho, lệnh gom lô" --> DLR
  USR -- "Tra cứu điểm trả pin" --> SYS
  SYS -- "Điểm trả pin, hướng dẫn an toàn" --> USR
  TEC -- "Kết quả đo SoH" --> SYS
  SYS -- "Ước lượng SoH, yêu cầu đo tay" --> TEC
  SYS -- "Phiếu bàn giao, danh sách pin" --> RCY
  RCY -- "Biên bản cân, xác nhận đã tái chế" --> SYS
  SYS -- "Hồ sơ SoH, hợp đồng chuyển giao" --> SLI
  SYS -- "Dữ liệu khối lượng (nếu ủy quyền)" --> PRO
  PRO -- "Biên bản nghiệm thu khối lượng" --> SYS
  SYS -- "File kế hoạch/báo cáo/kê khai theo mẫu (nộp thủ công)" --> EPR
  SYS -- "Số tiền F phải nộp (để chuyển khoản)" --> FUND
```

| Thực thể ngoài | Hướng | Dữ liệu | Tần suất |
|---|---|---|---|
| ERP VELIX | Vào | Đơn bán, số pin gắn xe, pin bán thay thế | Hằng ngày (batch) |
| Nhà cung cấp pin | Vào | Thông số model, mã hóa học, khối lượng, xác nhận EPR linh kiện (REQ-VN-10) | Khi có model mới |
| Đại lý / trạm đổi pin | Hai chiều | Phiếu tiếp nhận; lệnh gom lô | Mỗi lần tiếp nhận |
| Người dùng | Hai chiều | Tra cứu điểm trả, hướng dẫn | Theo nhu cầu |
| Trung tâm kiểm định | Hai chiều | Ước lượng SoH; kết quả đo | Mỗi pin |
| Đơn vị tái chế | Hai chiều | Phiếu bàn giao; biên bản cân; xác nhận đã tái chế | Mỗi lô |
| Đơn vị đời thứ hai | Ra | Hồ sơ SoH, hợp đồng chuyển giao (REQ-EU-15) | Mỗi lô |
| PRO | Hai chiều | Dữ liệu khối lượng; nghiệm thu (REQ-VN-20) | Hằng quý |
| Hệ thống EPR quốc gia | Ra | File theo mẫu; nộp thủ công vì chưa có API công bố | Hằng năm, trước 01/4 |
| Quỹ BVMT VN | Ra | Số tiền F | Hằng năm, trước 20/4 |
