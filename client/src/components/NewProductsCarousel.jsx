import { useMemo, useRef, useEffect, useState } from "react";
import styled from "styled-components";

import newProduct1 from "../assets/newProduct1.jpg";
import newProduct2 from "../assets/newProduct2.jpg";
import newProduct3 from "../assets/newProduct3.jpg";
import newProduct4 from "../assets/newProduct4.jpg";
import newProduct5 from "../assets/newProduct5.jpg";
import newProduct6 from "../assets/newProduct6.jpg";
import newProduct7 from "../assets/newProduct7.jpg";
import newProduct8 from "../assets/newProduct8.jpg";

const Section = styled.section`
  background: #f6f5f3;
  padding: 60px 0 30px;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
`;

const Title = styled.h2`
  margin: 0 0 22px;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -1px;
`;

const FullBleed = styled.div`
  width: 100vw;
  margin-left: calc(50% - 50vw);
`;

const Viewport = styled.div`
  overflow: hidden;

  padding-left: calc((100vw - 1200px) / 2 + 28px);
  padding-right: calc((100vw - 1200px) / 2 + 28px);

  @media (max-width: 1200px) {
    padding-left: 28px;
    padding-right: 28px;
  }
`;

const Track = styled.div`
  display: flex;
  gap: 26px;
  transform: translateX(${(p) => -p.$offset}px);
  transition: transform 260ms ease;
  will-change: transform;
`;

const Card = styled.div`
  width: 300px;
  flex: 0 0 auto;
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
`;

const Img = styled.div`
  height: 280px;
  background: #e9e6de;
  display: grid;
  place-items: center;

  img {
    width: 86%;
    height: auto;
    display: block;
  }
`;

const Meta = styled.div`
  padding: 18px 18px 20px;
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.2px;
`;

const Sub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.75;
`;

const Price = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 650;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 34px;
  padding: 26px 0 0;
`;

const Dot = styled.button`
  width: 66px;
  height: 2px;
  border: 0;
  background: ${(p) => (p.$active ? "#111" : "#ddd")};
  cursor: pointer;
`;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function NewProductsCarousel() {
  const items = useMemo(
    () => [
      {
        id: 1,
        name: "올버즈 슬리퍼 플러프",
        sub: "내추럴 화이트 (내추럴 화이트)",
        price: "₩80,000",
        img: newProduct1,
      },
      {
        id: 2,
        name: "올버즈 슬리퍼 플러프",
        sub: "내추럴 블랙 (내추럴 블랙)",
        price: "₩80,000",
        img: newProduct2,
      },
      {
        id: 3,
        name: "올버즈 슬리퍼",
        sub: "내추럴 블랙 (내추럴 블랙)",
        price: "₩80,000",
        img: newProduct3,
      },
      {
        id: 4,
        name: "여성 울 러너 NZ 미드 위터프루프",
        sub: "워터드 브라운 (워터드 브라운)",
        price: "₩220,000",
        img: newProduct4,
      },
      {
        id: 5,
        name: "여성 울 러너 NZ 미드 위터프루프",
        sub: "스톤 크림 (스토니 크림)",
        price: "₩220,000",
        img: newProduct5,
      },
      {
        id: 6,
        name: "여성 울 러너 NZ 미드 위터프루프",
        sub: "내추럴 블랙 (내추럴 화이트)",
        price: "₩220,000",
        img: newProduct6,
      },
      {
        id: 7,
        name: "여성 울 러너 NZ 미드 위터프루프",
        sub: "내추럴 블랙 (내추럴 블랙)",
        price: "₩220,000",
        img: newProduct7,
      },
      {
        id: 8,
        name: "여성 울 러너 NZ 미드 위터프루프",
        sub: "다크 그레이 (라이트 그레이)",
        price: "₩220,000",
        img: newProduct8,
      },
    ],
    []
  );

  const cardW = 300;
  const gap = 26;

  const viewportRef = useRef(null);
  const [viewportW, setViewportW] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;

    const ro = new ResizeObserver(() => {
      const styles = getComputedStyle(el);
      const pl = parseFloat(styles.paddingLeft) || 0;
      const pr = parseFloat(styles.paddingRight) || 0;
      setViewportW(el.clientWidth - pl - pr);
    });

    ro.observe(el);

    // 초기 1회
    const styles = getComputedStyle(el);
    const pl = parseFloat(styles.paddingLeft) || 0;
    const pr = parseFloat(styles.paddingRight) || 0;
    setViewportW(el.clientWidth - pl - pr);

    return () => ro.disconnect();
  }, []);

  const perView = Math.max(1, Math.floor((viewportW + gap) / (cardW + gap)));
  const pageCount = Math.max(1, items.length - perView + 1);

  useEffect(() => {
    setIndex((i) => clamp(i, 0, pageCount - 1));
  }, [pageCount]);

  const step = cardW + gap;
  const trackW = items.length * cardW + (items.length - 1) * gap;
  const maxOffset = Math.max(0, trackW - viewportW);
  const offset = clamp(index * step, 0, maxOffset);

  return (
    <Section>
      <Inner>
        <Title>신제품</Title>
      </Inner>

      <FullBleed>
        <Viewport ref={viewportRef}>
          <Track $offset={offset}>
            {items.map((it) => (
              <Card key={it.id}>
                <Img>
                  <img
                    src={it.img}
                    alt={it.name}
                    onError={(e) =>
                      (e.currentTarget.src = "/products/placeholder.jpg")
                    }
                  />
                </Img>
                <Meta>
                  <Name>{it.name}</Name>
                  <Sub>{it.sub}</Sub>
                  <Price>{it.price}</Price>
                </Meta>
              </Card>
            ))}
          </Track>
        </Viewport>

        <Dots aria-label="new products pagination">
          {Array.from({ length: pageCount }).map((_, i) => (
            <Dot
              key={i}
              $active={i === index}
              onClick={() => setIndex(i)}
              aria-label={`slide ${i + 1}`}
            />
          ))}
        </Dots>
      </FullBleed>
    </Section>
  );
}
