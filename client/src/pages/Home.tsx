import MobileTariffCards from "@/components/mobile/MobileTariffCards";
import Search from "@/components/search/Search";
import Travel from "@/components/travel/Travel";

export default function HomePage() {
  return (
    <div className="w-[80%] mx-auto">
      <Search />
      <Travel />
      <MobileTariffCards />
    </div>
  );
}
