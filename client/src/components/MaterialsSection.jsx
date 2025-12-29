import styled from "styled-components";

import productMaterial1 from "../assets/productMaterial1.jpg";
import productMaterial2 from "../assets/productMaterial2.jpg";
import productMaterial3 from "../assets/productMaterial3.jpg";

const Section = styled.section`
  background: #f6f5f3;
  padding: 70px 0 60px;
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 28px;
`;

const Title = styled.h2`
  margin: 0 0 38px;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -1px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 46px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
`;

const Img = styled.div`
  height: 280px;
  background: #e9e6de;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Body = styled.div`
  padding: 20px 24px 26px;
`;

const Small = styled.div`
  font-size: 12px;
  opacity: 0.7;
  letter-spacing: -0.2px;
`;

const Head = styled.div`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.4px;
`;

const Btn = styled.button`
  margin-top: 18px;
  width: 100%;
  height: 42px;
  border-radius: 2px;
  border: 1px solid #222;
  background: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`;

export default function MaterialsSection() {
  const cards = [
    {
      id: 1,
      small: "ZQ 메리노 울",
      head: "최상급 울 소재",
      img: productMaterial1,
    },
    {
      id: 2,
      small: "유칼립투스나무",
      head: "실크처럼 매끄러운 촉감",
      img: productMaterial2,
    },
    {
      id: 3,
      small: "사탕수수",
      head: "부드러운 SweetFoam®의 주 소재",
      img: productMaterial3,
    },
  ];

  return (
    <Section>
      <Inner>
        <Title>우리가 사용하는 소재</Title>

        <Grid>
          {cards.map((c) => (
            <Card key={c.id}>
              <Img>
                <img src={c.img} alt={c.head} />
              </Img>
              <Body>
                <Small>{c.small}</Small>
                <Head>{c.head}</Head>
                <Btn>더 알아보기</Btn>
              </Body>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
