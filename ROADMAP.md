# ROADMAP — Battery 2030

**Đề tài:** Battery 2030: Thiết kế nền tảng quản lý vòng đời và trách nhiệm thu hồi pin xe điện tại Việt Nam
**Tên trên CV:** EV Battery Lifecycle & EPR Compliance Platform — Forecasting Vietnam's 2030 End-of-Life Battery Wave
**Loại dự án:** portfolio Senior Business Analyst · một người · chi phí 0đ
**Khách hàng giả định:** doanh nghiệp sản xuất/nhập khẩu xe điện hai bánh (e2W) tại Việt Nam, chịu nghĩa vụ trách nhiệm mở rộng của nhà sản xuất (EPR) đối với pin.

## 1. Bài toán

Việt Nam đang điện hóa giao thông. Pin lithium của xe điện có tuổi thọ khoảng 5–10 năm, nên làn sóng pin hết hạn đầu tiên dự kiến rơi vào 2029–2032 *(giả thuyết H1, kiểm ở P2)*. Hiện chưa ai trả lời được: bao nhiêu pin đã bán ra, pin nào sắp hết hạn, thu hồi qua kênh nào. Hệ quả: không đo được tỷ lệ thu hồi; pin chảy vào khu vực phi chính thức (rủi ro cháy nổ, ô nhiễm kim loại nặng); doanh nghiệp không biết nên tự tái chế, đóng quỹ EPR hay tham gia tổ chức thu hồi chung (PRO).

| Mã | Câu hỏi nghiên cứu | Sản phẩm trả lời |
|---|---|---|
| RQ1 | EPR Việt Nam yêu cầu gì với nhà sản xuất pin, yếu hơn EU 2023/1542 ở đâu? | S6 |
| RQ2 | Mỗi năm 2025–2035 có bao nhiêu tấn và GWh pin xe điện hết hạn, theo loại xe và hóa học pin? | S9 |
| RQ3 | Năm nào lượng pin hết hạn vượt công suất tái chế hiện có? Bao nhiêu % dùng được cho đời thứ hai? | S9, S10 |
| RQ4 | Dự báo nhạy đến đâu với giả định tuổi thọ, khu vực phi chính thức và độ vênh nguồn số liệu? | S11 |
| RQ5 | Nền tảng cần đáp ứng gì để khách hàng đăng ký, thu hồi, phân loại, điều phối và báo cáo pin? | S12–S20 |
| RQ6 | Ước lượng SoH từ dữ liệu sạc/xả có đủ tin để quyết định đời thứ hai không, cần cơ chế an toàn nào? | S17, S18 |
| RQ7 | Tự tái chế, đóng quỹ EPR hay tham gia PRO: phương án nào hòa vốn, khi nào không đáng làm? | S21 |

**Trong phạm vi:** pin xe điện hai bánh và ô tô điện tại Việt Nam (dự báo cấp quốc gia); thiết kế nền tảng cho khách hàng (hãng e2W); luồng đăng ký → thu hồi → đánh giá SoH → điều phối (đời thứ hai / tái chế) → báo cáo EPR; mô hình dữ liệu theo khung battery passport; demo AI SoH trên dữ liệu công khai.
**Ngoài phạm vi (Hướng mở rộng):** xe buýt, xe tải, pin lưu trữ cố định làm thị trường chính; công nghệ tái chế; thiết kế cell pin; triển khai thật; dữ liệu nội bộ doanh nghiệp; tư vấn pháp lý.

## 2. Giai đoạn và mốc

| Giai đoạn | Sản phẩm | Mốc |
|---|---|---|
| P0 Chuẩn bị | Repo, file quản lý, kiểm tra khả thi | — |
| P1 Pháp lý & Discovery | S1–S7 | M1 Chốt baseline yêu cầu |
| P2 Dữ liệu & Dự báo | S8–S10, dashboard dự báo | — |
| P3 Phản biện | S11 | M2 Đóng băng dự báo |
| P4 Thiết kế giải pháp | S12–S16, S19, S20 | M3 Chốt baseline thiết kế |
| P4-AI Mô-đun ước lượng SoH | S17, S18 | — |
| P5 Business case | S21 | — |
| P6 Đóng gói | S22, S23, README, GitHub Pages | M4 Công bố |

