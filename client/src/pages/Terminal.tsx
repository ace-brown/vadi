import { useLocation } from "react-router-dom";
import InternetDetailsSelectPage from "./internet/InternetDetailsSelect";
import AestheticDetailsSelectPage from "./aesthetic/AestheticDetailsSelect";
import VehicleDetailsSelectPage from "./vehicle/VehicleDetailsSelect";

export default function TerminalPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  // const query = searchParams.get("query") ?? "";

  // const { type } = useParams();
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const query = searchParams.get("query") || "";

  function renderComponent() {
    switch (type) {
      case "internet":
        return <InternetDetailsSelectPage />;
      case "aesthetic":
        return <AestheticDetailsSelectPage />;
      case "vehicle":
        return <VehicleDetailsSelectPage />;
      default:
        return <p>نوع مشخص نشده است.</p>;
    }
  }

  return (
    <div>{renderComponent()}</div>
    // <div>{results.length > 0 ? renderComponent() : <p>No data found.</p>}</div>
  );
}
