import { useEffect, useMemo, useState } from "react";
import MyPageLayout from "./MyPageLayout";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    rating: 5,
    content: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me/orders", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "주문 내역을 불러오지 못했습니다.");
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const orderItems = useMemo(
    () =>
      orders.flatMap((order) =>
        (order.items || []).map((item, idx) => ({
          orderId: order._id || order.id || `${order.createdAt}-${idx}`,
          productId: item.productId?._id || item.productId,
          name: item.nameSnapshot || item.name,
          price: item.priceSnapshot ?? item.price ?? 0,
          quantity: item.quantity || 0,
          size: item.size,
          paidAt: order.paidAt || order.createdAt,
        }))
      ),
    [orders]
  );

  const openReview = (item) => {
    setReviewTarget(item);
    setSubmitStatus(null);
    setReviewForm({
      title: "",
      rating: 5,
      content: "",
    });
  };

  const closeReview = () => {
    setReviewTarget(null);
    setSubmitStatus(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTarget?.productId) {
      setSubmitStatus({ type: "error", message: "상품 정보를 찾을 수 없습니다." });
      return;
    }
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch(`/api/products/${reviewTarget.productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: reviewForm.title.trim(),
          rating: Number(reviewForm.rating),
          content: reviewForm.content.trim(),
          size: reviewTarget.size,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "리뷰 작성에 실패했습니다.");
      }
      setSubmitStatus({
        type: "success",
        message: data.message || "리뷰가 등록되었습니다.",
      });
      setReviewForm({ title: "", rating: 5, content: "" });
    } catch (err) {
      setSubmitStatus({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (val) => {
    if (!val) return "-";
    try {
      return new Date(val).toISOString().slice(0, 10);
    } catch {
      return val;
    }
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("ko-KR").format(Number(val) || 0);

  return (
    <>
      <MyPageLayout title="지난 주문 내역">
        {loading && <div className="order-state">불러오는 중...</div>}
        {error && <div className="order-error">{error}</div>}

        {!loading && !error && (
          <>
            {orderItems.length === 0 ? (
              <div className="order-state">지난 주문 내역이 없습니다.</div>
            ) : (
              <div className="order-list">
                {orderItems.map((item, idx) => (
                  <div
                    key={`${item.orderId}-${item.productId}-${idx}`}
                    className="order-card"
                  >
                    <div className="order-left">
                      <div className="order-line">
                        제품명: <strong>{item.name || "상품명 없음"}</strong>
                      </div>
                      <div className="order-line">
                        결제금액: {formatPrice(item.price)}원
                      </div>
                      <div className="order-actions">
                        <button className="review-button" onClick={() => openReview(item)}>
                          후기작성
                        </button>
                      </div>
                    </div>
                    <div className="order-right">
                      <div>수량: {item.quantity}개</div>
                      <div>사이즈: {item.size}</div>
                      <div>결제일: {formatDate(item.paidAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </MyPageLayout>

      {reviewTarget && (
        <div className="review-modal-backdrop" onClick={closeReview}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-head">
              <div>
                <div className="review-product">{reviewTarget.name}</div>
                <div className="review-meta">
                  수량 {reviewTarget.quantity}개 · 결제일 {formatDate(reviewTarget.paidAt)}
                </div>
              </div>
              <button className="close-button" onClick={closeReview} aria-label="닫기">
                ×
              </button>
            </div>

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <label className="review-field">
                <span>제목</span>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="리뷰 제목을 입력하세요"
                  required
                />
              </label>
              <label className="review-field">
                <span>평점</span>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                  }
                  required
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r}점
                    </option>
                  ))}
                </select>
              </label>
              <label className="review-field">
                <span>내용</span>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="제품을 사용해본 후기를 작성해주세요."
                  rows={5}
                  required
                />
              </label>
              {submitStatus && (
                <div className={`review-status ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}
              <div className="review-actions">
                <button type="button" className="ghost" onClick={closeReview}>
                  취소
                </button>
                <button type="submit" className="primary" disabled={submitting}>
                  {submitting ? "작성 중..." : "작성하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MyOrders;
