import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import TerminalPage from "./pages/Terminal";
import MobileTariffCompare from "./pages/mobile-tariff/MobileTariffCompare";

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
          element: <MobileTariffCompare />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
