import DomesticPage from "@/pages/travel/Domestic";
import TravelDetailsSelectPage from "@/pages/travel/TravelDetailsSelect";

export const travelRoutes = [
  {
    path: "travel-details-select",
    element: <TravelDetailsSelectPage />,
  },
  {
    path: "domestic",
    element: <DomesticPage />,
  },
];