## 3. Nguyên tắc chất lượng

1. Không có nguồn thì không dùng: mọi số liệu có mã `SRC-xxx` trong `source-log.csv`.
2. Giả định phải ghi ra: mã `ASM-xxx`, mức tin cậy, min/likely/max, hệ quả nếu sai.
3. Yêu cầu từ luật trích nguyên văn, kèm số điều khoản.
4. Dữ liệu giả lập ghi rõ *synthetic* trong tên file và nội dung.
5. Ước lượng dùng khoảng, không dùng một con số.
6. Tương quan không phải nhân quả; dự báo là kịch bản, không phải khẳng định.
7. Mọi yêu cầu truy vết lên (luật/nhu cầu) và xuống (story, test) trong RTM.
8. Tài liệu pháp lý có miễn trừ: đây là phân tích, không phải tư vấn pháp lý.

## 4. Cấu trúc repo

```
00-management/    source-log.csv · assumptions-log.csv · decision-log.md · risk-register.csv · glossary.md
01-discovery/     charter · BACCM · PESTLE/SWOT · stakeholder · persona · As-Is · context diagram · elicitation
02-regulatory/    bóc tách yêu cầu · ma trận tuân thủ VN × EU · bảng ánh xạ trường battery passport
03-forecast/      data/ · notebooks/ · model/ · outputs/ (dự báo cohort, Sankey, độ nhạy)
04-solution/      BPMN To-Be · SRS · use case · backlog · mô hình dữ liệu · API · prototype/
05-ai-soh/        notebooks/ · model card · yêu cầu AI
06-test/          test scenario · test case · UAT · RTM
07-business-case/ mô hình chi phí · phương án · hòa vốn · khi nào không đáng
08-package/       tóm tắt điều hành · case study · slide
docs/             trang GitHub Pages (dashboard + prototype)
tools/            script build và kiểm tra
```

## 5. Danh sách task

`S` = sản phẩm, `M` = mốc.

### P0 · Chuẩn bị

| Mã | Việc | Đầu ra |
|---|---|---|
| T0.1 | Tạo repo, cây thư mục, LICENSE, .gitignore (không commit dữ liệu thô và PDF) | khung repo |
| T0.2 | Tạo file quản lý: nguồn, giả định, quyết định, rủi ro, thuật ngữ | `00-management/` (5 tệp) |
| T0.3 | Kiểm tra khả thi 4 điểm: truy cập được văn bản EPR VN · có chuỗi doanh số xe điện · tải được NASA/CALCE · giấy phép dữ liệu IEA cho phép dùng lại | DEC-01 |
| T0.4 | Dựng môi trường Python (pandas, numpy, scipy, matplotlib/plotly, scikit-learn, jupyter) | `requirements.txt` |
| T0.5 | Viết khung README và ROADMAP | `README.md`, `tools/build_all.py` |

### P1 · Pháp lý & Discovery

**1A. Nguồn và văn bản luật**

