"""S13 - Sinh BPMN To-Be: thu hoi -> danh gia SoH -> dieu phoi -> ban giao -> bao cao EPR.
Chay: py 04-solution/S13-bpmn/build_to_be.py ; anh: node tools/render_bpmn.js 04-solution/S13-bpmn/to-be.bpmn 2700 1060"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "tools"))
from bpmn_builder import build
sys.stdout.reconfigure(encoding="utf-8")

LANES = ["Đại lý / trạm đổi pin", "Kho vận VELIX", "Trung tâm kiểm định VELIX", "Nền tảng Battery 2030",
         "Đơn vị tái chế / đời thứ hai", "Tuân thủ VELIX"]
N = {
    "s1": ("startEvent", "Khách mang pin đến", 0, 0),
    "a1": ("userTask", "Quét mã pin hoặc cấp mã tạm hãng khác [BR-06]", 0, 1),
    "a2": ("userTask", "Checklist an toàn; pin nguy hiểm → cách ly [BR-07]", 0, 2),
    "a4": ("userTask", "Lưu phiếu, phí 0 đ (ngoại tuyến được) [BR-30]", 0, 3),
    "y1": ("serviceTask", "Cập nhật tồn kho, kiểm ngưỡng gom lô [BR-08]", 3, 3),
    "k1": ("userTask", "Lập lô gom GL-, vận chuyển", 1, 4),
    "c1": ("userTask", "Cân nhận tại trung tâm, kiểm chênh lệch [BR-16]", 2, 5, -35),
    "g3": ("exclusiveGateway", "Pin Li không nguy hiểm?", 2, 6, -35),
    "y2": ("serviceTask", "Ước lượng SoH + khoảng tin cậy [BR-10]", 3, 7),
    "g4": ("exclusiveGateway", "Đủ tin cậy?", 3, 8),
    "c2": ("userTask", "Đo tay SoH", 2, 9, 40),
    "g5": ("exclusiveGateway", "", 3, 10),
    "y3": ("businessRuleTask", "Đề xuất điều phối [BR-11, BR-12, BR-29]", 3, 11),
    "g6": ("exclusiveGateway", "Hướng?", 3, 12),
    "k3": ("userTask", "Lập lô CT-, kiểm giấy phép [BR-15]", 1, 13),
    "c3": ("userTask", "Phê duyệt Đời thứ hai (người khác) [BR-13]", 2, 14, -35),
    "k2": ("userTask", "Bàn giao kèm hợp đồng, tạo hồ sơ mới [BR-25]", 1, 15),
    "e1": ("endEvent", "Pin vào đời thứ hai", 4, 16, 40),
    "r1": ("userTask", "Cân nhận, ghi chênh lệch [BR-16]", 4, 13, -30),
    "r2": ("userTask", "Xác nhận đã tái chế theo quy cách [BR-17]", 4, 15, -30),
    "y4": ("serviceTask", "Đóng hồ sơ pin, cộng kết quả tái chế [BR-26]", 3, 17),
    "e2": ("endEvent", "Pin đã tái chế", 3, 18),
    "s2": ("startEvent", "Trước 01/4 hằng năm", 5, 12),
    "t1": ("userTask", "Chọn hình thức và cách thức [BR-20]", 5, 13),
    "y5": ("serviceTask", "Tính V, R×V, kết quả, bảo lưu, F [BR-04, 18, 19]", 5, 14),
    "t2": ("userTask", "Xuất hồ sơ, nộp Hệ thống EPR quốc gia [FR-24]", 5, 15),
    "g7": ("exclusiveGateway", "Đóng góp tài chính?", 5, 16),
    "t3": ("userTask", "Nộp tiền vào Quỹ BVMT trước 20/4", 5, 17, -45),
    "e3": ("endEvent", "Hoàn thành nghĩa vụ năm", 5, 18, 35),
}
F = [("s1", "a1", ""), ("a1", "a2", ""), ("a2", "a4", ""), ("a4", "y1", ""), ("y1", "k1", "Đề xuất gom lô"), ("k1", "c1", ""), ("c1", "g3", ""),
     ("g3", "y3", "Không (chì / nguy hiểm)"), ("g3", "y2", "Có"), ("y2", "g4", ""), ("g4", "g5", "Có"), ("g4", "c2", "Không"), ("c2", "g5", ""),
     ("g5", "y3", ""), ("y3", "g6", ""), ("g6", "c3", "Đời thứ hai"), ("g6", "k3", "Tái chế"), ("c3", "k2", ""), ("k2", "e1", ""),
     ("k3", "r1", ""), ("r1", "r2", ""), ("r2", "y4", ""), ("y4", "e2", ""),
     ("s2", "t1", ""), ("t1", "y5", ""), ("y5", "t2", ""), ("t2", "g7", ""), ("g7", "t3", "Có"), ("g7", "e3", "Không"), ("t3", "e3", "")]
errs = build("to_be", "Quy trình To-Be: thu hồi, đánh giá, điều phối, báo cáo EPR (S13)", LANES, N, F,
             Path(__file__).resolve().parent / "to-be.bpmn", lane_h=170, col_w=150,
             vfirst={("g3", "y2"), ("g4", "c2"), ("g6", "c3"), ("g6", "k3"), ("g7", "t3")})
print("loi toan ven:", errs or "khong")
