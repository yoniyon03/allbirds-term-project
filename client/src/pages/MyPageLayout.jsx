import { Link, useLocation } from "react-router-dom";
import "./MyOrders.css";

const NAV_LINKS = [
  { path: "/my/profile", label: "회원 정보" },
  { path: "/my/orders", label: "지난 주문 내역" },
  { path: "/my/order-register", label: "주문 정보 등록" },
  { path: "/my/benefits", label: "올맴버스 혜택" },
  { path: "/my/logout", label: "로그아웃" },
];

function MyPageLayout({ title, children }) {
  const { pathname } = useLocation();

  return (
    <div className="mypage">
      <div className="mypage-container">
        <aside className="mypage-nav">
          <div className="nav-title">마이페이지</div>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.path} className={pathname === link.path ? "active" : ""}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <section className="mypage-content">
          <h1 className="mypage-heading">{title}</h1>
          {children}
        </section>
      </div>
    </div>
  );
}

export default MyPageLayout;
