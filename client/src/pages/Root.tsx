import Header from "@/components/navigation/MainNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <Header />
      <div className="w-[80%] mx-auto">
        <Outlet />
      </div>
    </>
  );
}
