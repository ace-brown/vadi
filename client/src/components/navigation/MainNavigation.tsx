import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthContext } from "@/context/auth-context";
import logo from "@/images/logo.jpg";

import {
  Smartphone,
  Car,
  Plane,
  Scissors,
  Tv,
  Wifi,
  HeartPulse,
  Refrigerator,
  Shirt,
  Wrench,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const items = [
  {
    label: "تعرفه موبایل",
    icon: Smartphone,
    submenu: ["ایرانسل", "همراه اول", "رایتل"],
  },
  { label: "ماشین", icon: Car, submenu: ["خرید", "فروش", "اجاره"] },
  {
    label: "سفر",
    icon: Plane,
    submenu: ["تور داخلی", "تور خارجی", "بلیط هواپیما"],
  },
  {
    label: "آرایشگر",
    icon: Scissors,
    submenu: ["زنانه", "مردانه", "رزرو آنلاین"],
  },
  { label: "تلویزیون", icon: Tv, submenu: ["ال‌جی", "سامسونگ", "سونی"] },
  { label: "اینترنت", icon: Wifi, submenu: ["ADSL", "فیبر نوری", "وایرلس"] },
  {
    label: "دندانپزشکی",
    icon: HeartPulse,
    submenu: ["ترمیمی", "زیبایی", "ایمپلنت"],
  },
  {
    label: "لوازم خانگی",
    icon: Refrigerator,
    submenu: ["یخچال", "لباسشویی", "اجاق گاز"],
  },
  {
    label: "خیاطی",
    icon: Shirt,
    submenu: ["لباس مجلسی", "کت و شلوار", "دوخت سفارشی"],
  },
  {
    label: "تعمیرات تلویزیون",
    icon: Wrench,
    submenu: ["LCD", "LED", "پلاسما"],
  },
  {
    label: "نظافت منزل",
    icon: Sparkles,
    submenu: ["ساعتی", "روزانه", "هفتگی"],
  },
];

export default function Header() {
  const auth = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full shadow-md rtl text-right">
      {/* Header Top */}
      <div className="bg-white p-4 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="sth" width="30" />
          <span className="sr-only">Vadi</span>
        </Link>

        <div className="flex items-center gap-4">
          {!auth.isLoggedIn && (
            <>
              <Link to="/signup">
                <Button>ثبت‌ نام</Button>
              </Link>
              <Link to="/login">
                <Button>ورود</Button>
              </Link>
            </>
          )}
          {auth.isLoggedIn && (
            <>
              <Link to="/dashboard">
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <Button
                onClick={() => {
                  auth.logout();
                  navigate("/");
                }}
              >
                خروج
              </Button>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:block bg-white">
        <ul className="flex justify-center gap-6 text-sm font-medium text-gray-700 py-2">
          {items.map(({ label, icon: Icon, submenu }, idx) => (
            <li key={idx} className="relative group">
              <div className="flex items-center gap-[2px] cursor-pointer hover:text-blue-600 transition">
                <ChevronDown size={14} />
                {label}
                <Icon size={16} />
              </div>

              <ul className="absolute hidden group-hover:block bg-white border rounded shadow-md z-20 mt-2 w-40 text-sm text-gray-700 text-right">
                {submenu.map((item, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white p-4">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            {items.map(({ label, submenu }, idx) => (
              <li key={idx}>
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer">
                    {label}
                    <ChevronDown
                      className="transition-transform group-open:rotate-180"
                      size={16}
                    />
                  </summary>
                  <ul className="mt-2 ps-4 text-sm text-gray-600">
                    {submenu.map((item, i) => (
                      <li key={i} className="py-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
