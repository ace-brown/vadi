import AgricultureDetailsSelectPage from "@/pages/agriculture/AgricultureDetailsSelect";
import AnimalBasedProductsPage from "@/pages/agriculture/AnimalBasedProducts";
import GardenSupplies from "@/pages/agriculture/GardenSupplies";

export const agricultureRoutes = [
  {
    path: "agriculture-details-select",
    element: <AgricultureDetailsSelectPage />,
  },
  { path: "garden-supplies", element: <GardenSupplies /> },
  { path: "animal-based-products", element: <AnimalBasedProductsPage /> },
];
