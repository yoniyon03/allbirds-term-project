import { useState } from "react";
import styled from "styled-components";

import newsLetter1 from "../assets/newsLetter1.jpg";
import newsLetter2 from "../assets/newsLetter2.jpg";
import newsLetter3 from "../assets/newsLetter3.jpg";

const Section = styled.section`
  background: #f6f5f3;
  padding: 72px 0;
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 28px;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin: 0;
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -1px;
  line-height: 1.2;
`;

const Sub = styled.div`
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  opacity: 0.7;
`;

const Form = styled.form`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 360px;
  height: 44px;
  border: 1px solid #d7d7d7;
  border-radius: 2px;
  padding: 0 14px;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #777;
  }

  &:focus {
    border-color: #111;
  }
`;

const Button = styled.button`
  height: 44px;
  width: 72px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  border-radius: 2px;
  font-size: 13px;
  cursor: pointer;
`;

const Notice = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 11px;
  opacity: 0.6;
  line-height: 1.5;

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const Grid = styled.div`
  margin-top: 54px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 44px;

  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div``;

const Img = styled.div`
  height: 240px;
  background: #f2f2f2;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Head = styled.div`
  margin-top: 16px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.4px;
`;

const Desc = styled.div`
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 1.75;
  opacity: 0.72;
`;

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const cards = [
    {
      id: 1,
      img: newsLetter1,
      head: "매일 경험하는 편안함",
      desc: "올버드는 마치 구름 위를 걷는 듯한 가벼움과, 바람처럼 자유로운 탄력을 선사합니다. 놀라운 편안함은 긴 여정도 짧은 산책처럼 느껴집니다.",
    },
    {
      id: 2,
      img: newsLetter2,
      head: "지속 가능한 발걸음",
      desc: "소재를 고르는 순간부터 신발이 당신에게 닿는 그 순간까지 지구에 남기는 흔적을 줄이려합니다. 탄소 발자국을 제로에 가깝게 줄이려는 노력을 동참해주세요.",
    },
    {
      id: 3,
      img: newsLetter3,
      head: "지구에서 온 소재",
      desc: "올버즈는 가능한 모든 곳에서 석유 기반 합성소재를 천연 대안으로 대체합니다. 울, 나무, 사탕수수 같은 자연 소재는 부드럽고 통기성이 좋습니다.",
    },
  ];

  return (
    <Section>
      <Inner>
        <Content>
          <Title>올버즈 뉴스레터 구독</Title>
          <Sub>최신 신제품 소식과 혜택을 가장 먼저 받아보세요.</Sub>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
          >
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">구독</Button>
          </Form>

          <Notice>
            구독 시 마케팅 이메일 수신에 동의하게 됩니다. 자세한 내용은{" "}
            <a href="/privacy">개인정보 처리방침</a> 및{" "}
            <a href="/terms">이용약관</a>을 확인해 주세요.
          </Notice>
        </Content>

        <Grid>
          {cards.map((c) => (
            <Card key={c.id}>
              <Img>
                <img src={c.img} alt={c.head} />
              </Img>
              <Head>{c.head}</Head>
              <Desc>{c.desc}</Desc>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
