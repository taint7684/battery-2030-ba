"""S7 - Sinh BPMN As-Is: pin xe may dien tu luc het han den khi thai bo (hien trang).
Chay: py 01-discovery/S7-as-is/build_as_is.py ; anh: node tools/render_bpmn.js 01-discovery/S7-as-is/as-is.bpmn 2200 800"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "tools"))
from bpmn_builder import build
sys.stdout.reconfigure(encoding="utf-8")

LANES = ["Người dùng xe", "Đại lý / trạm đổi pin", "Thu gom phi chính thức", "Cơ sở tái chế", "VELIX (Dịch vụ, Tuân thủ)"]
N = {
    "s1": ("startEvent", "Pin yếu hoặc hỏng", 0, 0),
    "u1": ("task", "Mang xe đến đại lý", 0, 1),
    "d1": ("task", "Thay pin mới; giữ pin cũ [PP-01]", 1, 2),
    "g1": ("exclusiveGateway", "Pin cũ đi đâu?", 1, 3),
    "u2": ("task", "Khách giữ lại hoặc bán đồng nát [PP-02]", 0, 4),
    "d2": ("task", "Bán cho người thu mua theo cân [PP-03]", 1, 4),
    "v1": ("task", "Gửi về VELIX theo bảo hành", 4, 4),
    "i1": ("task", "Thu mua, gom theo cân", 2, 5),
    "i2": ("task", "Tháo dỡ thủ công, nấu chì / tách cell [PP-04]", 2, 6),
    "e1": ("endEvent", "Thất thoát: không chứng từ", 2, 7),
    "v2": ("task", "Lưu kho chờ xử lý, không theo dõi theo pin [PP-05]", 4, 5),
    "r1": ("task", "Nhận lô, cân, lập biên bản chung", 3, 6),
    "e2": ("endEvent", "Tái chế có chứng từ lô, không gắn từng pin", 3, 7),
    "s2": ("startEvent", "Đầu năm (trước 01/4)", 4, 7),
    "v3": ("task", "Tổng hợp V từ 3 file bán hàng, kho, hải quan [PP-06]", 4, 8),
    "v4": ("task", "Kê khai / báo cáo EPR thủ công [PP-07]", 4, 9),
    "e3": ("endEvent", "Hồ sơ nộp, số liệu khó giải trình", 4, 10),
}
F = [("s1", "u1", ""), ("u1", "d1", ""), ("d1", "g1", ""), ("g1", "u2", "Khách lấy lại"), ("g1", "d2", "Đại lý bán"),
     ("g1", "v1", "Pin bảo hành"), ("u2", "i1", ""), ("d2", "i1", ""), ("i1", "i2", ""), ("i2", "e1", ""),
     ("v1", "v2", ""), ("v2", "r1", ""), ("r1", "e2", ""), ("s2", "v3", ""), ("v3", "v4", ""), ("v4", "e3", "")]
errs = build("as_is", "Hiện trạng thu hồi pin xe máy điện (As-Is)", LANES, N, F,
             Path(__file__).resolve().parent / "as-is.bpmn", lane_h=150, vfirst={("g1", "u2"), ("g1", "v1")})
print("loi toan ven:", errs or "khong")
