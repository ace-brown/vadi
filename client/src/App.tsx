import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "@/pages/Home";
import RootLayout from "@/pages/Root";
import ErrorPage from "@/pages/Error";
import TerminalPage from "@/pages/Terminal";
import MobileTariffComparePage from "@/pages/internet/mobile-tariff/MobileTariffCompare";
import BarberDetailsSelectPage from "./pages/barber/BarberDetailsSelect";
import BarberComparePage from "./pages/barber/BarberCompare";
import HomeTariffComparePage from "./pages/internet/home-tariff/HomeTariffCompare";
import InternetDetailsSelectPage from "./pages/internet/InternetDetailsSelect";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage /> },

        { path: "/terminal", element: <TerminalPage /> },
        {
          path: "/mobile-tariff-compare",
          element: <MobileTariffComparePage />,
        },
        {
          path: "/internet-details-select",
          element: <InternetDetailsSelectPage />,
        },
        {
          path: "/home-tariff-compare",
          element: <HomeTariffComparePage />,
        },
        {
          path: "/barber-details-select",
          element: <BarberDetailsSelectPage />,
        },
        { path: "/barber-compare", element: <BarberComparePage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
