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
import AuthLayoutPage from "@/pages/dashboard/AuthLayout";
import SettingsPage from "@/pages/dashboard/Settings";
import { aestheticRoutes } from "@/routes/aestheticRoutes";
import { internetRoutes } from "@/routes/internetRoutes";

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
        // ---------- Auth ----------
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },

        // ---------- Dashboard (Private) ----------
        {
          path: "/dashboard",
          element: auth.isLoggedIn ? <AuthLayoutPage /> : <Navigate to="/" />,
          children: [{ index: true, element: <SettingsPage /> }],
        },
        // ---------- Comparison Routes ----------
        {
          path: "aesthetic",
          children: aestheticRoutes,
        },
        {
          path: "internet",
          children: internetRoutes,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
