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
import LoginPage from "@/pages/dashboard/Login";
import SignupPage from "@/pages/dashboard/Signup";
import AuthLayoutPage from "@/pages/dashboard/AuthLayout";
import SettingsPage from "@/pages/dashboard/Settings";
import { aestheticRoutes } from "@/routes/aestheticRoutes";
import { internetRoutes } from "@/routes/internetRoutes";
import { vehicleRoutes } from "@/routes/vehicleRoutes";
import { travelRoutes } from "./routes/travelRoutes";
import ApplianceRepairPage from "./pages/electronics/ApplianceRepair";
import { PMRoutes } from "./routes/PMRoutes";
import { agricultureRoutes } from "./routes/agricultureRoutes";
import DentalPage from "./pages/healthcare/Dental";
import { educationRoutes } from "./routes/educationRoutes";
import Contact from "./pages/legal/Contact";
import PrivacyPage from "./pages/legal/Privacy";
import TermsPage from "./pages/legal/Terms";
import Reservation from "./pages/Reservation";

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
        { path: "reservation", element: <Reservation /> },
        // ---------- Auth ----------
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },

        // ---------- Dashboard (Private) ----------
        {
          path: "dashboard",
          element: auth.isLoggedIn ? <AuthLayoutPage /> : <Navigate to="/" />,
          children: [{ index: true, element: <SettingsPage /> }],
        },
        // ---------- Comparison Routes ----------
        {
          // Dont forget to add loader for the data fetching
          path: "aesthetic",
          children: aestheticRoutes,
        },
        {
          path: "internet",
          children: internetRoutes,
        },
        {
          // Dont forget to add loader for the data fetching
          path: "vehicle",
          children: vehicleRoutes,
        },
        {
          path: "electronics/appliance-repair",
          element: <ApplianceRepairPage />,
        },
        {
          // Dont forget to add loader for the data fetching
          path: "pc-mobile",
          children: PMRoutes,
        },
        {
          path: "agriculture",
          children: agricultureRoutes,
        },
        {
          // Dont forget to add loader for the data fetching
          path: "healthcare/dental",
          element: <DentalPage />,
        },
        {
          path: "education",
          children: educationRoutes,
        },
        {
          path: "healthcare/dental",
          element: <DentalPage />,
        },
        {
          // Dont forget to add loader for the data fetching
          path: "travel",
          children: travelRoutes,
        },
        // ---------- Footer Routes ----------
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/privacy",
          element: <PrivacyPage />,
        },
        {
          path: "/terms",
          element: <TermsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
