import ComputerRepairPage from "@/pages/pc-mobile/ComputerRepair";
import MobileRepairPage from "@/pages/pc-mobile/MobileRepair";
import PcMobileDetailsSelectPage from "@/pages/pc-mobile/PcMobileDetailsSelect";

export const PMRoutes = [
  { path: "pc-mobile-details-select", element: <PcMobileDetailsSelectPage /> },
  { path: "mobile-repair", element: <MobileRepairPage /> },
  { path: "computer-repair", element: <ComputerRepairPage /> },
];
