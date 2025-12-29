import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SIZE = [
  220, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295,
  300, 310,
];

/** -------------------- Layout -------------------- */

const Page = styled.div`
  background: #fff;
`;
const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 12px 24px 60px;
  background: #f3f3f3;
`;

const TopGenderRow = styled.div`
  margin-top: 0;
  display: flex;
  justify-content: flex-start;
`;

const GenderToggle = styled.div`
  display: inline-flex;
  border: 1px solid rgba(0, 0, 0, 0.55);
  border-radius: 6px;
  overflow: hidden;
`;

const GenderBtn = styled.button`
  width: 150px;
  height: 44px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  background: ${(p) => (p.$active ? "#111" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#111")};
`;

const CategoryTabsRow = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 18px;
`;

const CategoryPill = styled.button`
  border: 1px solid rgba(0, 0, 0, 0.55);
  border-radius: 8px;
  background: #fff;
  height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;

  .x {
    font-weight: 800;
    opacity: 0.8;
  }
`;

const NavTab = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${(p) => (p.$active ? 700 : 400)};
  color: #111;
  text-decoration: none;
  opacity: ${(p) => (p.$active ? 1 : 0.7)};
`;

const Divider = styled.div`
  margin-top: 16px;
  height: 1px;
  background: #e5e5e5;
`;

const ContentGrid = styled.div`
  margin-top: 26px;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 34px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

/** -------------------- Left filter panel -------------------- */

const SidePanel = styled.aside``;

const SideSectionTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 12px;
  letter-spacing: -0.2px;
`;

const AppliedRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 14px;
`;

const AppliedTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 12px;
  letter-spacing: -0.2px;
`;

const ResetLink = styled.button`
  margin-top: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
  text-decoration: underline;
  text-underline-offset: 4px;

  &:hover {
    color: rgba(0, 0, 0, 1);
  }
`;

const AppliedChips = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
`;

const AppliedChip = styled.button`
  width: fit-content;
  border: 1px solid rgba(0, 0, 0, 0.55);
  background: #fff;
  border-radius: 4px;
  height: 42px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;

  .x {
    font-weight: 900;
    opacity: 0.75;
  }
`;

const FilterBlock = styled.div`
  margin-top: 28px;
`;

const FilterLabel = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 12px;
  letter-spacing: -0.2px;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const SizeBtn = styled.button`
  min-width: 69px;
  min-height: 37px;
  border-radius: 2px;
  border: 1px solid #1e1e1eff;
  background: ${(p) => (p.$active ? "#111" : "#f1f1f1")};
  color: ${(p) => (p.$active ? "#fff" : "#111")};
  line-height: normal;
  padding: 0;

  font-size: 17px;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.15s ease;

  &:hover {
    ${(p) =>
      !p.$disabled &&
      !p.$active &&
      `
        border-color: #111;
        background: #fff;
      `}
  }

  ${(p) =>
    p.$disabled &&
    `
      background: #fafafa;
      color: #bbb;
      border-color: #e5e5e5;
    `}
`;

const MaterialRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.82);
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #111;
  }
`;

/** -------------------- Right / products -------------------- */

const Main = styled.main`
  min-width: 0;
`;

const TopLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const CountText = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const SortArea = styled.div`
  position: relative;
`;

const SortIconBtn = styled.button`
  width: 56px;
  height: 56px;
  border: 1px solid rgba(0, 0, 0, 0.55);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:hover {
    border-color: rgba(0, 0, 0, 0.85);
  }
`;

const SortMenu = styled.div`
  position: absolute;
  right: 0;
  top: 62px;
  width: 220px;
  border: 1px solid rgba(0, 0, 0, 0.55);
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  z-index: 100;
`;

const SortItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  text-align: left;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.55);
    display: inline-block;
    position: relative;
  }

  .dot::after {
    content: "";
    position: absolute;
    inset: 3px;
    border-radius: 999px;
    background: ${(p) => (p.$active ? "#111" : "transparent")};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 460px;
  z-index: ${(p) => (p.$hovered ? 10 : 1)};
`;

const CardLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const CardInner = styled.div`
  background: #fff;
  position: relative;

  overflow: visible;

  transition: none;
  box-shadow: none;

  ${(p) =>
    p.$hovered &&
    `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    
    border: 1px solid #e6e6e6;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 100;
  `}
`;

