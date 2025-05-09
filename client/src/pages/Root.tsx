import Footer from "@/components/footer";
import Header from "@/components/navigation/MainNavigation";
import { Providers } from "@/providers";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col justify-between">
        <Header />
        <div className="w-[90%] mx-auto">
          <Outlet />
        </div>
        <Footer />
      </div>
    </Providers>
  );
}
