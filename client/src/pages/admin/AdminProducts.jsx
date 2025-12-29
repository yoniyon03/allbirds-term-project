import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  letter-spacing: -0.5px;
`;

const Btn = styled(Link)`
  border: 1px solid #111;
  background: #111;
  color: #fff;
  text-decoration: none;
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 650;
`;

const Table = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 12px;
  overflow: hidden;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr 240px 150px;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid #f0f0f0;
  align-items: center;

  &:first-child {
    border-top: 0;
    background: #fafafa;
    font-weight: 700;
    font-size: 13px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 13px;
`;

const SaveBtn = styled.button`
  height: 36px;
  border-radius: 8px;
  border: 1px solid #111;
  background: #fff;
  cursor: pointer;
  font-weight: 650;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Small = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

async function api(path, options) {
  const res = await fetch(path, { credentials: "include", ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "요청 실패");
  return data;
}

export default function AdminProducts() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]);
  const [sizeDraft, setSizeDraft] = useState({});
  const [discountDraft, setDiscountDraft] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const m = await api("/api/auth/me");
      if (!m.user || m.user.role !== "admin") {
        nav("/login");
        return;
      }
      setMe(m.user);

      const list = await api("/api/products");
      setItems(list);
      // draft init
      const s = {};
      const d = {};
      list.forEach((p) => {
        s[p._id] = (p.availableSizes || []).join(",");
        d[p._id] = String(p.discountRate ?? 0);
      });
      setSizeDraft(s);
      setDiscountDraft(d);
    })().catch(() => nav("/login"));
  }, [nav]);

  const onSaveSizes = async (id) => {
    try {
      setBusy(true);
      const sizes = (sizeDraft[id] || "")
        .split(",")
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => Number.isFinite(n));

      const updated = await api(`/api/products/${id}/sizes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableSizes: sizes }),
      });

      setItems((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onSaveDiscount = async (id) => {
    try {
      setBusy(true);
      const discountRate = Math.max(0, Math.min(100, parseInt(discountDraft[id] || "0", 10) || 0));
      const updated = await api(`/api/products/${id}/discount`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountRate }),
      });
      setItems((prev) => prev.map((p) => (p._id === id ? updated : p)));
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <Top>
        <div>
          <Title>관리자 · 상품 관리</Title>
          <Small>가용사이즈 변경 / 상품 등록(사진 필수)</Small>
        </div>
        <Btn to="/admin/products/new">상품 등록</Btn>
      </Top>

      <Table>
        <Row>
          <div>상품명</div>
          <div>가용 사이즈 (예: 250,255,260)</div>
          <div>할인율(%)</div>
          <div>저장</div>
        </Row>

        {items.map((p) => (
          <Row key={p._id}>
            <div>{p.name}</div>

            <div>
              <Input
                value={sizeDraft[p._id] ?? ""}
                onChange={(e) =>
                  setSizeDraft((prev) => ({ ...prev, [p._id]: e.target.value }))
                }
              />
            </div>

            <div>
              <Input
                value={discountDraft[p._id] ?? "0"}
                onChange={(e) =>
                  setDiscountDraft((prev) => ({ ...prev, [p._id]: e.target.value }))
                }
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <SaveBtn disabled={busy} onClick={() => onSaveSizes(p._id)}>
                사이즈 저장
              </SaveBtn>
              <SaveBtn disabled={busy} onClick={() => onSaveDiscount(p._id)}>
                할인 저장
              </SaveBtn>
            </div>
          </Row>
        ))}
      </Table>
    </Wrap>
  );
}
