import BarberDetailsSelectPage from "@/pages/aesthetic/AestheticDetailsSelect";
import MenSalonPage from "@/pages/aesthetic/MenSalon";
import WomenSalonPage from "@/pages/aesthetic/WomenSalon";

export const aestheticRoutes = [
  { path: "aesthetic-details-select", element: <BarberDetailsSelectPage /> },
  { path: "men-salon", element: <MenSalonPage /> },
  { path: "women-salon", element: <WomenSalonPage /> },
];