| Mã | Việc | Đầu ra |
|---|---|---|
| T1.1 | Thu thập và xác minh văn bản VN: Luật BVMT 2020 (các điều về EPR), NĐ 08/2022/NĐ-CP và mọi nghị định sửa đổi, quyết định của Thủ tướng về định mức đóng góp, tỷ lệ và quy cách tái chế pin | `00-management/source-log.csv`, `02-regulatory/README.md` |
| T1.2 | Thu thập EU 2023/1542 (bản hợp nhất) và các văn bản hướng dẫn về tỷ lệ thu gom, hàm lượng tái chế, dấu vết carbon, battery passport | mục SRC |
| T1.3 | Thu thập hướng dẫn nội dung và mô hình dữ liệu của Battery Pass consortium | mục SRC |
| T1.4 | Xác nhận tên cơ quan quản lý hiện hành sau đợt hợp nhất bộ năm 2025, ghi vào thuật ngữ | `glossary.md` |
| T1.5 | Bóc tách yêu cầu EPR VN: mỗi nghĩa vụ một dòng, trích nguyên văn, điều khoản, chủ thể, thời hạn, bằng chứng phải nộp | `02-regulatory/req-extraction-vn.csv` |
| T1.6 | Bóc tách yêu cầu EU 2023/1542 theo cùng chủ đề (thu gom, thu hồi, hiệu suất tái chế, thu hồi vật liệu, đời thứ hai, thẩm định chuỗi cung ứng, passport, nhãn) | `02-regulatory/req-extraction-eu.csv` |
| T1.7 | Dựng ma trận tuân thủ VN × EU: chủ đề, quy định VN, tham chiếu EU, khoảng cách, chấm ⛔ (thiếu/chặn) · ⚠️ (yếu/mơ hồ) · ✏️ (chỉ lệch câu chữ/dữ liệu), tác động lên nền tảng | **S6** `02-regulatory/S6-compliance-matrix.md` |
| T1.8 | Ánh xạ thuộc tính Battery Passport sang nghĩa vụ VN: trường VN cần, trường chỉ EU cần, trường nền tảng vẫn lưu | `02-regulatory/passport-field-map.csv` |
| T1.9 | Viết miễn trừ pháp lý và danh sách câu hỏi pháp lý mở | S6 §5 Câu hỏi pháp lý mở |

**1B. Discovery**

| Mã | Việc | Đầu ra |
|---|---|---|
| T1.10 | Project charter: vấn đề, mục tiêu, phạm vi, ràng buộc, thước đo thành công (SMART) | **S1** `01-discovery/S1-charter.md` |
| T1.11 | BACCM: Change · Need · Solution · Stakeholder · Value · Context | **S2** `01-discovery/S2-baccm.md` |
| T1.12 | PESTLE cho thị trường pin hết hạn tại VN; SWOT cho khách hàng | **S3** `01-discovery/S3-pestle-swot.md` |
| T1.13 | Danh sách stakeholder và lưới quyền lực/quan tâm: nhà sản xuất/nhập khẩu, đại lý, trạm đổi pin, người dùng, thu gom phi chính thức, nhà tái chế có phép, đơn vị tích hợp đời thứ hai, bộ quản lý, sở địa phương, Quỹ BVMT VN, PRO, ngân hàng | **S4** `01-discovery/S4-stakeholders.md` |
| T1.14 | Ma trận RACI cho quy trình thu hồi | S4 §3 RACI |
| T1.15 | 4 persona: cán bộ tuân thủ EPR, trưởng dịch vụ đại lý, nhân viên tiếp nhận ở nhà tái chế, chuyên viên thẩm định của bộ | **S5** `01-discovery/S5-personas.md` |
| T1.16 | Kế hoạch khai thác yêu cầu + phỏng vấn giả lập (BA đóng vai stakeholder, ghi rõ *giả lập*), bộ 30–40 câu hỏi | `01-discovery/elicitation.md` |
| T1.17 | Quy trình As-Is (BPMN): pin từ lúc bán đến khi bị thải phi chính thức; đánh số điểm đau | **S7** `01-discovery/S7-as-is/` |
| T1.18 | Context diagram (mức 0) của nền tảng và các thực thể bên ngoài | `01-discovery/context-diagram.md` |
| T1.19 | Phân tích nguyên nhân gốc tỷ lệ thu hồi thấp: Fishbone + 5 Whys | `01-discovery/root-cause.md` |
| T1.20 | **M1**: rà soát baseline yêu cầu, cập nhật nhật ký quyết định | DEC-xx |

