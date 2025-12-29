import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyPageLayout from "./MyPageLayout";
import "./MyOrders.css";

function MyLogout() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "로그아웃에 실패했습니다.");
      }
      setStatus({ type: "success", message: data.message || "로그아웃 완료" });
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyPageLayout title="로그아웃">
      <div className="order-state">
        현재 로그인된 세션을 종료합니다. 로그아웃을 누르면 메인으로 이동합니다.
      </div>
      <div className="order-actions" style={{ marginTop: 12 }}>
        <button className="review-button" onClick={handleLogout} disabled={loading}>
          {loading ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>
      {status && (
        <div className={`review-status ${status.type}`} style={{ marginTop: 10 }}>
          {status.message}
        </div>
      )}
    </MyPageLayout>
  );
}

export default MyLogout;
