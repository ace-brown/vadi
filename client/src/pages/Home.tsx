import CategoryGrid from "@/components/landing-page/CategoryGrid";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Search from "@/components/search/Search";

export default function HomePage() {
  return (
    <div className="w-[80%] mx-auto">
      <Search />
      <Hero />
      <HowItWorks />
      <CategoryGrid />
      {/* <Travel /> */}
      {/* <MobileTariffCards /> */}
    </div>
  );
}
