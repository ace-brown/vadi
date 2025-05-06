import { useLocation } from "react-router-dom";
import MobileDetailsSelect from "./mobile-tariff/MobileTariffDetailsSelect";
import BarberDetailsSelectPage from "./barber/BarberDetailsSelect";
import InternetDetailsSelectPage from "./internet/InternetDetailsSelect";
import MobileTariffComparePage from "./mobile-tariff/MobileTariffCompare";

export default function TerminalPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const resultsParams = searchParams.get("results");
  const results = resultsParams ? JSON.parse(resultsParams) : [];

  function renderComponent() {
    switch (type) {
      case "mobile":
        return <MobileTariffComparePage />;
      case "hair":
        return <BarberDetailsSelectPage />;
      case "internet":
        return <InternetDetailsSelectPage />;
      default:
        return <p>نوع مشخص نشده است.</p>;
    }
  }

  return (
    <div>{results.length > 0 ? renderComponent() : <p>No data found.</p>}</div>
  );
}