const ImgBox = styled.div`
  width: 100%;
  height: 320px;
  background: #f2f1ef;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

const ThumbBar = styled.div`
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(6px);
`;

const Thumb = styled.button`
  width: 34px;
  height: 24px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  background: #fff;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 140ms ease, transform 140ms ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.55);
    transform: translateY(-1px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CardBody = styled.div`
  padding: 12px 14px 14px;
  background: #fff;
  padding: 14px 14px 16px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
`;

const Sub = styled.div`
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  margin-bottom: 10px;
  opacity: 0.7;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Discount = styled.div`
  color: #d93025;
  font-weight: 700;
  font-size: 12px;
`;

const FinalPrice = styled.div`
  font-weight: 600;
  font-size: 13px;
`;

const Original = styled.div`
  color: rgba(0, 0, 0, 0.35);
  font-size: 12px;
  text-decoration: line-through;
`;

const HoverSizesPanel = styled.div`
  background: #fff;
  padding: 0 14px 18px;
  margin-top: -10px;
`;

const HoverSizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
`;

const HoverSizeCell = styled.div`
  height: 36px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 500;
  position: relative;
  background: #fff;
  color: #111;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    ${(p) =>
      !p.$disabled &&
      `
      border: 1px solid #111;
      font-weight: 700;
    `}
  }

  ${(p) =>
    p.$disabled &&
    `
      opacity: 1; /* 투명도 대신 색상으로 처리 */
      color: #ccc;
      border-color: #eee;
      background: #fafafa;
      cursor: default;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        /* 올버즈 스타일 빗금: 왼쪽 아래 -> 오른쪽 위 */
        background: linear-gradient(
          to top right,
          transparent 48%,
          #e0e0e0 49%,
          #e0e0e0 51%,
          transparent 52%
        );
      }
    `}
`;

const InlineSizes = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;

  opacity: ${(p) => (p.$show ? 1 : 0)};
  max-height: ${(p) => (p.$show ? "200px" : "0")};
  transition: opacity 0.15s ease, max-height 0.15s ease;
`;

const InlineSizeCell = styled.div`
  height: 34px;
  border: 1px solid #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  background: #fff;

  ${(p) =>
    p.$disabled &&
    `
      border-color:#ddd;
      color:#bbb;
      position:relative;

      &::after {
        content:'';
        position:absolute;
        inset:0;
        background:
          linear-gradient(
            135deg,
            transparent 48%,
            #ccc 49%,
            #ccc 51%,
            transparent 52%
          );
      }
    `}