### P2 · Dữ liệu & Dự báo

| Mã | Việc | Đầu ra |
|---|---|---|
| T2.1 | Kiểm kê nguồn dữ liệu (IEA GEVO + EV Data Explorer, VinFast 20-F/6-K, VAMA, GSO, World Bank, GIZ, ICCT, báo chí): độ phủ, độ chi tiết, giấy phép | **S8** `03-forecast/S8-data-inventory.md` |
| T2.2 | Tải và lưu dữ liệu thô bằng script (không commit dữ liệu thô) | `tools/fetch_sources.py` (thư mục raw không commit) |
| T2.3 | Dựng chuỗi doanh số 2015–2025: e2W (tách axit-chì / Li-ion) và ô tô điện; tam giác hóa 2–3 nguồn mỗi năm thành min/likely/max | `03-forecast/model/params.py` (E2W_HIST, CAR_HIST); S8 §2–3 |
| T2.4 | Chiếu doanh số 2026–2035 theo 3 kịch bản (Chậm · Cơ sở · Nhanh), dựa trên giả định chính sách (hạn chế xe xăng nội đô, ưu đãi) | `params.py` (E2W_SCEN, CAR_SCEN); ASM-06, ASM-19 |
| T2.5 | Gán tỷ trọng hóa học pin (LFP · NMC · axit-chì), dung lượng (kWh) và khối lượng pack (kg) theo loại xe và năm | `params.py` (PACK, LI_SHARE); S8 §5 |
| T2.6 | Tổng quan tài liệu về tuổi thọ pin: tham số Weibull theo hóa học và loại xe; tỷ lệ đủ điều kiện đời thứ hai theo SoH | `params.py` (BATT_LIFE, VEH_LIFE, SECOND_LIFE); S9 §2 |
| T2.7 | Dựng mô hình cohort × Weibull: số pin, tấn, GWh hết hạn mỗi năm 2025–2035 theo loại xe × hóa học × kịch bản | `03-forecast/model/forecast.py` |
| T2.8 | Unit test mô hình (cân bằng khối lượng: bán ra = đang dùng + đã hết hạn; kiểm tra hàm CDF Weibull) | `tests/test_forecast.py` |
| T2.9 | Thu thập công suất tái chế hiện có tại VN (cơ sở có phép, tấn/năm), ghi dạng khoảng | ASM-12; DEC-07 |
| T2.10 | Tìm năm giao cắt: tấn pin hết hạn > công suất tái chế, theo từng kịch bản | **S9** `03-forecast/S9-forecast-results.md` |
| T2.11 | Ước lượng tỷ lệ đời thứ hai: phân phối SoH lúc thải × ngưỡng đủ điều kiện | **S10** `03-forecast/S10-material-flow.md` §2 |
| T2.12 | Phân tích dòng vật chất: bán ra → sử dụng → hết hạn → thu hồi chính thức / phi chính thức → đời thứ hai / tái chế / thất thoát; Sankey năm 2030 theo kịch bản | **S10** `03-forecast/outputs/mfa-sankey.html` |
| T2.13 | Dashboard dự báo trên GitHub Pages: chọn kịch bản, biểu đồ pin hết hạn, năm giao cắt, Sankey | `docs/forecast.html` |

### P3 · Phản biện

| Mã | Việc | Đầu ra |
|---|---|---|
| T3.1 | Độ nhạy: tuổi thọ trung bình ±2 năm, đo độ dịch của năm đỉnh và sản lượng 2030 (biểu đồ tornado) | **S11** `03-forecast/S11-critique.md` §1 |
| T3.2 | Độ nhạy: tỷ trọng hóa học, dung lượng pack, tỷ lệ phi chính thức | **S11** §2 |
| T3.3 | So số tự dựng (doanh số, lượng xe lưu hành) với IEA; giải thích từng chỗ lệch | **S11** §3 |
| T3.4 | Định lượng phần không quan sát được: thu gom phi chính thức dạng khoảng, trình bày như một phát hiện | **S11** §4 |
| T3.5 | Bảng độ vênh giữa các nguồn (cùng chỉ số, khác nguồn) | **S11** §5 |
| T3.6 | Giới hạn của phân tích và điều kiện làm đổi kết luận | **S11** §6 |
| T3.7 | **M2**: đóng băng phiên bản dự báo, gắn tag repo | DEC-xx, tag `forecast-v1` |

