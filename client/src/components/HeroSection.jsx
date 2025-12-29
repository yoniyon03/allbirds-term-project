import styled from "styled-components";
import { Link } from "react-router-dom";
import homeImg from "../assets/homeImg.jpg";

const Hero = styled.section`
  width: 100%;
`;

const HeroInner = styled.div`
  width: 100%;
`;

const HeroImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 640px;
  overflow: hidden;
  background: #111;
`;

const HeroImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const CtaWrap = styled.div`
  position: absolute;
  right: 72px;
  bottom: 86px;
  display: grid;
  gap: 14px;
  text-align: right;

  @media (max-width: 900px) {
    right: 24px;
    bottom: 30px;
  }
`;

const HeroTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -1px;

  @media (max-width: 900px) {
    font-size: 30px;
  }
`;

const HeroSub = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
`;

const BtnRow = styled.div`
  display: inline-flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const CtaBtn = styled(Link)`
  text-decoration: none;
  border: 1px solid #fff;
  background: #fff;
  color: #111;
  height: 42px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.2px;

  &:hover {
    opacity: 0.92;
  }
`;

export default function HeroSection() {
  return (
    <Hero>
      <HeroInner>
        <HeroImgWrap>
          <HeroImg src={homeImg} alt="Home hero" />
          <CtaWrap>
            <HeroTitle>홀리데이 컬렉션</HeroTitle>
            <HeroSub>소중한 사람에게 전하는 마음</HeroSub>
            <BtnRow>
              <CtaBtn to="/products">남성 세일</CtaBtn>
              <CtaBtn to="/sale/women">여성 세일</CtaBtn>
            </BtnRow>
          </CtaWrap>
        </HeroImgWrap>
      </HeroInner>
    </Hero>
  );
}
