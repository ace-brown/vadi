import { useLocation } from "react-router-dom";
import BarberDetailsSelectPage from "./barber/BarberDetailsSelect";
import InternetDetailsSelectPage from "./internet/InternetDetailsSelect";
import MobileTariffComparePage from "./internet/mobile-tariff/MobileTariffCompare";

export default function TerminalPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const query = searchParams.get("query") ?? "";
  // const { type } = useParams();
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const query = searchParams.get("query") || "";

  function renderComponent() {
    switch (type) {
      case "mobileTariff":
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
    <div>{renderComponent()}</div>
    // <div>{results.length > 0 ? renderComponent() : <p>No data found.</p>}</div>
  );
}
