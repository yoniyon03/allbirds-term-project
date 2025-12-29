import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import logoImg from "../assets/AllbirdsLogo.jpg";

const HeaderWrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1px solid #ececec;

`;

const TopBar = styled.div`
  height: 40px;
  background: #1f1f1f;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.2px;
`;

const MainBar = styled.div`
  height: 68px;
  display: grid;
  grid-template-columns: 180px 1fr 160px;
  align-items: center;
  padding: 0 28px;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  img {
    height: 40px;
    width: auto;
    display: block;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 44px;
  font-size: 14px;
  color: #111;
`;

const NavItem = styled.div`
  position: relative;
  padding: 12px 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  opacity: ${(p) => (p.$active ? 1 : 0.85)};
  &:hover {
    opacity: 1;
  }
`;

const IconRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  align-items: center;
`;

const IconBtn = styled.button`
  border: 0;
  background: transparent;
  padding: 6px;
  cursor: pointer;
  position: relative;

  svg {
    width: 18px;
    height: 18px;
    stroke: #111;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #111;
  color: #fff;
  font-size: 11px;
  border-radius: 999px;
  display: grid;
  place-items: center;
`;

// 실제 사이트처럼 "풀폭" 드롭다운(중앙에 떠있는 모달 느낌 X)
const Mega = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 108px; /* TopBar 40 + MainBar 68 */
  background: #fff;
  border-top: 1px solid #efefef;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.08);
  padding: 62px 72px;
  display: ${(p) => (p.$open ? "block" : "none")};
`;

const MegaInner = styled.div`
  max-width: 1400px;
  margin: 0;
  padding: 0 28px;

  display: grid;
  grid-template-columns: 300px 340px 220px;
  column-gap: 10px;
  align-items: start;
`;

const MegaCol = styled.div`
  min-width: 0;
`;

const MegaTitle = styled.div`
  font-size: 34px;
  font-weight: 650;
  letter-spacing: -1px;
  margin-bottom: 22px;

  display: inline-flex;
  align-items: center;
  position: relative;

  .dashWrap {
    width: 0px;
    overflow: hidden;
    display: inline-block;

    transition: width 260ms cubic-bezier(0.2, 0.9, 0.2, 1);
    will-change: width;
  }

  .dash {
    display: inline-block;
    transform: translateX(-100%); /* 기본: 안 보임 */
    transition: transform 260ms cubic-bezier(0.2, 0.9, 0.2, 1);
    will-change: transform;
  }

  &:hover .dashWrap {
    width: 26px;
    margin-right: 10px;
  }
  &:hover .dash {
    transform: translateX(0);
  }
`;

const MegaTitleInner = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  transform: translateX(-100%);
  transition: transform 280ms cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;

  ${MegaTitle}:hover & {
    transform: translateX(0);
  }
`;

const MegaList = styled.div`
  --rail: 2px; /* 세로 라인 두께 */
  --pad: 22px; /* 라인과 텍스트 간격 */

  display: grid;
  gap: 12px;

  border-left: var(--rail) solid #2b2b2b;
  padding-left: var(--pad);
`;

const MegaItem = styled(Link)`
  text-decoration: none;
  color: #111;
  font-size: 14px;
  opacity: 0.82;
  width: fit-content;

  &:hover {
    opacity: 1;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" strokeWidth="1.6" />
      <path d="M20 20L16.7 16.7" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" strokeWidth="1.6" />
      <path
        d="M4 20c1.8-3 4.4-4.5 8-4.5S18.2 17 20 20"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 8h12l-1 13H7L6 8Z" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [openKey, setOpenKey] = useState(null);
  const [me, setMe] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, openCart, fetchCart } = useCart();

  useEffect(() => {
    let active = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!active) {
          return;
        }
        if (!res.ok) {
          setMe(null);
          return;
        }
        const data = await res.json();
        if (active) {
          setMe(data.user || null);
        }
      } catch (err) {
        if (active) {
          setMe(null);
        }
      }
    }
    fetchMe();
    return () => {
      active = false;
    };
  }, [location.pathname]);

  const handleAccountClick = () => {
    if (!me) {
      navigate("/login");
      return;
    }
    if (me.role === "admin") {
      navigate("/admin");
      return;
    }
    navigate("/my/profile");
  };

  const handleCartClick = () => {
    fetchCart();
    openCart();
  };

  const navItems = useMemo(
    () => [
      { key: "holiday", label: "홀리데이", to: "/" },
      { key: "men", label: "남성", to: "/men" },
      { key: "women", label: "여성", to: "/women" },
      { key: "stores", label: "매장 위치", to: "/stores" },
      {
        key: "sustain",
        label: "지속 가능성",
        to: "/sustainability",
        mega: true,
      },
    ],
    []
  );

  return (
    <HeaderWrap
      onMouseLeave={() => setOpenKey(null)}
      aria-label="Allbirds header"
    >
      <TopBar>세상에서 가장 편한 신발, 올버즈</TopBar>

      <MainBar>
        <Logo to="/">
          <img src={logoImg} alt="Allbirds" />
        </Logo>

        <Nav>
          {navItems.map((it) => (
            <NavItem
              key={it.key}
              onMouseEnter={() => it.mega && setOpenKey(it.key)}
            >
              <NavLink to={it.to} $active={location.pathname === it.to}>
                {it.label}
              </NavLink>

              {it.key === "sustain" && (
                <Mega $open={openKey === "sustain"}>
                  <MegaInner>
                    <MegaCol>
                      <MegaTitle>
                        <MegaTitle>
                          <span className="dashWrap">
                            <span className="dash">—</span>
                          </span>
                          <span className="label">올버즈</span>
                        </MegaTitle>
                      </MegaTitle>

                      <MegaList>
                        <MegaItem to="/brand-story">브랜드 스토리</MegaItem>
                        <MegaItem to="/sustainability">지속 가능성</MegaItem>
                        <MegaItem to="/materials">소재</MegaItem>
                        <MegaItem to="/renewals">수선</MegaItem>
                      </MegaList>
                    </MegaCol>

                    <MegaCol>
                      <MegaTitle>
                        <MegaTitle>
                          <span className="dashWrap">
                            <span className="dash">—</span>
                          </span>
                          <span className="label">스토리</span>
                        </MegaTitle>
                      </MegaTitle>

                      <MegaList>
                        <MegaItem to="/moonshot">MO.ONSHOT</MegaItem>
                        <MegaItem to="/allmembers">올멤버스</MegaItem>
                        <MegaItem to="/ambassador">올버즈 앰배서더</MegaItem>
                        <MegaItem to="/rerun">ReRun</MegaItem>
                        <MegaItem to="/shoe-care">신발 관리 방법</MegaItem>
                      </MegaList>
                    </MegaCol>

                    <MegaCol>
                      <MegaTitle>
                        <MegaTitle>
                          <span className="dashWrap">
                            <span className="dash">—</span>
                          </span>
                          <span className="label">소식</span>
                        </MegaTitle>
                      </MegaTitle>

                      <MegaList>
                        <MegaItem to="/campaign">캠페인</MegaItem>
                        <MegaItem to="/news">뉴스</MegaItem>
                      </MegaList>
                    </MegaCol>
                  </MegaInner>
                </Mega>
              )}
            </NavItem>
          ))}
        </Nav>

        <IconRow>
          <IconBtn aria-label="Search">
            <SearchIcon />
          </IconBtn>
          <IconBtn type="button" onClick={handleAccountClick} aria-label="Account">
            <UserIcon />
          </IconBtn>
          <IconBtn aria-label="Cart" type="button" onClick={handleCartClick}>
            <BagIcon />
            {cartCount > 0 && (
              <CartBadge>{cartCount > 99 ? "99+" : cartCount}</CartBadge>
            )}
          </IconBtn>
        </IconRow>
      </MainBar>
    </HeaderWrap>
  );
}
