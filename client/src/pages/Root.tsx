import { Toaster } from "sonner";
import Footer from "@/components/footer/footer";
import Header from "@/components/navigation/MainNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster richColors position="top-center" />
      <Header />
      <main className="w-[95%] mx-auto flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
