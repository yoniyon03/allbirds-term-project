import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../context/CartContext.jsx";

const accordionSections = [
  {
    title: "상세 정보",
    body: `하루 종일 편안한 데일리 스타일. 당신이 기다려온 통기성이 뛰어난 유칼립투스 나무 섬유로 만든 클래식 로우탑 스니커즈
용도: 워킹, 따뜻한 날씨, 데일리
천연 소재: 가볍고 통기성이 뛰어난 유칼립투스 나무 섬유가 주는 차원이 다른 편안함
심플한 디자인: 데일리 클래식 디자인, 여행에 적합한 디자인
제조국: 베트남.`,
  },
  {
    title: "지속 가능성",
    body: `Cruiser의 탄소 발자국은 5.31 kg CO2e입니다.
이러한 노력을 통해 올버즈는 Climate Neutral에서 탄소 중립 기업 인증을 획득했으며, 탄소 저감 프로젝트 펀딩을 비롯한 지속 가능한 활동을 통해 탄소 중립을 실현합니다.
지속 가능한 소재:
FSC 인증 TENCEL™ Lyocell (유칼립투스 나무 섬유) 어퍼
사탕수수 기반의 그린 EVA를 사용한 SweetFoam® 미드솔
플라스틱 페트병을 재활용한 신발 끈
캐스터 빈 인솔`,
  },
  {
    title: "세탁 방법 및 취급시 주의사항",
    body: `신발 끈을 신발에서 분리해주세요.
깔창을 신발에서 분리하여 신발과 같이 세탁망(베개 커버도 가능)에 넣어주세요.
세탁기 사용 시 찬물/울 코스로 중성세제를 적당량 첨가하여 세탁해 주시기 바랍니다.
세탁 후에 남은 물기는 털어주시고 자연 건조해 주세요.
1-2회 착용 후 원래 모양으로 곧 돌아오니 걱정하지 않으셔도 됩니다.
더 새로운 경험을 원하시면 새로운 인솔과 신발 끈으로 교체하세요.
팁: 건조기 사용은 피해주세요. 세탁 후에 원래 모양으로 곧 돌아오니 걱정 마세요. 신발 끈과 인솔은 손세탁 하셔도 됩니다.`,
  },
  {
    title: "배송 & 반품",
    body: `전제품 5만원 이상 구입 시 무료 배송

올멤버스: 조건 없는 무료 배송 & 30일 내 무료 교환/환불 (단, 세일 제품은 7일 내 미착용 시 교환/환불)
비회원: 7일 내 미착용 시 교환/환불
반품: 물류센터에 반송품이 도착한 뒤 5 영업일 내 검수 후 환불
교환: 동일 가격의 상품으로만 교환 가능, 맞교환 불가, 물류센터에 반송품이 도착한 뒤 새로운 교환 상품 발송 (교환 일정 7~10 영업일 소요)`,
  },
];

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [gender, setGender] = useState("men");
  const [accordionOpen, setAccordionOpen] = useState({});
  const [addStatus, setAddStatus] = useState(null);
  const [adding, setAdding] = useState(false);
  const { addToCart: addItemToCart, openCart } = useCart();

  const sizeOptions = useMemo(
    () => Array.from({ length: (285 - 230) / 5 + 1 }, (_, i) => 230 + i * 5),
    []
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, reviewRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/reviews`),
        ]);

        if (!prodRes.ok) {
          const msg = (await prodRes.json()).message || "상품 정보를 불러오지 못했습니다.";
          throw new Error(msg);
        }
        if (!reviewRes.ok) {
          const msg = (await reviewRes.json()).message || "리뷰를 불러오지 못했습니다.";
          throw new Error(msg);
        }

        const prodData = await prodRes.json();
        const reviewData = await reviewRes.json();
        setProduct(prodData);
        setReviews(reviewData);
        setActiveImage(prodData.images?.[0] || null);
        setSelectedSize(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    setAddStatus(null);
    if (!selectedSize) {
      setAddStatus({ type: "error", message: "사이즈를 선택해 주세요." });
      return;
    }
    setAdding(true);
    try {
      const data = await addItemToCart({
        productId: id,
        size: selectedSize,
        quantity: 1,
      });
      setAddStatus({ type: "success", message: data.message || "장바구니에 담았습니다." });
      openCart();
    } catch (err) {
      setAddStatus({ type: "error", message: err.message });
    } finally {
      setAdding(false);
    }
  };

  const priceText = useMemo(() => {
    if (!product) return "";
    const price = product.finalPrice ?? product.basePrice ?? 0;
    const formatter = new Intl.NumberFormat("ko-KR");
    return formatter.format(price);
  }, [product]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const renderStars = (val) => {
    const n = Math.round(val || 0);
    return "★".repeat(n) + "☆".repeat(5 - n);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loader">불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="error-box">상품 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="media-column">
          <div className="hero-image">
            {activeImage ? (
              <img src={activeImage} alt={product.name} />
            ) : (
              <div className="placeholder">이미지가 없습니다</div>
            )}
          </div>

          <div className="accordions">
            {accordionSections.map((section, idx) => {
              const open = !!accordionOpen[idx];
              return (
                <div key={section.title} className="accordion-item">
                  <button
                    type="button"
                    className="accordion-header"
                    onClick={() =>
                      setAccordionOpen((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                  >
                    <span>{section.title}</span>
                    <span>{open ? "−" : "+"}</span>
                  </button>
                  {open && <div className="accordion-body">{section.body}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="info-column">
          <h1 className="product-title">{product.name}</h1>
          <div className="price">
            {product.discountRate > 0 ? (
              <>
                <span className="discount-rate">{product.discountRate}%</span>
                <span className="sale-price">₩{priceText}</span>
                <span className="base-price">
                  ₩{new Intl.NumberFormat("ko-KR").format(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="sale-price">₩{priceText}</span>
            )}
          </div>
          <p className="summary">{product.shortDescription}</p>

          <div className="color-row">
            {(product.images || []).map((src) => (
              <button
                key={src}
                type="button"
                className={`color-chip ${activeImage === src ? "selected" : ""}`}
                onClick={() => setActiveImage(src)}
              >
                <img src={src} alt="색상 이미지" />
              </button>
            ))}
          </div>

          <div className="section gender-row">
            <button
              type="button"
              className={`pill ${gender === "men" ? "active" : ""}`}
              onClick={() => setGender("men")}
            >
              남성
            </button>
            <button
              type="button"
              className={`pill ${gender === "women" ? "active muted" : "muted"}`}
              onClick={() => setGender("women")}
            >
              여성
            </button>
          </div>

          <div className="section">
            <div className="section-label">사이즈</div>
            <div className="size-grid">
              {sizeOptions.map((size) => {
                const available = product.availableSizes?.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!available}
                    className={`size-btn ${selectedSize === size ? "selected" : ""} ${
                      !available ? "unavailable" : ""
                    }`}
                    onClick={() => available && setSelectedSize(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSize && (
            <>
              <button className="add-cart" type="button" onClick={handleAddToCart} disabled={adding}>
                {adding ? "담는 중..." : `장바구니 담기 · ₩${priceText}`}
              </button>
              {addStatus && <div className={`status-chip ${addStatus.type}`}>{addStatus.message}</div>}
            </>
          )}
        </div>
      </div>

      <div className="reviews-panel">
        <div className="reviews-header">
          <div className="reviews-header-line">
            <div className="overall-score">{averageRating || "–"}</div>
            <div className="overall-stars">
              {averageRating ? renderStars(averageRating) : "☆☆☆☆☆"}
            </div>
          </div>
          <div className="overall-count">
            {reviews.length ? `${reviews.length}개의 리뷰 분석 결과입니다.` : "아직 리뷰가 없습니다."}
          </div>
        </div>

        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-row">
              <div className="review-left">{r.user?.name || "익명"}</div>
              <div className="review-body">
                <div className="review-head">
                  <span className="review-stars">{renderStars(r.rating)}</span>
                  {r.title && <strong className="review-title-inline">{r.title}</strong>}
                  <span className="review-date">
                    {new Date(r.createdAt).toISOString().slice(0, 10)}
                  </span>
                </div>
                <div className="review-content">{r.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
