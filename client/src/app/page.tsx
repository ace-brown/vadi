import "@/components/blog/EmblaCarousel";
import Travel from "@/components/travel/Travel";
import MobileTariffCards from "@/components/mobile/MobileTariffCards";
import Search from "@/components/search/Search";

// const OPTIONS: EmblaOptionsType = { align: "start" };
// const OPTIONS: EmblaOptionsType = { loop: true };
// const SLIDE_COUNT = 2;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function Home() {
  return (
    <div className="mb-8 mx-auto">
      <Search />
      <Travel />
      <MobileTariffCards />
      {/* <WhyUs /> */}
      {/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
    </div>
  );
}