`;

function isOnSale(p, now = new Date()) {
  if (!p || (p.discountRate ?? 0) <= 0) return false;

  const start = p.saleStart ? new Date(p.saleStart) : null;
  const end = p.saleEnd ? new Date(p.saleEnd) : null;

  if (start && now < start) return false;
  if (end && now > end) return false;

  return true;
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loadingErr, setLoadingErr] = useState("");

  // 필터 상태
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // 정렬 상태
  const [sortOption, setSortOption] = useState("recommend");
  const [sortOpen, setSortOpen] = useState(false);

  // 카드 hover
  const [hoveredId, setHoveredId] = useState(null);

  // 썸네일 선택(카드별 대표 이미지)
  const [heroById, setHeroById] = useState({});

  const [soldMap, setSoldMap] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const sortRef = useRef(null);

  const query = new URLSearchParams(location.search);
  const type = query.get("type");

  const tabs = useMemo(
    () => [
      { key: "new", label: "신제품" },
      { key: "lifestyle", label: "라이프스타일" },
      { key: "active", label: "액티브" },
      { key: "sale", label: "세일" },
      { key: "slipon", label: "슬립온" },
      { key: "slipper", label: "슬리퍼" },
    ],
    []
  );

  useEffect(() => {
    const onDown = (e) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target)) setSortOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    let mounted = true;

    fetch("/api/products")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`서버 에러 ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
        setLoadingErr("");
      })
      .catch((err) => {
        console.error("데이터 로딩 실패:", err);
        if (!mounted) return;
        setLoadingErr(String(err?.message || err));
        setProducts(FALLBACK_PRODUCTS);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (sortOption !== "sales") return;

    fetch("/api/products/sales")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`판매현황 조회 실패 ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((rows) => {
        const map = {};
        (Array.isArray(rows) ? rows : []).forEach((r) => {
          map[String(r.productId)] = Number(r.quantity || 0);
        });
        setSoldMap(map);
      })
      .catch((e) => {
        console.error(e);
        setSoldMap({});
      });
  }, [sortOption]);

  const goTab = (key) => {
    navigate(`/products?type=${key}`);
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((x) => x !== size) : [...prev, size]
    );
  };

  const toggleMaterial = (mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((x) => x !== mat) : [...prev, mat]
    );
  };

  const clearAll = () => {
    setSelectedSizes([]);
    setSelectedMaterials([]);
  };

  const removeSize = (size) =>
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  const removeMaterial = (mat) =>
    setSelectedMaterials((prev) => prev.filter((m) => m !== mat));

  const sizeOptions = useMemo(() => {
    const s = new Set();
    products.forEach((p) =>
      safeArray(p.availableSizes).forEach((x) => s.add(x))
    );
    const arr = Array.from(s).sort((a, b) => a - b);

    const hasAllbirdsLike = arr.some((x) => x >= 250);
    if (!arr.length || !hasAllbirdsLike) return SIZE;
    return SIZE;
  }, [products]);

  const materialOptions = useMemo(() => {
    const s = new Set();
    products.forEach((p) => safeArray(p.materials).forEach((x) => s.add(x)));
    const arr = Array.from(s);
    return arr.length > 0
      ? arr
      : ["가볍고 시원한 tree", "부드럽고 따뜻한 wool"];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const now = new Date();

    if (type === "new") {
      result = result.filter((p) => {
        const created = new Date(p.createdAt);
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);
        return diffDays <= 30;
      });
    } else if (type === "lifestyle") {
      result = result.filter((p) =>
        safeArray(p.categories).includes("lifestyle")
      );
    } else if (type === "slipon") {
      result = result.filter((p) => safeArray(p.categories).includes("slipon"));
    } else if (type === "sale") {
      result = result.filter((p) => isOnSale(p, now));
    } else if (type === "active") {
      result = result.filter((p) => safeArray(p.categories).includes("active"));
    } else if (type === "slipper") {
      result = result.filter((p) =>
        safeArray(p.categories).includes("slipper")
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        safeArray(p.availableSizes).some((size) => selectedSizes.includes(size))
      );
    }

    if (selectedMaterials.length > 0) {
      result = result.filter((p) =>
        safeArray(p.materials).some((m) => selectedMaterials.includes(m))
      );
    }

    result.sort((a, b) => {
      const priceA = (a.basePrice || 0) * (1 - (a.discountRate || 0) / 100);
      const priceB = (b.basePrice || 0) * (1 - (b.discountRate || 0) / 100);

      if (sortOption === "lowPrice") return priceA - priceB;
      if (sortOption === "highPrice") return priceB - priceA;
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "sales") {
        const sa = soldMap[String(a._id)] || 0;
        const sb = soldMap[String(b._id)] || 0;

        if (sb !== sa) return sb - sa;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [products, selectedSizes, selectedMaterials, sortOption, type, soldMap]);

  const appliedCount = selectedSizes.length + selectedMaterials.length;

  return (
    <Page>
      <Container>
        <TopGenderRow>
          <GenderToggle>
            <GenderBtn $active>남성</GenderBtn>
            <GenderBtn>여성</GenderBtn>
          </GenderToggle>
        </TopGenderRow>

        <CategoryTabsRow>
          <CategoryPill>
            신발 <span className="x">×</span>
          </CategoryPill>

          {tabs.map((t) => (
            <NavTab
              key={t.key}
              $active={type === t.key}
              onClick={() => goTab(t.key)}
            >
              {t.label}
            </NavTab>
          ))}
        </CategoryTabsRow>

        <Divider />

        <ContentGrid>
          <SidePanel>
            {appliedCount > 0 && (
              <AppliedRow>
                <AppliedTitle>적용된 필터</AppliedTitle>
              </AppliedRow>
            )}

            {appliedCount > 0 && (
              <AppliedChips>
                {selectedSizes.map((s) => (
                  <AppliedChip key={`size-${s}`} onClick={() => removeSize(s)}>
                    {s} <span className="x">×</span>
                  </AppliedChip>
                ))}
                {selectedMaterials.map((m) => (
                  <AppliedChip
                    key={`mat-${m}`}
                    onClick={() => removeMaterial(m)}
                  >
                    {m} <span className="x">×</span>
                  </AppliedChip>
                ))}
              </AppliedChips>
            )}

            {appliedCount > 0 && (
              <ResetLink onClick={clearAll}>초기화</ResetLink>
            )}

            <FilterBlock>
              <FilterLabel>사이즈</FilterLabel>

              <SizeGrid>
                {sizeOptions.map((size) => {
                  const existsInAny = products.some((p) =>
                    safeArray(p.availableSizes).includes(size)
                  );

                  return (
                    <SizeBtn
                      key={size}
                      $active={selectedSizes.includes(size)}
                      $disabled={!existsInAny}
                      onClick={() => {
                        if (!existsInAny) return;
                        toggleSize(size);
                      }}
                    >
                      {size}
                    </SizeBtn>
                  );
                })}
              </SizeGrid>
            </FilterBlock>

            <FilterBlock>
              <SideSectionTitle style={{ marginTop: 0 }}>소재</SideSectionTitle>

              <MaterialRow>
                {materialOptions.map((mat) => (
                  <CheckRow key={mat}>
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(mat)}
                      onChange={() => toggleMaterial(mat)}
                    />
                    {mat}
                  </CheckRow>
                ))}
              </MaterialRow>
            </FilterBlock>

            {loadingErr && (
              <div style={{ marginTop: 18, fontSize: 12, color: "#b00020" }}>
                (참고) API 연결 실패로 더미데이터로 표시 중: {loadingErr}
              </div>
            )}
          </SidePanel>

          <Main>
            <TopLine>
              <CountText>{filteredProducts.length}개 제품</CountText>

              <SortArea ref={sortRef}>
                <SortIconBtn
                  onClick={() => setSortOpen((v) => !v)}
                  aria-label="정렬"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 7h14"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 12h14"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M5 17h14"
                      stroke="black"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </SortIconBtn>

                {sortOpen && (
                  <SortMenu>
                    {[
                      { key: "recommend", label: "추천순" },
                      { key: "sales", label: "판매순" },
                      { key: "lowPrice", label: "가격 낮은 순" },
                      { key: "highPrice", label: "가격 높은 순" },
                      { key: "newest", label: "최신 등록 순" },
                    ].map((opt) => (
                      <SortItem
                        key={opt.key}
                        $active={sortOption === opt.key}
                        onClick={() => {
                          setSortOption(opt.key);
                          setSortOpen(false);
                        }}
                      >
                        <span className="dot" />
                        {opt.label}
                      </SortItem>
                    ))}
                  </SortMenu>
                )}
              </SortArea>
            </TopLine>

            <ProductGrid>
              {filteredProducts.length === 0 && (
                <div
                  style={{
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "#fff",
                    padding: "40px 20px",
                    textAlign: "center",
                    fontWeight: 700,
                    minHeight: 260,
                  }}
                >
                  조건에 맞는 상품이 없습니다.
                </div>
              )}
              {filteredProducts.map((p) => {
                const base = p.basePrice || 0;
                const rate = p.discountRate || 0;
                const finalPrice = Math.floor(base * (1 - rate / 100));

                const images = safeArray(p.images);
                const hero =
                  heroById[p._id] || images[0] || "/img/placeholder.png";

                const available = new Set(safeArray(p.availableSizes));
                const allSizesForHover = sizeOptions;

                const hovered = hoveredId === p._id;

                return (
                  <Card
                    key={p._id}
                    $hovered={hovered}
                    onMouseEnter={() => setHoveredId(p._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <CardLink to={`/products/${p._id}`}>
                      <CardInner $hovered={hovered}>
                        <ImgBox>
                          <img src={hero} alt={p.name} />

                          {images.length > 1 && (
                            <ThumbBar>
                              {images.slice(0, 6).map((src, idx) => (
                                <Thumb
                                  key={`${p._id}-thumb-${idx}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setHeroById((prev) => ({
                                      ...prev,
                                      [p._id]: src,
                                    }));
                                  }}
                                  aria-label="색상/이미지 선택"
                                >
                                  <img
                                    src={src}
                                    alt={`${p.name} thumb ${idx + 1}`}
                                  />
                                </Thumb>
                              ))}
                            </ThumbBar>
                          )}
                        </ImgBox>

                        <CardBody>
                          <Name>{p.name}</Name>
                          <Sub>{p.shortDescription || " "}</Sub>

                          <PriceRow>
                            {rate > 0 && <Discount>{rate}%</Discount>}
                            <FinalPrice>
                              ₩{finalPrice.toLocaleString()}
                            </FinalPrice>
                            {rate > 0 && (
                              <Original>₩{base.toLocaleString()}</Original>
                            )}
                          </PriceRow>
                        </CardBody>

                        {hovered && (
                          <HoverSizesPanel>
                            <HoverSizeGrid>
                              {allSizesForHover.map((s) => (
                                <HoverSizeCell
                                  key={`${p._id}-hs-${s}`}
                                  $disabled={!available.has(s)}
                                >
                                  {s}
                                </HoverSizeCell>
                              ))}
                            </HoverSizeGrid>
                          </HoverSizesPanel>
                        )}
                      </CardInner>
                    </CardLink>
                  </Card>
                );
              })}
            </ProductGrid>
          </Main>
        </ContentGrid>
      </Container>
    </Page>
  );
}

export default ProductList;

const FALLBACK_PRODUCTS = [];