### P4 · Thiết kế giải pháp

**4A. Quy trình và phạm vi**

| Mã | Việc | Đầu ra |
|---|---|---|
| T4.1 | Vision & Scope: mục tiêu sản phẩm, danh sách tính năng, ranh giới MVP | **S12** `04-solution/S12-vision-scope.md` |
| T4.2 | Sơ đồ chức năng nghiệp vụ (BFD) | S12 §3 |
| T4.3 | BPMN To-Be: thu hồi → tiếp nhận → đánh giá SoH → quyết định điều phối → bàn giao đời thứ hai / tái chế → báo cáo EPR; swimlane theo tác nhân | **S13** `04-solution/S13-bpmn/` |
| T4.4 | Gap analysis As-Is → To-Be (quy trình, dữ liệu, vai trò, hệ thống) | S13 §2 |
| T4.5 | State machine của pin (Đã đăng ký → Đang dùng → Đã thu hồi → Đã phân loại → Đời thứ hai / Tái chế → Đóng) và của lô thu gom | S13 §3–4 |
| T4.6 | Sơ đồ luồng dữ liệu (DFD) mức 1 | S13 §5 |

**4B. Yêu cầu (SRS theo ISO/IEC/IEEE 29148)**

| Mã | Việc | Đầu ra |
|---|---|---|
| T4.7 | Use case diagram + đặc tả 6 use case lõi (đăng ký pin, ghi nhận thu hồi, đánh giá SoH, quyết định điều phối, bàn giao nhà tái chế, lập báo cáo EPR) | `04-solution/use-cases.md` |
| T4.8 | Danh mục business rule theo cú pháp EARS, mỗi rule truy về điều luật hoặc quyết định | `04-solution/trace/br.csv` → S14 phụ lục §3 |
| T4.9 | Bảng quyết định điều phối (dải SoH × hóa học × tình trạng vật lý × độ tin cậy mô hình → đời thứ hai / tái chế / duyệt tay) | S14 §3.1 |
| T4.10 | Yêu cầu chức năng theo phân hệ: Sổ đăng ký pin (mã định danh), Thu hồi, Đánh giá SoH, Điều phối, Báo cáo EPR, Dữ liệu passport, Quản lý đối tác | **S14** `04-solution/S14-srs.md` + `S14-srs-appendix.md` |
| T4.11 | Yêu cầu phi chức năng: lưu trữ dữ liệu, lưu vết, sẵn sàng, quyền riêng tư (dữ liệu người dùng), bảo mật, liên thông | S14 §4 + `trace/nfr.csv` |
| T4.12 | Ma trận phân quyền (RBAC) kèm phạm vi dữ liệu theo nhà sản xuất (PRO = multi-tenant) | S14 §5 |
| T4.13 | Đặc tả báo cáo: báo cáo EPR năm, KPI tỷ lệ thu hồi, kết quả điều phối, xuất dữ liệu passport | S14 §6 |
| T4.14 | Mô hình dữ liệu: ERD, data dictionary khớp thuộc tính Battery Pass | **S15** `04-solution/S15-data-model.md` |
| T4.15 | Đặc tả giao tiếp: API tiếp nhận từ đại lý/trạm đổi pin, API bàn giao nhà tái chế, xuất cho cơ quan quản lý; bản nháp OpenAPI + sequence diagram | `04-solution/api-spec.yaml`, `interfaces.md` |
| T4.16 | Rà soát chất lượng yêu cầu theo tiêu chí 29148 (cần thiết, rõ nghĩa, kiểm chứng được…) | `04-solution/requirements-review.md` |

