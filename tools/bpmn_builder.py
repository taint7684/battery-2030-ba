"""Sinh file BPMN 2.0 co Diagram Interchange tu mo ta lane/nut/luong.
Dung chung cho As-Is (S7) va To-Be (S13). Mo file bang https://demo.bpmn.io hoac Camunda Modeler.
Anh PNG/SVG: node tools/render_bpmn.js <file.bpmn>
"""
import re
from xml.sax.saxutils import escape

SIZE = {"startEvent": (36, 36), "endEvent": (36, 36), "exclusiveGateway": (50, 50),
        "parallelGateway": (50, 50), "intermediateCatchEvent": (36, 36)}


def build(pid, pname, lanes, nodes, flows, out_path, lane_h=140, col_w=170, vfirst=()):
    """lanes: [ten]; nodes: {id: (loai, ten, lane, cot[, dy])}; flows: [(tu, den, nhan)]. dy: lech doc trong lane (px)."""
    X0, LX = 40, 30

    def box(n):
        k, _, lane, col = nodes[n][:4]
        dy = nodes[n][4] if len(nodes[n]) > 4 else 0
        w, h = SIZE.get(k, (130, 78))
        cx, cy = X0 + LX + 80 + col * col_w, 20 + lane * lane_h + lane_h / 2 + dy
        return cx - w / 2, cy - h / 2, w, h

    def ctr(n):
        x, y, w, h = box(n)
        return x + w / 2, y + h / 2

    def wps(a, b):
        (ax, ay), (bx, by) = ctr(a), ctr(b)
        xa, ya, wa, ha = box(a)
        xb, yb, wb, hb = box(b)
        if abs(ay - by) < 1:
            if bx > ax:
                return [(xa + wa, ay), (xb, by)]
            top = min(ya, yb) - 28  # quay lui cung lane: vong len tren
            return [(ax, ya), (ax, top), (bx, top), (bx, yb)]
        if bx < ax:  # quay lui khac lane: vong xuong duoi nut dich
            down = by > ay
            return [(ax, ya + ha if down else ya), (ax, by + (hb / 2 + 24) * (1 if not down else -1)),
                    (bx, by + (hb / 2 + 24) * (1 if not down else -1)), (bx, yb if down else yb + hb)]
        if abs(bx - ax) < 1:
            return [(ax, ya + ha if by > ay else ya), (bx, yb if by > ay else yb + hb)]
        if (a, b) in vfirst:
            return [(ax, ya + ha if by > ay else ya), (ax, by), (xb, by)]
        return [(xa + wa, ay), (bx, ay), (bx, yb if by > ay else yb + hb)]

    maxcol = max(v[3] for v in nodes.values())
    pool_w = LX + 80 + (maxcol + 1) * col_w + 40
    pool_h = len(lanes) * lane_h
    inc = {n: [] for n in nodes}
    outg = {n: [] for n in nodes}
    for i, (a, b, _) in enumerate(flows):
        outg[a].append(f"f{i}")
        inc[b].append(f"f{i}")
    L = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" '
         'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" '
         'xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="bpmn_defs" targetNamespace="http://battery2030.example/bpmn">',
         f'  <bpmn:collaboration id="collab"><bpmn:participant id="pool" name="{escape(pname)}" processRef="{pid}"/></bpmn:collaboration>',
         f'  <bpmn:process id="{pid}" isExecutable="false">', '    <bpmn:laneSet id="bpmn_laneset">']
    for li, ln in enumerate(lanes):
        L.append(f'      <bpmn:lane id="lane{li}" name="{escape(ln)}">')
        L += [f"        <bpmn:flowNodeRef>{n}</bpmn:flowNodeRef>" for n, v in nodes.items() if v[2] == li]
        L.append("      </bpmn:lane>")
    L.append("    </bpmn:laneSet>")
    for n, v in nodes.items():
        k, name = v[0], v[1]
        L.append(f'    <bpmn:{k} id="{n}" name="{escape(name)}">')
        L += [f"      <bpmn:incoming>{f}</bpmn:incoming>" for f in inc[n]]
        L += [f"      <bpmn:outgoing>{f}</bpmn:outgoing>" for f in outg[n]]
        L.append(f"    </bpmn:{k}>")
    for i, (a, b, lab) in enumerate(flows):
        L.append(f'    <bpmn:sequenceFlow id="f{i}" sourceRef="{a}" targetRef="{b}" name="{escape(lab)}"/>')
    L += ["  </bpmn:process>", '  <bpmndi:BPMNDiagram id="bpmn_diagram"><bpmndi:BPMNPlane id="bpmn_plane" bpmnElement="collab">',
          f'    <bpmndi:BPMNShape id="pool_di" bpmnElement="pool" isHorizontal="true"><dc:Bounds x="{X0}" y="20" width="{pool_w}" height="{pool_h}"/></bpmndi:BPMNShape>']
    for li in range(len(lanes)):
        L.append(f'    <bpmndi:BPMNShape id="lane{li}_di" bpmnElement="lane{li}" isHorizontal="true">'
                 f'<dc:Bounds x="{X0 + LX}" y="{20 + li * lane_h}" width="{pool_w - LX}" height="{lane_h}"/></bpmndi:BPMNShape>')
    for n in nodes:
        x, y, w, h = box(n)
        mk = ' isMarkerVisible="true"' if nodes[n][0] == "exclusiveGateway" else ""
        L.append(f'    <bpmndi:BPMNShape id="{n}_di" bpmnElement="{n}"{mk}><dc:Bounds x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}"/></bpmndi:BPMNShape>')
    for i, (a, b, _) in enumerate(flows):
        pts = "".join(f'<di:waypoint x="{px:.0f}" y="{py:.0f}"/>' for px, py in wps(a, b))
        L.append(f'    <bpmndi:BPMNEdge id="f{i}_di" bpmnElement="f{i}">{pts}</bpmndi:BPMNEdge>')
    L += ["  </bpmndi:BPMNPlane></bpmndi:BPMNDiagram>", "</bpmn:definitions>", ""]
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(L))
    # kiem tra toan ven: moi nut co duong vao (tru start) va duong ra (tru end)
    reserved = {"collab", "pool", "bpmn_defs", "bpmn_laneset", "bpmn_diagram", "bpmn_plane", pid}
    dup = [n for n in nodes if n in reserved or re.fullmatch(r"(lane\d+|f\d+)(_di)?", n)]
    errs = dup + [n for n, v in nodes.items() if v[0] != "startEvent" and not inc[n]] + \
           [n for n, v in nodes.items() if v[0] != "endEvent" and not outg[n]]
    return errs
