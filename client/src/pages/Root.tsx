import { Toaster } from "sonner";
import Footer from "@/components/footer";
import Header from "@/components/navigation/MainNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Toaster richColors position="top-center" />
      <Header />
      <div className="w-[95%] mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
