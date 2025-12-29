import styled from "styled-components";

import recommendProduct1 from "../assets/recommendProduct1.jpg";
import recommendProduct2 from "../assets/recommendProduct2.jpg";
import recommendProduct3 from "../assets/recommendProduct3.jpg";

const Section = styled.section`
  background: #f6f5f3;
  padding: 56px 0 80px;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;
`;

const Title = styled.h2`
  margin: 0 auto 26px;
  max-width: 1080px;
  font-size: 34px;
  font-weight: 500;
  letter-spacing: -1px;
  text-align: left;
`;

const Grid = styled.div`
  max-width: 1080px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: repeat(3, 340px);
  justify-content: center;
  gap: 48px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
`;

const Img = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #3b0d0d;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }
`;

const Body = styled.div`
  padding: 18px 22px 22px;
  text-align: center;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 650;
  letter-spacing: -0.4px;
`;

const Desc = styled.div`
  margin-top: 8px;
  font-size: 12.5px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.58);
`;

const BtnStack = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 18px;
`;

const Btn = styled.button`
  width: 100%;
  height: 40px;
  border-radius: 2px;
  border: 1px solid #222;
  background: #fff;
  font-size: 12.5px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`;

export default function RecommendedProducts() {
  const cards = [
    {
      id: 1,
      name: "Wool Runner NZ",
      desc: "오리지널 메리노 울 슈즈",
      img: recommendProduct1,
    },
    {
      id: 2,
      name: "Wool Cruiser Waterproof",
      desc: "완벽 방수로 24시간 보송하게",
      img: recommendProduct2,
    },
    {
      id: 3,
      name: "Wool Cruiser Slip-on",
      desc: "신고 벗기 편한 슬립온",
      img: recommendProduct3,
    },
  ];

  return (
    <Section>
      <Inner>
        <Title>추천 제품</Title>
        <Grid>
          {cards.map((c) => (
            <Card key={c.id}>
              <Img>
                <img
                  src={c.img}
                  alt={c.name}
                  onError={(e) =>
                    (e.currentTarget.src = "/products/placeholder.jpg")
                  }
                />
              </Img>
              <Body>
                <Name>{c.name}</Name>
                <Desc>{c.desc}</Desc>
                <BtnStack>
                  <Btn>남성</Btn>
                  <Btn>여성</Btn>
                </BtnStack>
              </Body>
            </Card>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