**4C. Backlog và prototype**

| Mã | Việc | Đầu ra |
|---|---|---|
| T4.17 | Epic, user story kèm AC Given/When/Then; trạng thái màn hình (trống, đang tải, lỗi, mất mạng ở đại lý) | **S16** `04-solution/S16-backlog.md` |
| T4.18 | Story map, cắt MVP; ưu tiên bằng MoSCoW + WSJF | `04-solution/S16-story-map.md` |
| T4.19 | User flow và wireframe cho 6 màn lõi | `04-solution/screens/` (ảnh prototype) |
| T4.20 | Prototype HTML click được: tra cứu sổ đăng ký, tiếp nhận thu hồi, đánh giá SoH kèm độ tin cậy mô hình, duyệt điều phối, dashboard EPR, xem passport | **S19** `docs/prototype/` |
| T4.21 | Dữ liệu giả lập: sổ đăng ký pin và giao dịch thu hồi sinh từ phân phối của mô hình dự báo (ghi rõ synthetic) | `04-solution/synthetic/` |

### P4-AI · Mô-đun ước lượng SoH và yêu cầu AI

| Mã | Việc | Đầu ra |
|---|---|---|
| T4A.1 | Tải bộ dữ liệu pin NASA PCoE và CALCE; ghi giấy phép và cấu trúc | SRC-016; S17 bảng đầu |
| T4A.2 | EDA: đường suy giảm dung lượng, định nghĩa SoH (dung lượng hiện tại / danh định), đặc trưng theo chu kỳ | `05-ai-soh/notebooks/01-eda.ipynb` |
| T4A.3 | Tạo đặc trưng từ chu kỳ sạc/xả (điện áp, nhiệt độ, thời gian đến ngưỡng) | `notebooks/02-features.ipynb` |
| T4A.4 | Huấn luyện baseline + mô hình (hồi quy tuyến tính, gradient boosting); chia train/test theo từng pin để tránh rò rỉ dữ liệu | `notebooks/03-model.ipynb` |
| T4A.5 | Độ bất định: khoảng dự đoán (quantile hoặc conformal); định nghĩa vùng "không chắc" | `notebooks/03-model.ipynb` |
| T4A.6 | Đánh giá: MAE/RMSE của SoH, độ chính xác phân lớp điều phối, sai số quanh ngưỡng quyết định | `notebooks/04-evaluation.ipynb` |
| T4A.7 | Model card: dữ liệu, mục đích dùng, giới hạn, kiểu lỗi, chưa kiểm chứng trên pack e2W | **S17** `05-ai-soh/S17-model-card.md` |
| T4A.8 | Yêu cầu AI trong SRS: độ chính xác tối thiểu, ngưỡng tin cậy, con người duyệt lại, phương án dự phòng là đo tay, giám sát drift, giải thích kết quả, lưu vết khi ghi đè | **S18** S14 §7 |
| T4A.9 | Đưa kết quả demo vào màn đánh giá SoH của prototype (mẫu tĩnh) | cập nhật prototype |

### P4-T · Kiểm thử và truy vết

| Mã | Việc | Đầu ra |
|---|---|---|
| T4T.1 | Test scenario theo use case; test case bằng phân vùng tương đương, giá trị biên (ngưỡng SoH), bảng quyết định, chuyển trạng thái | **S20** `06-test/test-cases.csv`, `e2e/tests.js` |
| T4T.2 | Kế hoạch UAT và mẫu biên bản ký nghiệm thu | `06-test/S20-test-plan.md` §5 |
| T4T.3 | RTM: điều luật / nhu cầu → BR → FR/NFR → story/AC → màn hình → test case; script kiểm không có lỗ hổng | `06-test/rtm.csv`, `rtm.md`, `tools/check_all.py` |
| T4T.4 | Chạy thử prototype theo test case, ghi kết quả | `06-test/test-results.json`; S20 §3–4 |
| T4T.5 | **M3**: chốt baseline thiết kế | DEC-xx |

