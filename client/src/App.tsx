import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import RequireAuth from "@/components/common/RequireAuth";
import HomePage from "@/pages/Home";
import RootLayout from "@/pages/Root";
import ErrorPage from "@/pages/Error";
import LoginPage from "@/pages/dashboard/Login";
import SignupPage from "@/pages/dashboard/Signup";
import AccountPage from "@/pages/dashboard/Account";
import AdminPage from "@/pages/admin/Admin";
import HomeTariffPage from "@/pages/internet/HomeTariff";
import MobileTariffPage from "@/pages/internet/MobileTariff";
import OfferDetailPage from "@/pages/internet/OfferDetail";
import ComparePage from "@/pages/internet/Compare";
import PartnerRedirectPage from "@/pages/PartnerRedirect";
import ContactPage from "@/pages/legal/Contact";
import PrivacyPage from "@/pages/legal/Privacy";
import TermsPage from "@/pages/legal/Terms";
import ImpressumPage from "@/pages/legal/Impressum";
import HowWeComparePage from "@/pages/legal/HowWeCompare";
import { aestheticRoutes } from "@/routes/aestheticRoutes";
import { vehicleRoutes } from "@/routes/vehicleRoutes";
import { PMRoutes } from "@/routes/PMRoutes";
import { agricultureRoutes } from "@/routes/agricultureRoutes";
import { educationRoutes } from "@/routes/educationRoutes";
import ApplianceRepairPage from "@/pages/electronics/ApplianceRepair";
import DentalPage from "@/pages/healthcare/Dental";

// Created once: rebuilding the router on every render (e.g. after logging in)
// would cancel navigations that are in progress
const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },

        // ---------- Comparison (launch categories) ----------
        { path: "internet/home-tariff", element: <HomeTariffPage /> },
        { path: "internet/home-tariff/:id", element: <OfferDetailPage kind="home" /> },
        { path: "internet/mobile-tariff", element: <MobileTariffPage /> },
        { path: "internet/mobile-tariff/:id", element: <OfferDetailPage kind="mobile" /> },
        { path: "internet/internet-details-select", element: <Navigate to="/" replace /> },
        { path: "compare/:kind", element: <ComparePage /> },
        { path: "partner-redirect", element: <PartnerRedirectPage /> },

        // ---------- Auth & account ----------
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },
        {
          path: "account",
          element: (
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          ),
        },
        { path: "dashboard", element: <Navigate to="/account" replace /> },
        {
          path: "admin",
          element: (
            <RequireAuth admin>
              <AdminPage />
            </RequireAuth>
          ),
        },

        // ---------- Legal & info ----------
        { path: "how-we-compare", element: <HowWeComparePage /> },
        { path: "impressum", element: <ImpressumPage /> },
        { path: "privacy", element: <PrivacyPage /> },
        { path: "terms", element: <TermsPage /> },
        { path: "contact", element: <ContactPage /> },

        // ---------- Other categories ----------
        // Not linked from the navigation until they have real data
        { path: "aesthetic", children: aestheticRoutes },
        { path: "vehicle", children: vehicleRoutes },
        { path: "electronics/appliance-repair", element: <ApplianceRepairPage /> },
        { path: "pc-mobile", children: PMRoutes },
        { path: "agriculture", children: agricultureRoutes },
        { path: "healthcare/dental", element: <DentalPage /> },
        { path: "education", children: educationRoutes },
      ],
    },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
