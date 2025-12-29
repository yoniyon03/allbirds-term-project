import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      if (res.status === 401) {
        setCart({ items: [] });
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCart(data);
      } else {
        console.error("Cart fetch failed:", data);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async ({ productId, size, quantity = 1 }) => {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, size, quantity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "장바구니 담기에 실패했습니다.");
      }
      await fetchCart();
      return data;
    },
    [fetchCart]
  );

  const updateCartItem = useCallback(
    async (itemId, quantity) => {
      await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });
      await fetchCart();
    },
    [fetchCart]
  );

  const deleteCartItem = useCallback(
    async (itemId) => {
      await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchCart();
    },
    [fetchCart]
  );

  const checkout = useCallback(async () => {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "결제에 실패했습니다.");
      }
      await fetchCart();
      return data;
    } finally {
      setCheckingOut(false);
    }
  }, [fetchCart]);

  const cartCount = useMemo(
    () =>
      cart.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
    [cart]
  );

  const value = {
    cart,
    cartCount,
    cartLoading,
    drawerOpen,
    checkingOut,
    fetchCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    checkout,
    openCart: () => setDrawerOpen(true),
    closeCart: () => setDrawerOpen(false),
    toggleCart: () => setDrawerOpen((prev) => !prev),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
