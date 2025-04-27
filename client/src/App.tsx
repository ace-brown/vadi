import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import ErrorPage from "./pages/Error";
import ComparePage from "./pages/Compare";
import MobileDetailsGrids from "./pages/mobile/MobileDetailsGrids";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/compare", element: <ComparePage /> },
        { path: "/mobile-details-grids", element: <MobileDetailsGrids /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
