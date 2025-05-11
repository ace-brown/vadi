import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import HomePage from "@/pages/Home";
import RootLayout from "@/pages/Root";
import ErrorPage from "@/pages/Error";
import TerminalPage from "@/pages/Terminal";
import LoginPage from "@/pages/Login";
import SignupPage from "@/pages/Signup";
import MobileTariffComparePage from "@/pages/internet/mobile-tariff/MobileTariffCompare";
import BarberDetailsSelectPage from "@/pages/barber/BarberDetailsSelect";
import BarberComparePage from "@/pages/barber/women/WomenBarberCompare";
import HomeTariffComparePage from "@/pages/internet/home-tariff/HomeTariffCompare";
import InternetDetailsSelectPage from "@/pages/internet/InternetDetailsSelect";
import AuthLayoutPage from "@/pages/dashboard/AuthLayout";
import SettingsPage from "@/pages/dashboard/Settings";
import MenBarberComparePage from "@/pages/barber/men/MenBarberCompare";
import WomenBarberComparePage from "@/pages/barber/women/WomenBarberCompare";

function App() {
  const auth = useContext(AuthContext);
  const router = createBrowserRouter([
    // ---------------- Public Routes ----------------
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        // ---------- Static Pages ----------
        { index: true, element: <HomePage /> },
        { path: "terminal", element: <TerminalPage /> },

        // ---------- Internet Comparison ----------
        {
          path: "internet-details-select",
          element: <InternetDetailsSelectPage />,
        },
        { path: "mobile-tariff-compare", element: <MobileTariffComparePage /> },
        { path: "home-tariff-compare", element: <HomeTariffComparePage /> },

        // ---------- Barber Comparison ----------
        { path: "barber-details-select", element: <BarberDetailsSelectPage /> },
        { path: "men-barber-compare", element: <MenBarberComparePage /> },
        { path: "women-barber-compare", element: <WomenBarberComparePage /> },

        // ---------- Auth ----------
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },

        // ---------- Dashboard (Private) ----------
        {
          path: "/dashboard",
          element: auth.isLoggedIn ? <AuthLayoutPage /> : <Navigate to="/" />,
          children: [{ index: true, element: <SettingsPage /> }],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