### P5 · Business case

| Mã | Việc | Đầu ra |
|---|---|---|
| T5.1 | Sản lượng của khách hàng: thị phần e2W × dự báo → số pin phải thu hồi mỗi năm | `07-business-case/outputs/yearly_likely.csv` |
| T5.2 | Động lực chi phí/doanh thu từng phương án: (A) tự tái chế / tự dựng mạng thu hồi, (B) đóng quỹ EPR, (C) tham gia PRO; cộng doanh thu đời thứ hai | `07-business-case/cost-model.xlsx`, `model.py` |
| T5.3 | NPV, năm hòa vốn, thời gian hoàn vốn theo phương án và kịch bản | **S21** `07-business-case/S21-business-case.md` |
| T5.4 | Ma trận quyết định có trọng số (chi phí, rủi ro tuân thủ, thương hiệu, quyền kiểm soát dữ liệu, khả năng mở rộng) | S21 §5 |
| T5.5 | "Khi nào không đáng làm": ngưỡng mà mỗi phương án thua | S21 §7 |
| T5.6 | KPI / OKR của nền tảng (tỷ lệ thu hồi, % chuyển đời thứ hai, thời gian lập báo cáo) | S21 §8 |
| T5.7 | Rà soát lần cuối sổ rủi ro | `00-management/risk-register.csv` |
| T5.8 | Khuyến nghị và lộ trình triển khai (giai đoạn, MVP) | S21 §6, §9 |

### P6 · Đóng gói

| Mã | Việc | Đầu ra |
|---|---|---|
| T6.1 | Tóm tắt điều hành (2 trang): trả lời RQ1–RQ7 bằng khoảng giá trị | **S22** `08-package/S22-executive-summary.md` |
| T6.2 | Trang case study (vấn đề → phương pháp → phát hiện → thiết kế → business case) | **S23** `docs/index.html`, `docs/forecast.html` |
| T6.3 | Slide 10–12 trang để trình bày khi phỏng vấn | **S23** `08-package/S23-deck.pptx` |
| T6.4 | README: tổng quan, cách chạy lại dự báo và notebook, sơ đồ repo | `README.md`, `tools/build_all.py` |
| T6.5 | Kiểm tra nhất quán lần cuối: mọi SRC/ASM được tham chiếu, RTM không lỗ hổng, link chạy, test pass | `tools/check_all.py` |
| T6.6 | Đẩy repo + Pages lên GitHub; thêm dự án vào portfolio BA | **M4** |


## 6. Sản phẩm

| Mã | Sản phẩm | Đầu ra số # trong đề tài |
|---|---|---|
| S1–S5, S7 | Charter, BACCM, PESTLE/SWOT, stakeholder/RACI, persona, As-Is | 4 |
| S6 | Ma trận tuân thủ EPR VN × EU 2023/1542 (⛔/⚠️/✏️) | 1 |
| S8 | Kiểm kê dữ liệu + chuỗi doanh số (min/likely/max) | 2 |
| S9 | Dự báo pin hết hạn cohort × Weibull 2025–2035, 3 kịch bản, năm giao cắt | 2 |
| S10 | Phân tích dòng vật chất (Sankey) + tỷ lệ đời thứ hai | 3 |
| S11 | Báo cáo phản biện (độ nhạy, đối chiếu IEA, phần không quan sát được) | 8 |
| S12–S13 | Vision & Scope, BPMN To-Be | 5 |
| S14–S16, S19 | SRS, mô hình dữ liệu, backlog, prototype | 6 |
| S17–S18 | Model card SoH + yêu cầu AI | tầng AI |
| S20 | Test case, UAT, RTM | 6 |
| S21 | Business case | 7 |
| S22–S23 | Tóm tắt điều hành, case study | — |
