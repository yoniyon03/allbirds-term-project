import { useEffect, useMemo, useState } from "react";

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

export default function AdminPage() {
  const [tab, setTab] = useState("discount");
  return (
    <div style={styles.page}>
      <h2 style={styles.title}>관리자 페이지</h2>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            ...(tab === "discount" ? styles.tabActive : {}),
          }}
          onClick={() => setTab("discount")}
        >
          할인정책 변경
        </button>
        <button
          style={{
            ...styles.tabBtn,
            ...(tab === "sales" ? styles.tabActive : {}),
          }}
          onClick={() => setTab("sales")}
        >
          판매현황
        </button>
      </div>

      <div style={styles.panelWrap}>
        {tab === "discount" ? <DiscountPolicyPanel /> : <SalesReportPanel />}
      </div>
    </div>
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

      // draft 초기화
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

  const saveProduct = async (p) => {
    const id = p._id;

    const rateRaw = draft?.[id]?.discountRate;
    const rate = Number(rateRaw);
    if (Number.isNaN(rate) || rate < 0 || rate > 100) {
      setErr("할인율은 0~100 사이 숫자여야 합니다.");
      return;
    }

    const sizes = draft?.[id]?.availableSizes || [];
    if (!Array.isArray(sizes) || sizes.length === 0) {
      setErr("가용사이즈를 1개 이상 선택하세요.");
      return;
    }

    setSavingId(id);
    setErr("");
    setSavedMsg("");

    try {
      // 1) 할인율 저장
      const r1 = await fetch(`${API_BASE}/products/${id}/discount`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ discountRate: rate }),
      });
      if (!r1.ok)
        throw new Error(`할인율 저장 실패: ${r1.status} ${await r1.text()}`);
      const updated1 = await r1.json();

      // 2) 가용사이즈 저장
      const r2 = await fetch(`${API_BASE}/products/${id}/sizes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ availableSizes: sizes }),
      });
      if (!r2.ok)
        throw new Error(`사이즈 저장 실패: ${r2.status} ${await r2.text()}`);
      const updated2 = await r2.json();

      setProducts((prev) => prev.map((x) => (x._id === id ? updated2 : x)));
      setDraft((prev) => ({
        ...prev,
        [id]: {
          discountRate: updated2.discountRate ?? rate,
          availableSizes: updated2.availableSizes ?? sizes,
        },
      }));

      setSavedMsg(`저장 완료: ${updated2.name}`);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setSavingId(null);
    }
  };

  const rows = useMemo(() => products, [products]);

  return (
    <div style={styles.panel}>
      <h3 style={styles.h3}>할인정책 변경</h3>
      <p style={styles.desc}>상품 목록에서 할인율(%)을 수정하고 저장하세요.</p>

      {loading && <div style={styles.info}>불러오는 중…</div>}
      {err && <div style={styles.err}>{err}</div>}
      {savedMsg && <div style={styles.ok}>{savedMsg}</div>}

      <div style={{ width: "100%", overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>정가</th>
              <th style={styles.th}>할인율(%)</th>
              <th style={styles.th}>가용사이즈</th>
              <th style={styles.th}>할인가(미리보기)</th>
              <th style={styles.th}>저장</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    ...styles.td,
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
                const rate =
                  draft?.[p._id]?.discountRate ?? p.discountRate ?? 0;
                const finalPrice = calcFinalPrice(p.basePrice, rate);

                return (
                  <tr key={p._id}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{money(p.basePrice)}</td>

                    {/* 할인율 */}
                    <td style={styles.td}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={rate}
                        onChange={(e) => onChangeRate(p._id, e.target.value)}
                        style={styles.input}
                      />
                    </td>

                    {/* 가용사이즈 */}
                    <td style={styles.td}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          maxWidth: 420,
                        }}
                      >
                        {ALL_SIZES.map((s) => {
                          const selected = (
                            draft?.[p._id]?.availableSizes || []
                          ).includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSize(p._id, s)}
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
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* 할인가 */}
                    <td style={{ ...styles.td, fontWeight: 700 }}>
                      {money(finalPrice)}
                    </td>

                    {/* 저장 */}
                    <td style={styles.td}>
                      <button
                        style={styles.primaryBtn}
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
  const [start, setStart] = useState(""); // YYYY-MM-DD
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
        const t = await res.text();
        throw new Error(`판매현황 조회 실패: ${res.status} ${t}`);
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
    <div style={styles.panel}>
      <h3 style={styles.h3}>판매현황</h3>
      <p style={styles.desc}>
        기간을 선택하고 조회하면 제품별 판매수량 / 매출(할인 적용)이 표시됩니다
      </p>

      {err && <div style={styles.err}>{err}</div>}

      <div style={styles.filtersRow}>
        <label style={styles.label}>
          시작일{" "}
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={styles.date}
          />
        </label>
        <label style={styles.label}>
          종료일{" "}
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            style={styles.date}
          />
        </label>
        <button
          style={styles.primaryBtn}
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
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>상품</th>
              <th style={styles.th}>판매수량</th>
              <th style={styles.th}>매출(할인적용)</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    ...styles.td,
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
              rows.map((r) => (
                <tr key={r.productId}>
                  <td style={styles.td}>{r.name || "(삭제된 상품)"}</td>
                  <td style={styles.td}>{Number(r.quantity || 0)}</td>
                  <td style={{ ...styles.td, fontWeight: 700 }}>
                    {money(r.revenue || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        * 매출은 주문 당시 priceSnapshot(할인 적용 단가) × quantity 합계입니다.
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: 24,
    width: "100%",
    textAlign: "left",
  },
  title: { margin: "0 0 12px" },
  tabs: { display: "flex", gap: 8, marginBottom: 18 },
  tabBtn: {
    border: "1px solid #222",
    background: "#fff",
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800,
  },
  tabActive: { background: "#111", color: "#fff" },

  panelWrap: {
    width: "100%",
    minWidth: 0,
    display: "block",
  },
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

  sizeGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    maxWidth: 340,
  },
  sizeBtn: {
    border: "1px solid rgba(0,0,0,0.25)",
    background: "#fff",
    borderRadius: 8,
    padding: "6px 10px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 12,
  },
  sizeBtnOn: {
    background: "#111",
    color: "#fff",
    borderColor: "#111",
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
