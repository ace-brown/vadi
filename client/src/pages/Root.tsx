import Footer from "@/components/footer";
import Header from "@/components/navigation/MainNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Header />
      <div className="w-[90%] mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
