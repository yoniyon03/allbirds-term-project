import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const Wrap = styled.main`
  padding: 28px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: 22px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 8px;
  padding: 16px;
`;

const SubTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 16px;
`;

const Table = styled.div`
  display: grid;
  gap: 10px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 260px 110px;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #f1f1f1;

  @media (max-width: 980px) {
    grid-template-columns: 72px 1fr;
  }
`;

const Thumb = styled.img`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
`;

const Name = styled.div`
  font-weight: 650;
  margin-bottom: 4px;
`;

const Meta = styled.div`
  font-size: 12px;
  color: #666;
`;

const SizeBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeChip = styled.button`
  border: 1px solid ${(p) => (p.$on ? "#111" : "#ddd")};
  background: ${(p) => (p.$on ? "#111" : "#fff")};
  color: ${(p) => (p.$on ? "#fff" : "#111")};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
`;

const Btn = styled.button`
  border: 1px solid #111;
  background: #111;
  color: #fff;
  height: 38px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 650;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 10px;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: #222;
`;

const Input = styled.input`
  height: 38px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 10px;
  outline: none;

  &:focus {
    border-color: #111;
  }
`;

const Textarea = styled.textarea`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  outline: none;
  min-height: 80px;
  resize: vertical;

  &:focus {
    border-color: #111;
  }
`;

const ErrorText = styled.div`
  color: #c00;
  font-size: 12px;
`;

const Preview = styled.img`
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const API = import.meta.env.VITE_API_BASE || ""; // 없으면 same-origin
// const thumbSrc = p.images ? p.images.split(",")[0] : "";

async function api(path, options) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "요청 실패");
  return data;
}

