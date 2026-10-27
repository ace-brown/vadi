import { Link, useLocation } from "react-router-dom";

import {
  Smartphone,
  Car,
  Scissors,
  Tv,
  Wifi,
  HeartPulse,
  Shovel,
  Book,
  Menu,
  X,
  ChevronDown,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    label: "Internet",
    icon: Wifi,
    submenu: [
      { label: "Home internet", path: "/internet/home-tariff" },
      { label: "Mobile internet", path: "/internet/mobile-tariff" },
    ],
  },
  {
    label: "Beauty & aesthetics",
    icon: Scissors,
    submenu: [
      { label: "Women's salon", path: "/aesthetic/women-salon" },
      { label: "Men's salon", path: "/aesthetic/men-salon" },
    ],
  },
  {
    label: "Electronics",
    icon: Tv,
    submenu: [
      {
        label: "Home appliance repair",
        path: "/electronics/appliance-repair",
      },
    ],
  },
  {
    label: "Mobile & computer",
    icon: Smartphone,
    submenu: [
      { label: "Mobile repair", path: "/pc-mobile/mobile-repair" },
      {
        label: "Computer & laptop repair",
        path: "/pc-mobile/computer-repair",
      },
    ],
  },
  {
    label: "Agriculture",
    icon: Shovel,
    submenu: [
      { label: "Fertilizer & garden supplies", path: "/agriculture/garden-supplies" },
      { label: "Animal products", path: "/agriculture/animal-based-products" },
    ],
  },
  {
    label: "Healthcare",
    icon: HeartPulse,
    submenu: [{ label: "Dentistry", path: "/healthcare/dental" }],
  },
  {
    label: "Vehicles",
    icon: Car,
    submenu: [
      { label: "Car repair", path: "/vehicle/auto-repair" },
      {
        label: "Motorcycle repair",
        path: "/vehicle/motorcycle-repair",
      },
    ],
  },
  {
    label: "Education",
    icon: Book,
    submenu: [
      { label: "Education centers", path: "/education/centers" },
      { label: "Bookstores", path: "/education/bookstores" },
    ],
  },
  // {
  //   label: "Travel",
  //   icon: Plane,
  //   submenu: [
  //     { label: "Domestic tours", path: "/travel/travel-details-select" },
  //     { label: "International tours", path: "/travel/international" },
  //   ],
  // },
];

type NavItem = (typeof navItems)[number];

// A top-level item is active when its own path or one of its submenu paths is open
function isItemActive(item: NavItem, pathname: string) {
  if (item.path) return pathname === item.path;
  return !!item.submenu?.some((sub) => pathname.startsWith(sub.path));
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full shadow-md">
      <div className="bg-white p-4 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#023e8a] text-white font-extrabold">
            V
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#023e8a]">
            Vadi
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {/* {!auth.isLoggedIn && (
            <>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
              <Link to="/login">
                <Button>Log in</Button>
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
                Log out
              </Button>
            </>
          )} */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Desktop Menu */}
      <nav className="hidden md:block bg-[#023e8a] text-white shadow relative z-50">
        <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1 px-4 py-2 text-sm font-medium">
          {navItems.map((item, idx) => {
            const { label, icon: Icon, submenu, path } = item;
            const itemClass = `flex items-center gap-1 rounded-md px-3 py-2 transition hover:bg-[#0077b6] ${
              isItemActive(item, pathname) ? "bg-[#0077b6]" : ""
            }`;
            return (
              <li key={idx} className="relative group">
                {path ? (
                  <Link to={path} className={itemClass}>
                    <Icon size={16} />
                    {label}
                  </Link>
                ) : (
                  <button type="button" className={`${itemClass} cursor-default`}>
                    <Icon size={16} />
                    {label}
                    <ChevronDown size={14} className="opacity-70" />
                  </button>
                )}
                {submenu && (
                  <div className="absolute left-0 top-full pt-1 w-max min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition duration-200 ease-in-out z-50">
                    <ul className="flex flex-col py-2 bg-[#023e8a] rounded-md shadow-lg">
                      {submenu.map((sub, i) => (
                        <li key={i}>
                          <Link
                            to={sub.path}
                            className={`block px-4 py-2 text-sm hover:bg-[#0077b6] ${
                              pathname.startsWith(sub.path) ? "bg-[#0077b6]" : ""
                            }`}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white p-4 border-b">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            {navItems.map((item, idx) => (
              <li key={idx}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`block ${isItemActive(item, pathname) ? "text-[#023e8a] font-bold" : ""}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <details className="group" open={isItemActive(item, pathname)}>
                    <summary
                      className={`flex justify-between items-center cursor-pointer ${
                        isItemActive(item, pathname) ? "text-[#023e8a] font-bold" : ""
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className="transition-transform group-open:rotate-180"
                        size={16}
                      />
                    </summary>
                    <ul className="mt-2 ps-4 text-sm text-gray-600">
                      {item.submenu?.map(({ label: subLabel, path }, i) => (
                        <li key={i} className="py-1">
                          <Link
                            to={path}
                            className={`block w-full ${
                              pathname.startsWith(path) ? "text-[#023e8a] font-semibold" : ""
                            }`}
                          >
                            {subLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
