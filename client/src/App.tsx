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
import MobileTariffComparePage from "@/pages/internet/mobile-tariff/MobileTariffCompare";
import BarberDetailsSelectPage from "./pages/barber/BarberDetailsSelect";
import BarberComparePage from "./pages/barber/BarberCompare";
import HomeTariffComparePage from "./pages/internet/home-tariff/HomeTariffCompare";
import InternetDetailsSelectPage from "./pages/internet/InternetDetailsSelect";
import AuthLayoutPage from "./pages/dashboard/AuthLayout";
import SettingsPage from "./pages/dashboard/Settings";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

function App() {
  const auth = useContext(AuthContext);

  const router = createBrowserRouter([
    // Public Routes (with nav)
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "terminal", element: <TerminalPage /> },
        { path: "mobile-tariff-compare", element: <MobileTariffComparePage /> },
        {
          path: "internet-details-select",
          element: <InternetDetailsSelectPage />,
        },
        { path: "home-tariff-compare", element: <HomeTariffComparePage /> },
        { path: "barber-details-select", element: <BarberDetailsSelectPage /> },
        { path: "barber-compare", element: <BarberComparePage /> },
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },
      ],
    },

    // Authenticated Routes (no nav/footer)
    {
      path: "/dashboard",
      element: auth.isLoggedIn ? <AuthLayoutPage /> : <Navigate to="/" />,
      children: [{ index: true, element: <SettingsPage /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
