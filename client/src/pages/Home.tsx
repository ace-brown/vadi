import MobileTariffCards from "@/components/mobile/MobileTariffCards";
import Search from "@/components/search/Search";
import Travel from "@/components/travel/Travel";

export default function HomePage() {
  return (
    <>
      <Search />
      <Travel />
      <MobileTariffCards />
    </>
  );
}
