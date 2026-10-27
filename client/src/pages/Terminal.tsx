import { useLocation } from "react-router-dom";
import InternetDetailsSelectPage from "./internet/InternetDetailsSelect";
import AestheticDetailsSelectPage from "./aesthetic/AestheticDetailsSelect";
import VehicleDetailsSelectPage from "./vehicle/VehicleDetailsSelect";
import TravelDetailsSelectPage from "./travel/TravelDetailsSelect";
import ApplianceRepairPage from "./electronics/ApplianceRepair";
import PcMobileDetailsSelectPage from "./pc-mobile/PcMobileDetailsSelect";
import AgricultureDetailsSelectPage from "./agriculture/AgricultureDetailsSelect";
import DentalPage from "./healthcare/Dental";
import EducationDetailsSelectPage from "./education/EducationDetailsSelect";

export default function TerminalPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  // const query = searchParams.get("query") ?? "";

  // const { type } = useParams();
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const query = searchParams.get("query") || "";

  console.log("TerminalPage loaded with type:", type);

  function renderComponent() {
    switch (type) {
      case "internet":
        return <InternetDetailsSelectPage />;
      case "aesthetic":
        return <AestheticDetailsSelectPage />;
      case "vehicle":
        return <VehicleDetailsSelectPage />;
      case "travel":
        return <TravelDetailsSelectPage />;
      case "appliance":
        return <ApplianceRepairPage />;
      case "PM":
        return <PcMobileDetailsSelectPage />;
      case "agriculture":
        return <AgricultureDetailsSelectPage />;
      case "healthcare":
        return <DentalPage />;
      case "education":
        return <EducationDetailsSelectPage />;
      default:
        return <p>No type specified.</p>;
    }
  }

  return (
    <div>{renderComponent()}</div>
    // <div>{results.length > 0 ? renderComponent() : <p>No data found.</p>}</div>
  );
}
