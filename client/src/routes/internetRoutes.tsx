import HomeTariffPage from "@/pages/internet/HomeTariff";
import InternetDetailsSelectPage from "@/pages/internet/InternetDetailsSelect";
import MobileTariffPage from "@/pages/internet/MobileTariff";

export const internetRoutes = [
  {
    path: "internet-details-select",
    element: <InternetDetailsSelectPage />,
  },
  { path: "mobile-tariff", element: <MobileTariffPage /> },
  { path: "home-tariff", element: <HomeTariffPage /> },
];
