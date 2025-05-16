import AutoRepairPage from "@/pages/vehicle/AutoRepair";
import MotorcycleRepairPage from "@/pages/vehicle/MotorcycleRepair";
import VehicleDetailsSelectPage from "@/pages/vehicle/VehicleDetailsSelect";

export const vehicleRoutes = [
  { path: "vehicle-details-select", element: <VehicleDetailsSelectPage /> },
  { path: "auto-repair", element: <AutoRepairPage /> },
  { path: "motorcycle-repair", element: <MotorcycleRepairPage /> },
];
