import Hero from "@/components/hero";
import "@/components/blog/EmblaCarousel";
import Travel from "@/components/travel/Travel";
import MobileTariffCards from "@/components/mobile/MobileTariffCards";

// const OPTIONS: EmblaOptionsType = { align: "start" };
// const OPTIONS: EmblaOptionsType = { loop: true };
// const SLIDE_COUNT = 2;
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function Home() {
  return (
    <div className="mb-8 mx-auto">
      <Hero />
      <Travel />
      <MobileTariffCards />
      {/* <WhyUs /> */}
      {/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
    </div>
  );
}
