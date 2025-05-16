import { Link } from "react-router-dom";
import logo from "@/images/logo.jpg";

import {
  Smartphone,
  Car,
  Plane,
  Scissors,
  Tv,
  Wifi,
  HeartPulse,
  Shovel,
  Book,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "اینترنت",
    icon: Wifi,
    submenu: [
      { label: "اینترنت خانگی", path: "/internet/home-tariff" },
      { label: "اینترنت موبایل", path: "/internet/mobile-tariff" },
    ],
  },
  {
    label: "آرایشی و زیبایی",
    icon: Scissors,
    submenu: [
      { label: "آرایشگاه زنانه", path: "/aesthetic/women-salon" },
      { label: "آرایشگاه مردانه", path: "/aesthetic/men-salon" },
    ],
  },
  {
    label: "گردشگری",
    icon: Plane,
    submenu: [
      { label: "تور داخلی", path: "/travel/domestic" },
      { label: "تور خارجی", path: "/travel/international" },
    ],
  },
  {
    label: "لوازم الکترونیک",
    icon: Tv,
    submenu: [
      {
        label: "تعميرات لوازم برقی و خانگی",
        path: "/electronics/appliance-repair",
      },
    ],
  },
  {
    label: "موبایل و کامپیوتر",
    icon: Smartphone,
    submenu: [
      { label: "موبایل", path: "/pc-mobile/mobile" },
      { label: "کامپیوتر", path: "/pc-mobile/computer" },
    ],
  },
  {
    label: "خدمات کشاورزی",
    icon: Shovel,
    submenu: [
      { label: "کود و محصولات باغی", path: "/agriculture/garden-supplies" },
      { label: "محصولات دامی", path: "/agriculture/livestock" },
    ],
  },
  {
    label: "خدمات سلامت",
    icon: HeartPulse,
    submenu: [{ label: "دندانپزشکی", path: "/healthcare/dental" }],
  },
  {
    label: "آموزشی",
    icon: Book,
    submenu: [
      { label: "آموزشگاه ها", path: "/education/centers" },
      { label: "کتابفروشی", path: "/education/bookstores" },
    ],
  },
  {
    label: "وسایل نقلیه",
    icon: Car,
    submenu: [
      { label: "تعميرات خودرو", path: "/vehicle/auto-repair" },
      {
        label: "تعميرات موتور سیکلت",
        path: "/vehicle/motorcycle-repair",
      },
    ],
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full shadow-md rtl text-right">
      <div className="bg-white p-4 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="sth" width="30" />
          <span className="sr-only">Vadi</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* {!auth.isLoggedIn && (
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
          )} */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Desktop Menu */}
      <nav className="hidden md:block bg-[#023e8a] text-white shadow relative z-50">
        <ul className="flex justify-center space-x-6 p-4 text-sm font-medium">
          {navItems.map(({ label, icon: Icon, submenu }, idx) => (
            <li key={idx} className="relative group">
              <div className="flex flex-wrap items-center justify-center gap-[3px] cursor-pointer transition">
                <Icon size={16} />
                {label}
              </div>
              <div className="absolute right-0 top-full mt-0 w-max min-w-[100px] bg-[#023e8a] rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 ease-in-out z-50">
                <ul className="flex flex-col py-2 text-right">
                  {submenu.map((sub, i) => (
                    <li key={i}>
                      <Link
                        to={sub.path}
                        className="block px-4 py-2 text-sm hover:bg-[#0077b6]"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white p-4">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            {navItems.map(({ label, submenu }, idx) => (
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
                    {submenu.map(({ label: subLabel, path }, i) => (
                      <li key={i} className="py-1">
                        <Link to={path} className="block w-full">
                          {subLabel}
                        </Link>
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