// DB에 있는 사이즈 범위에 맞춰(235~260 등) 너가 쓰는 걸로 조정 가능
const SIZES = [230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 등록 폼 상태 (DB 스키마에 맞춤)
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountRate, setDiscountRate] = useState("0");
  const [categories, setCategories] = useState(["slipon"]);
  const [materials, setMaterials] = useState(["Tree"]);
  const [sizes, setSizes] = useState([235, 240, 245]);

  const [files, setFiles] = useState([]);

  const [previewUrl, setPreviewUrl] = useState("");

  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);

  // 사이즈 수정 임시 상태(상품별)
  const [dirtyMap, setDirtyMap] = useState({}); // { [id]: Set([...]) }
  const dirtyIds = useMemo(() => new Set(Object.keys(dirtyMap)), [dirtyMap]);

  useEffect(() => {
    (async () => {
      try {
        const items = await api("/api/admin/products");
        setProducts(items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(files[0]); // 첫 장만 미리보기
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [files]);

  const toggleSizeForProduct = (productId, size) => {
    setDirtyMap((prev) => {
      const origin =
        products.find((p) => p._id === productId)?.availableSizes || [];
      const cur = prev[productId] ? new Set(prev[productId]) : new Set(origin);

      if (cur.has(size)) cur.delete(size);
      else cur.add(size);

      if (cur.size === 0) return prev; // 0개 방지
      return { ...prev, [productId]: cur };
    });
  };

  const saveSizes = async (productId) => {
    const setForId = dirtyMap[productId];
    if (!setForId || setForId.size === 0) return;

    const next = Array.from(setForId).sort((a, b) => a - b);

    const updated = await api(`/api/admin/products/${productId}/sizes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availableSizes: next }),
    });

    setProducts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setDirtyMap((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const toggleFormSize = (size) => {
    setSizes((prev) => {
      const has = prev.includes(size);
      const next = has ? prev.filter((s) => s !== size) : [...prev, size];
      return next.length === 0 ? prev : next;
    });
  };

  const toggleToken = (arrSetter, arr, token) => {
    arrSetter(
      arr.includes(token) ? arr.filter((x) => x !== token) : [...arr, token]
    );
  };

  const submitNewProduct = async (e) => {
    e.preventDefault();
    setFormErr("");

    if (!name.trim()) return setFormErr("상품명을 입력하세요.");
    if (!basePrice || Number(basePrice) <= 0)
      return setFormErr("basePrice를 올바르게 입력하세요.");
    if (!files || files.length === 0)
      return setFormErr("사진은 반드시 포함되어야 합니다.");
    if (!sizes.length) return setFormErr("가용사이즈를 1개 이상 선택하세요.");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("shortDescription", shortDescription);
      fd.append("basePrice", String(Number(basePrice)));
      fd.append("discountRate", String(Number(discountRate || 0)));
      fd.append("categories", JSON.stringify(categories));
      fd.append("materials", JSON.stringify(materials));
      fd.append("availableSizes", JSON.stringify(sizes));

      files.forEach((file) => {
        fd.append("images", file);
      });

      const created = await api("/api/admin/products", {
        method: "POST",
        body: fd,
      });

      setProducts((prev) => [created, ...prev]);

      // reset
      setName("");
      setShortDescription("");
      setBasePrice("");
      setDiscountRate("0");
      setCategories(["slipon"]);
      setMaterials(["Tree"]);
      setSizes([235, 240, 245]);
      setFiles([]);
      setPreviewUrl("");
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrap>
      <Title>관리자 상품관리</Title>

      <Grid>
        {/* 등록된 상품 + 가용사이즈 변경 */}
        <Card>
          <SubTitle>등록된 상품</SubTitle>
          {loading ? (
            <div>불러오는 중…</div>
          ) : products.length === 0 ? (
            <div>등록된 상품이 없습니다.</div>
          ) : (
            <Table>
              {products.map((p) => {
                const edited = dirtyMap[p._id]
                  ? Array.from(dirtyMap[p._id])
                  : p.availableSizes;
                const editedSet = new Set(edited);

                const salePrice = Math.round(
                  (p.basePrice * (100 - (p.discountRate || 0))) / 100
                );

                // ✅ 여기서만 p 사용 가능
                const thumbSrc = Array.isArray(p.images)
                  ? p.images[0]
                  : p.images
                  ? String(p.images).split(",")[0]
                  : "";

                return (
                  <Row key={p._id}>
                    <Thumb src={thumbSrc} alt={p.name} />
                    <div>
                      <Name>{p.name}</Name>
                      <Meta>
                        base: {Number(p.basePrice).toLocaleString()}원 · sale:{" "}
                        {Number(salePrice).toLocaleString()}원 · discount:{" "}
                        {p.discountRate || 0}%
                      </Meta>
                    </div>

                    <SizeBox>
                      {SIZES.map((s) => (
                        <SizeChip
                          key={s}
                          type="button"
                          $on={editedSet.has(s)}
                          onClick={() => toggleSizeForProduct(p._id, s)}
                        >
                          {s}
                        </SizeChip>
                      ))}
                    </SizeBox>

                    <Btn
                      type="button"
                      disabled={!dirtyIds.has(p._id)}
                      onClick={() => saveSizes(p._id)}
                    >
                      저장
                    </Btn>
                  </Row>
                );
              })}
            </Table>
          )}
        </Card>

        {/* 상품 등록(사진 필수) */}
        <Card>
          <SubTitle>새 상품 등록</SubTitle>
          <Form onSubmit={submitNewProduct}>
            <Field>
              상품명(name)
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field>
              한줄설명(shortDescription)
              <Textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="예: 데일리로 신기 좋은 트리 슬립온"
              />
            </Field>

            <Field>
              정가(basePrice)
              <Input
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                inputMode="numeric"
              />
            </Field>

            <Field>
              할인율(discountRate, %)
              <Input
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                inputMode="numeric"
              />
            </Field>

            <Field>
              카테고리(categories)
              <SizeBox>
                {["slipon", "lifestyle", "running"].map((c) => (
                  <SizeChip
                    key={c}
                    type="button"
                    $on={categories.includes(c)}
                    onClick={() => toggleToken(setCategories, categories, c)}
                  >
                    {c}
                  </SizeChip>
                ))}
              </SizeBox>
            </Field>

            <Field>
              소재(materials)
              <SizeBox>
                {["Tree", "Wool", "Sugarcane"].map((m) => (
                  <SizeChip
                    key={m}
                    type="button"
                    $on={materials.includes(m)}
                    onClick={() => toggleToken(setMaterials, materials, m)}
                  >
                    {m}
                  </SizeChip>
                ))}
              </SizeBox>
            </Field>

            <Field>
              가용사이즈(availableSizes)
              <SizeBox>
                {SIZES.map((s) => (
                  <SizeChip
                    key={s}
                    type="button"
                    $on={sizes.includes(s)}
                    onClick={() => toggleFormSize(s)}
                  >
                    {s}
                  </SizeChip>
                ))}
              </SizeBox>
            </Field>

            <Field>
              사진(필수) → images[0]로 저장
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </Field>

            {previewUrl && <Preview src={previewUrl} alt="preview" />}
            {formErr && <ErrorText>{formErr}</ErrorText>}

            <Btn type="submit" disabled={saving}>
              {saving ? "등록 중…" : "상품 등록"}
            </Btn>
          </Form>
        </Card>
      </Grid>
    </Wrap>
  );
}
