import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import AdminProductsPage from "./AdminProductsPage";
import { useNavigate } from "react-router-dom";

const Wrap = styled.main`
  padding: 28px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$on ? "#111" : "#ddd")};
  background: ${(p) => (p.$on ? "#111" : "#fff")};
  color: ${(p) => (p.$on ? "#fff" : "#111")};
  cursor: pointer;
  font-weight: 650;
  font-size: 13px;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 16px;
`;

const BottomBar = styled.div`
  margin-top: 32px;
  text-align: right;
`;

const LogoutButton = styled.button`
  font-size: 12px;
  color: #777;
  background: transparent;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 4px 6px;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const API_BASE = "/api/admin";
const ALL_SIZES = [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280];

function toDateInputValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function money(n) {
  return `₩${Number(n || 0).toLocaleString()}`;
}

function calcFinalPrice(basePrice, discountRate) {
  const base = Number(basePrice || 0);
  const rate = Number(discountRate || 0);
  return Math.floor(base * (1 - rate / 100));
}

export default function AdminDashboard() {
  const tabs = useMemo(
    () => [
      { key: "products", label: "상품관리(등록/사이즈)" },
      { key: "discount", label: "할인정책 변경" },
      { key: "sales", label: "판매현황" },
    ],
    []
  );

  const [tab, setTab] = useState("products");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "로그아웃에 실패했습니다.");
      }
      navigate("/login");
    } catch (err) {
      console.error("Admin logout failed:", err);
      alert(err.message || "로그아웃에 실패했습니다.");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <Wrap>
      <TitleRow>
        <Title>관리자 통합 페이지</Title>
        <Tabs>
          {tabs.map((t) => (
            <TabBtn
              key={t.key}
              $on={tab === t.key}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </TabBtn>
          ))}
        </Tabs>
      </TitleRow>

      {tab === "products" && <AdminProductsPage />}

      {tab === "discount" && (
        <Card>
          <DiscountPolicyPanel />
        </Card>
      )}

      {tab === "sales" && (
        <Card>
          <SalesReportPanel />
        </Card>
      )}
      <BottomBar>
        <LogoutButton type="button" onClick={handleLogout} disabled={logoutLoading}>
          {logoutLoading ? "Logging out..." : "Logout"}
        </LogoutButton>
      </BottomBar>

    </Wrap>
  );
}

function DiscountPolicyPanel() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]);
  const [draft, setDraft] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedMsg, setSavedMsg] = useState("");

  const toggleSize = (productId, size) => {
    setDraft((prev) => {
      const cur = prev?.[productId]?.availableSizes || [];
      const next = cur.includes(size)
        ? cur.filter((x) => x !== size)
        : [...cur, size].sort((a, b) => a - b);
      return {
        ...prev,
        [productId]: { ...(prev[productId] || {}), availableSizes: next },
      };
    });
  };

  const load = async () => {
    setLoading(true);
    setErr("");
    setSavedMsg("");
    try {
      const res = await fetch(`${API_BASE}/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`상품 목록 조회 실패: ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      const nextDraft = {};
      (data || []).forEach((p) => {
        nextDraft[p._id] = {
          discountRate: p.discountRate ?? 0,
          availableSizes: Array.isArray(p.availableSizes)
            ? p.availableSizes
            : [],
        };
      });
      setDraft(nextDraft);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChangeRate = (id, value) => {
    const v = value === "" ? "" : Number(value);
    setDraft((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), discountRate: v },
    }));
  };

  const saveProduct = async (product) => {
    const id = product._id;
    const rateRaw = draft?.[id]?.discountRate;
    const rate = Number(rateRaw);
    if (Number.isNaN(rate) || rate < 0 || rate > 100) {
      setErr("할인율은 0~100 사이여야 합니다.");
      return;
    }

    const sizes = draft?.[id]?.availableSizes || [];
    if (!Array.isArray(sizes) || sizes.length === 0) {
      setErr("가능 사이즈를 1개 이상 선택해주세요.");
      return;
    }

    setSavingId(id);
    setErr("");
    setSavedMsg("");

    try {
      const discountRes = await fetch(`${API_BASE}/products/${id}/discount`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ discountRate: rate }),
      });
      if (!discountRes.ok) {
        throw new Error(
          `할인율 업데이트 실패: ${discountRes.status} ${await discountRes.text()}`
        );
      }

      const sizesRes = await fetch(`${API_BASE}/products/${id}/sizes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ availableSizes: sizes }),
      });
      if (!sizesRes.ok) {
        throw new Error(
          `사이즈 업데이트 실패: ${sizesRes.status} ${await sizesRes.text()}`
        );
      }

      const updated = await sizesRes.json();
      setProducts((prev) => prev.map((item) => (item._id === id ? updated : item)));
      setDraft((prev) => ({
        ...prev,
        [id]: {
          discountRate: updated.discountRate ?? rate,
          availableSizes: updated.availableSizes ?? sizes,
        },
      }));
      setSavedMsg(`저장 완료: ${updated.name}`);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSavingId(null);
    }
  };

  const rows = useMemo(() => products, [products]);

  return (
    <div style={panelStyles.panel}>
      <h3 style={panelStyles.h3}>할인정책 변경</h3>
      <p style={panelStyles.desc}>
        상품 목록에서 할인율(%)을 조정하고 적용할 수 있습니다.
      </p>

      {loading && <div style={panelStyles.info}>불러오는 중...</div>}
      {err && <div style={panelStyles.err}>{err}</div>}
      {savedMsg && <div style={panelStyles.ok}>{savedMsg}</div>}

      <div style={{ width: "100%", overflowX: "auto" }}>
        <table style={panelStyles.table}>
          <thead>
            <tr>
              <th style={panelStyles.th}>상품명</th>
              <th style={panelStyles.th}>정가</th>
              <th style={panelStyles.th}>할인율(%)</th>
              <th style={panelStyles.th}>가능 사이즈</th>
              <th style={panelStyles.th}>할인가(미리보기)</th>
              <th style={panelStyles.th}>저장</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    ...panelStyles.td,
                    textAlign: "center",
                    padding: 18,
                    opacity: 0.7,
                    height: 80,
                  }}
                >
                  상품이 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const rate = draft?.[p._id]?.discountRate ?? p.discountRate ?? 0;
                const finalPrice = calcFinalPrice(p.basePrice, rate);

                return (
                  <tr key={p._id}>
                    <td style={panelStyles.td}>{p.name}</td>
                    <td style={panelStyles.td}>{money(p.basePrice)}</td>
                    <td style={panelStyles.td}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rate}
                        onChange={(e) => onChangeRate(p._id, e.target.value)}
                        style={panelStyles.input}
                      />
                    </td>
                    <td style={panelStyles.td}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          maxWidth: 420,
                        }}
                      >
                        {ALL_SIZES.map((size) => {
                          const selected =
                            (draft?.[p._id]?.availableSizes || []).includes(
                              size
                            );
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(p._id, size)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 10,
                                border: "1px solid rgba(0,0,0,0.25)",
                                background: selected ? "#111" : "#fff",
                                color: selected ? "#fff" : "#111",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td style={{ ...panelStyles.td, fontWeight: 700 }}>
                      {money(finalPrice)}
                    </td>
                    <td style={panelStyles.td}>
                      <button
                        style={panelStyles.primaryBtn}
                        onClick={() => saveProduct(p)}
                        disabled={savingId === p._id}
                      >
                        {savingId === p._id ? "저장중" : "저장"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SalesReportPanel() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const now = new Date();
    const s = new Date(now);
    s.setDate(now.getDate() - 30);
    setStart(toDateInputValue(s));
    setEnd(toDateInputValue(now));
  }, []);

  const totalRevenue = useMemo(
    () => rows.reduce((acc, r) => acc + Number(r.revenue || 0), 0),
    [rows]
  );

  const fetchSales = async () => {
    setLoading(true);
    setErr("");
    try {
      const qs = new URLSearchParams();
      if (start) qs.set("start", start);
      if (end) qs.set("end", end);

      const res = await fetch(`${API_BASE}/sales?${qs.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`판매현황 조회 실패: ${res.status} ${text}`);
      }
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(String(e?.message || e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={panelStyles.panel}>
      <h3 style={panelStyles.h3}>판매현황</h3>
      <p style={panelStyles.desc}>
        기간을 선택하고 조회하면 상품별 판매량/매출이 표시됩니다.
      </p>

      {err && <div style={panelStyles.err}>{err}</div>}

      <div style={panelStyles.filtersRow}>
        <label style={panelStyles.label}>
          시작일
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={panelStyles.date}
          />
        </label>
        <label style={panelStyles.label}>
          종료일
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            style={panelStyles.date}
          />
        </label>
        <button
          style={panelStyles.primaryBtn}
          onClick={fetchSales}
          disabled={loading}
        >
          {loading ? "조회중" : "조회"}
        </button>
      </div>

      <div style={{ marginTop: 10, fontWeight: 800 }}>
        총 매출: {money(totalRevenue)}
      </div>

      <div style={{ width: "100%", overflowX: "auto", marginTop: 10 }}>
        <table style={panelStyles.table}>
          <thead>
            <tr>
              <th style={panelStyles.th}>상품</th>
              <th style={panelStyles.th}>판매량</th>
              <th style={panelStyles.th}>매출(할인 반영)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    ...panelStyles.td,
                    textAlign: "center",
                    padding: 18,
                    opacity: 0.7,
                    height: 80,
                  }}
                >
                  조회 결과가 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.productId || row.name}>
                  <td style={panelStyles.td}>{row.name || "(삭제 상품)"}</td>
                  <td style={panelStyles.td}>{Number(row.quantity || 0)}</td>
                  <td style={{ ...panelStyles.td, fontWeight: 700 }}>
                    {money(row.revenue || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        * 매출은 주문 시점 priceSnapshot(할인 반영 금액) × quantity 기준입니다.
      </div>
    </div>
  );
}

const panelStyles = {
  panel: {
    width: "100%",
    minWidth: 0,
  },
  h3: { margin: "6px 0 6px" },
  desc: { margin: "0 0 14px", opacity: 0.75 },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 8,
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    fontWeight: 900,
    padding: "12px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(0,0,0,0.03)",
    fontSize: 13,
  },
  td: {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    fontSize: 13,
    verticalAlign: "middle",
  },
  input: {
    width: 90,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.25)",
  },
  date: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.25)",
  },
  label: { display: "flex", alignItems: "center", gap: 8, fontWeight: 800 },
  filtersRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 900,
  },
  err: {
    background: "rgba(255,0,0,0.08)",
    border: "1px solid rgba(255,0,0,0.2)",
    color: "#b00020",
    padding: "10px 12px",
    borderRadius: 8,
    marginBottom: 10,
    fontWeight: 700,
  },
  ok: {
    background: "rgba(0,128,0,0.08)",
    border: "1px solid rgba(0,128,0,0.2)",
    color: "#0b6b0b",
    padding: "10px 12px",
    borderRadius: 8,
    marginBottom: 10,
    fontWeight: 700,
  },
  info: { padding: "10px 0", opacity: 0.7 },
};
