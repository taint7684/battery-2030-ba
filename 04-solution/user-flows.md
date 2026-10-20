# User flow và wireframe — 6 màn hình lõi

Wireframe độ trung thực cao là ảnh chụp prototype ở [screens/](screens). Mỗi luồng ghi vai trò, điểm bắt đầu, các quyết định và trạng thái lỗi. Tên nút trùng nhãn trong prototype.

## UF-01 Tiếp nhận pin (Đại lý) — ![](screens/04-tiep-nhan.png)

```mermaid
flowchart LR
  A[Mở Tiếp nhận pin] --> B{Điểm đã kích hoạt?}
  B -- Không --> B1[Thông báo thiếu hồ sơ CTNH · BR-09]
  B -- Có --> C{Pin có mã VELIX?}
  C -- Có --> D[Quét / nhập mã → tự điền khối lượng]
  C -- Không --> E[Tick Pin hãng khác → chọn hóa học, nhập kg]
  D --> F[Checklist an toàn]
  E --> F
  F --> G{Có dấu hiệu nguy hiểm?}
  G -- Có --> H[Lưu phiếu → hướng dẫn cách ly · BR-07]
  G -- Không --> I[Lưu phiếu · phí 0 đ]
  I --> J{Mất kết nối?}
  H --> J
  J -- Có --> K[Phiếu lưu trên thiết bị → Đồng bộ khi có mạng · BR-30]
  J -- Không --> L[Pin chuyển Đã thu hồi, tồn kho tăng]
```

| Trạng thái | Hiển thị |
|---|---|
| Trống | Form sẵn sàng, điểm thu hồi chọn sẵn theo phạm vi người dùng |
| Lỗi | "Không tìm thấy mã pin…", "Pin đang ở trạng thái…", "Nhập khối lượng cân" |
| Ngoại tuyến | Nhãn "Đang ngoại tuyến"; nút "Đồng bộ N phiếu" |
| Thành công | Hộp xanh (bình thường) hoặc đỏ kèm hướng dẫn cách ly (nguy hiểm) |

## UF-02 Gom lô về trung tâm (Kho vận) — ![](screens/05-diem-thu-hoi.png)

```mermaid
flowchart LR
  A[Mở Điểm thu hồi] --> B[Xem mức đầy + đề xuất gom lô · BR-08]
  B --> C[Lập lô gom] --> D[Lô GL- → Lô & chứng từ]
  D --> E[Nhập kg cân tại trung tâm] --> F{Chênh lệch > 2%?}
  F -- Có, chưa có lý do --> G[Yêu cầu lý do · BR-16]
  F -- Không / có lý do --> H[Đã xác nhận cân]
```

## UF-03 Đánh giá SoH (Kỹ thuật viên) — ![](screens/06-danh-gia-soh.png)

```mermaid
flowchart LR
  A[Mở Đánh giá SoH] --> B{Kết quả theo BR-10}
  B -- Hợp lệ — Mô hình --> C[Xác nhận]
  B -- Chờ đo tay + lý do --> D[Nhập SoH đo tay → Lưu đo tay]
  C --> E[Đã đánh giá]
  D --> E
  E -. cần sửa .-> F[Ghi đè: mã pin + SoH mới + lý do bắt buộc · BR-14]
```

## UF-04 Điều phối (Kỹ thuật viên → Trưởng dịch vụ → Kho vận) — ![](screens/07-dieu-phoi.png)

```mermaid
flowchart LR
  A[Mở Điều phối] --> B[Xem đề xuất + lý do · BR-12]
  B --> C{Chọn hướng}
  C -- Tái chế --> D[Chờ tái chế]
  C -- Đời thứ hai --> E[Chờ phê duyệt]
  E --> F{Người duyệt khác người đề xuất?}
  F -- Không --> F1[Chặn · BR-13]
  F -- Có --> G[Đời thứ hai] --> H[Kho vận nhập số hợp đồng → Bàn giao · BR-25]
  H --> I[Hồ sơ gốc Đã bàn giao + hồ sơ mới repurposed]
```

Nút trùng đề xuất của hệ thống được tô nổi; nút không được phép bị khóa kèm lý do khi rê chuột.

## UF-05 Bàn giao tái chế (Kho vận → Đơn vị tái chế) — ![](screens/08-lo-chung-tu.png)

```mermaid
flowchart LR
  A[Chọn đơn vị nhận + pin Chờ tái chế] --> B{Giấy phép hợp lệ và đủ nhóm? · BR-15}
  B -- Không --> B1[Chặn lập lô + lý do]
  B -- Có --> C[Lô CT- · Đã gửi]
  C --> D[Đơn vị tái chế cân · BR-16] --> E[Xác nhận đã tái chế theo quy cách]
  E --> F[Pin Đã tái chế · hồ sơ đóng · cộng kết quả · BR-17, BR-26]
```

## UF-06 Lập báo cáo EPR (Cán bộ tuân thủ) — ![](screens/10-bao-cao-epr.png)

```mermaid
flowchart LR
  A[Tổng quan: nhắc hạn 30/7/1 ngày · BR-21] --> B[Mở Báo cáo EPR]
  B --> C{Năm ≤ 2025?}
  C -- Có --> C1[Cảnh báo căn cứ NĐ 08 · BR-22]
  C -- Không --> D[Chọn hình thức + cách thức · BR-20]
  D --> E[Xem V, R×V, kết quả, bảo lưu, F]
  E --> F[Xuất CSV → nộp Hệ thống EPR quốc gia]
```

## Nguyên tắc trải nghiệm áp dụng

| Nguyên tắc | Cách làm trong prototype |
|---|---|
| Ít thao tác cho người dùng hiện trường | Tiếp nhận chỉ cần mã pin + khối lượng (tự điền) + một lần bấm (TC-071) |
| Hệ thống đề xuất, người quyết | Đề xuất điều phối kèm lý do; nút được đề xuất nổi bật |
| Chặn sai trước khi xảy ra | Nút bị khóa kèm lý do thay vì báo lỗi sau khi bấm |
| Trạng thái thấy ngay | Nhãn màu theo trạng thái; thẻ chỉ số và biểu đồ trên Tổng quan |
| Theo vai trò | Menu chỉ hiện chức năng của vai trò; phạm vi dữ liệu theo điểm/đối tác |
| Dùng được trên điện thoại | Màn tiếp nhận ở 360 px không cuộn ngang (TC-070) |
