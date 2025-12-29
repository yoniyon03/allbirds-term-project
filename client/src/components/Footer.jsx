import styled from "styled-components";

const Wrap = styled.footer`
  background: #1f1f1f;
  color: #fff;
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 78px 28px 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 64px;
  align-items: start;
`;

const BigLinks = styled.div`
  display: grid;
  gap: 18px;
  font-size: 44px;
  letter-spacing: -1.2px;
  font-weight: 500;
`;

const BigLink = styled.a`
  color: #fff;
  text-decoration: none;
  width: fit-content;
  &:hover {
    opacity: 0.92;
  }
`;

const Right = styled.div``;

const RightTitle = styled.div`
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.8px;
  margin-bottom: 22px;
`;

const SupportList = styled.div`
  display: grid;
  gap: 12px;
  font-size: 13px;
  opacity: 0.9;
`;

const SupportItem = styled.a`
  color: #fff;
  text-decoration: none;
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`;

const Mid = styled.div`
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 64px;
  align-items: end;
`;

const Follow = styled.div`
  font-size: 12px;
  line-height: 1.8;
  opacity: 0.9;
`;

const Socials = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 14px;
  align-items: center;
`;

const Social = styled.a`
  width: 22px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 3px;
  display: grid;
  place-items: center;
  color: #fff;
  text-decoration: none;
  font-size: 11px;
  opacity: 0.9;
`;

const Corp = styled.div`
  justify-self: end;
  text-align: right;
  opacity: 0.9;
  font-size: 11px;
  line-height: 1.7;
`;

const BMark = styled.div`
  width: 86px;
  height: 86px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin-left: auto;
  margin-bottom: 18px;
  font-weight: 700;
`;

const Bottom = styled.div`
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 11px;
  opacity: 0.85;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const SmallLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const SmallLink = styled.a`
  color: #fff;
  text-decoration: none;
  opacity: 0.92;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Footer() {
  return (
    <Wrap>
      <Inner>
        <Grid>
          <BigLinks>
            <BigLink href="#">올멤버스 가입하기</BigLink>
            <BigLink href="#">오프라인 매장 찾기</BigLink>
            <BigLink href="#">카카오 채널 추가하기</BigLink>
            <BigLink href="#">올버즈 브랜드 스토리</BigLink>
          </BigLinks>

          <Right>
            <RightTitle>올버즈 지원</RightTitle>
            <SupportList>
              <SupportItem href="#">교환 및 반품</SupportItem>
              <SupportItem href="#">수선</SupportItem>
              <SupportItem href="#">문의하기</SupportItem>
              <SupportItem href="#">FAQ</SupportItem>
              <SupportItem href="#">채용</SupportItem>
            </SupportList>
          </Right>
        </Grid>

        <Mid>
          <Follow>
            <b>ALLBIRDS를 팔로우 하세요!</b>
            <br />
            최신 정보나 Allbirds 상품의 스냅샷 등
            <br />을 보실 수 있습니다. 오! 물론 귀여운 양<br />도 보실 수 있죠.
            #weareallbirds #올버즈
            <Socials aria-label="social links">
              <Social href="#" aria-label="instagram">
                ◎
              </Social>
              <Social href="#" aria-label="facebook">
                f
              </Social>
            </Socials>
          </Follow>

          <Corp>
            <BMark>
              Certified
              <br />B
            </BMark>
            (주)이에프지 대표: 박세원 | 서울특별시 강남구 강남대로 160길 45
            <br />
            통신판매업신고번호 2023-서울강남-04461 | 등록번호 146-81-03205
            <br />
            전화번호 070-4138-0128(수신자 부담) | E-mail help@efg.co.kr
          </Corp>
        </Mid>

        <Bottom>
          <div>© 2025 EFG.CO.All Rights Reserved.</div>
          <SmallLinks>
            <SmallLink href="#">이용약관</SmallLink>
            <SmallLink href="#">개인정보 처리방침</SmallLink>
          </SmallLinks>
        </Bottom>
      </Inner>
    </Wrap>
  );
}
