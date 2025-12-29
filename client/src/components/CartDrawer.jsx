import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../pages/ProductDetail.css";

function CartDrawer() {
  const {
    drawerOpen,
    closeCart,
    cart,
    cartLoading,
    updateCartItem,
    deleteCartItem,
    checkout,
    checkingOut,
  } = useCart();
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    if (!drawerOpen) {
      setCheckoutError(null);
    }
  }, [drawerOpen]);

  if (!drawerOpen) {
    return null;
  }

  const handleCheckoutClick = async () => {
    setCheckoutError(null);
    try {
      const data = await checkout();
      alert(data.message || "결제가 완료되었습니다.");
      closeCart();
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  const totalAmount =
    cart.items?.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0) || 0;
  const formattedTotal = totalAmount.toLocaleString();

  return (
    <div className="cart-drawer" onClick={closeCart}>
      <div className="cart-drawer-inner" onClick={(e) => e.stopPropagation()}>
        <div className="cart-top">
          <button className="cart-close" onClick={closeCart} type="button">
            ×
          </button>
          <div className="cart-promo">
            <div className="cart-promo-icon">🛒</div>
            <div className="cart-promo-text">
              회원가입 시 1만원 할인 쿠폰 증정 (마케팅 수신 동의 필수)
            </div>
          </div>
        </div>
        <div className="cart-items">
          {cartLoading ? (
            <div className="cart-loading">불러오는 중...</div>
          ) : cart.items?.length ? (
            cart.items.map((item) => (
              <div key={item.id || item._id} className="cart-item">
                <div className="cart-thumb-block">
                  <div className="cart-thumb">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} />
                    ) : (
                      <div className="placeholder">이미지 없음</div>
                    )}
                  </div>
                  <div className="cart-qty">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartItem(
                          item.id || item._id,
                          Math.max(1, (item.quantity || 1) - 1)
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartItem(item.id || item._id, (item.quantity || 1) + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-info">
                  <div className="cart-header-row">
                    <div className="cart-name">{item.name}</div>
                  </div>
                  <div className="cart-sub">{item.size}</div>
                  <div className="cart-price-row">
                    <span className="cart-sale-price">
                      ₩{(item.price || 0).toLocaleString()}
                    </span>
                    {item.discountRate > 0 && (
                      <span className="cart-base-price">
                        ₩
                        {Math.round(
                          (item.price || 0) / (1 - (item.discountRate || 0) / 100)
                        ).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cart-actions">
                  <button
                    className="cart-del"
                    type="button"
                    onClick={() => deleteCartItem(item.id || item._id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="cart-empty">장바구니가 비어 있습니다.</div>
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>총액</span>
            <span>₩{formattedTotal}</span>
          </div>
          <button
            className="cart-checkout"
            onClick={handleCheckoutClick}
            disabled={checkingOut}
            type="button"
          >
            {checkingOut ? "결제 중..." : "결제"}
          </button>
          {checkoutError && (
            <div style={{ marginTop: 8, color: "#d00", fontSize: 13 }}>{checkoutError}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
