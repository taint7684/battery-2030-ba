"""Kiem tra mo hinh du bao (T2.8). Chay: .venv/Scripts/python -m pytest -q tests"""
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "03-forecast" / "model"))
import forecast as F  # noqa: E402
import params as P  # noqa: E402


@pytest.fixture(scope="module")
def base():
    return F.simulate("Cơ sở", F.draw_params())


def test_weibull_mean_matches_parameter():
    t = np.linspace(0, 80, 80001)
    for mean, k in [(6, 3.0), (2, 3.0), (12, 3.6)]:
        surv = 1 - F.weibull_cdf(t, mean, k)
        assert abs(np.trapezoid(surv, t) - mean) < 0.01  # E[T] = tich phan ham song


def test_hazard_in_unit_interval():
    h = F.hazard(6, 3.0)
    assert ((h >= 0) & (h <= 1)).all() and h[-1] == 1.0


def test_triangular_bounds_and_mode():
    assert F.tri((1, 2, 4), None) == 2
    vals = [F.tri((1, 2, 4), u) for u in np.linspace(0, 1, 101)]
    assert min(vals) >= 1 - 1e-9 and max(vals) <= 4 + 1e-9


def test_mass_balance_per_segment(base):
    """Pin dua ra thi truong (moi + thay the) = pin het han + pin dang dung cuoi ky."""
    for s, g in base.groupby("segment"):
        placed = g.placed_new_units.sum() + g.placed_repl_units.sum()
        eol = g.eol_units.sum()
        stock_end = g.sort_values("year").stock_units.iloc[-1]
        assert abs(placed - (eol + stock_end)) / placed < 1e-9, s


def test_stock_never_exceeds_cumulative_sales(base):
    for s, g in base.groupby("segment"):
        g = g.sort_values("year")
        assert (g.stock_units.values <= g.placed_new_units.cumsum().values + 1e-6).all(), s


def test_flow_splits_close(base):
    assert np.allclose(base.formal_t + base.informal_t, base.eol_t)
    assert np.allclose(base.second_life_t + base.recycle_t, base.formal_t)
    assert (base[base.segment == "e2W-Chì"].second_life_t == 0).all()  # ac quy chi khong co doi thu hai


def test_sales_history_matches_sources():
    s = F.sales_by_segment("Cơ sở", F.draw_params())
    tot = {y: s["e2W-Li"][y] + s["e2W-Chì"][y] for y in (2017, 2021)}
    assert round(tot[2017]) == 39700 and round(tot[2021]) == 288000  # SRC-021


def test_scenario_ordering_2035():
    li = {}
    for sc in P.SCENARIOS:
        df = F.simulate(sc, F.draw_params())
        li[sc] = df[(df.year == 2035) & df.segment.ne("e2W-Chì")].eol_t.sum()
    assert li["Chậm"] < li["Cơ sở"] < li["Nhanh"]


def test_eu_collection_rate_formula(base):
    g = base[base.segment == "e2W-Li"].sort_values("year").reset_index(drop=True)
    i = g.index[g.year == 2030][0]
    expected = g.formal_t[i] / g.placed_t[i - 3:i].mean()  # REQ-EU-10: 3 nam truoc
    assert abs(g.eu_collection_rate[i] - expected) < 1e-9
