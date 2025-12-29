import styled from "styled-components";
import HeroSection from "../components/HeroSection";
import RealTimePopularSlider from "../components/RealTimePopularSlider";
import NewProductsCarousel from "../components/NewProductsCarousel";
import RecommendedProducts from "../components/RecommendedProducts";
import MaterialsSection from "../components/MaterialsSection";
import NewsletterSection from "../components/NewsletterSection";

const Page = styled.main`
  background: #f6f5f3;
`;

const WhiteBand = styled.section`
  background: #fff;
`;

const Spacer = styled.div`
  height: 34px;
`;

export default function Home() {
  return (
    <Page>
      <WhiteBand>
        <HeroSection />
      </WhiteBand>

      <WhiteBand>
        <RealTimePopularSlider />
      </WhiteBand>

      <Spacer />

      <NewProductsCarousel />
      <RecommendedProducts />
      <MaterialsSection />
      <NewsletterSection />
    </Page>
  );
}
