import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Info, Menu, Smartphone, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { LANGUAGES } from "@/i18n";

// Only the launch categories are shown; the other category pages still exist
// (see App.tsx) and can be added back here once they have real data
const navItems = [
  { key: "nav.home", icon: Home, path: "/" },
  { key: "nav.homeInternet", icon: Wifi, path: "/internet/home-tariff" },
  { key: "nav.mobilePlans", icon: Smartphone, path: "/internet/mobile-tariff" },
  { key: "nav.howWeCompare", icon: Info, path: "/how-we-compare" },
];

function isActive(path: string, pathname: string) {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  return (
    <div role="group" aria-label={t("common.language")} className="flex rounded-md border overflow-hidden text-xs font-semibold">
      {LANGUAGES.map((language) => (
        <button
          key={language}
          type="button"
          aria-pressed={i18n.language === language}
          onClick={() => i18n.changeLanguage(language)}
          className={`px-2 py-1 uppercase ${
            i18n.language === language ? "bg-[#023e8a] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {language}
        </button>
      ))}
    </div>
  );
}

function AccountLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth.isLoggedIn) {
    return (
      <>
        <Link to="/login" className="text-sm font-medium hover:underline" onClick={onNavigate}>
          {t("nav.logIn")}
        </Link>
        <Button asChild size="sm">
          <Link to="/signup" onClick={onNavigate}>
            {t("nav.signUp")}
          </Link>
        </Button>
      </>
    );
  }
  return (
    <>
      {auth.role === "admin" && (
        <Link to="/admin" className="text-sm font-medium hover:underline" onClick={onNavigate}>
          {t("nav.admin")}
        </Link>
      )}
      <Link to="/account" className="text-sm font-medium hover:underline" onClick={onNavigate}>
        {t("nav.account")}
      </Link>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          auth.logout();
          onNavigate?.();
          navigate("/");
        }}
      >
        {t("nav.logOut")}
      </Button>
    </>
  );
}

export default function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full shadow-md">
      <div className="bg-white px-4 py-3 flex justify-between items-center border-b">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#023e8a] text-white font-extrabold">
            V
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#023e8a]">Vadi</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitch />
          <div className="hidden md:flex items-center gap-4">
            <AccountLinks />
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {/* Desktop Menu */}
      <nav className="hidden md:block bg-[#023e8a] text-white shadow">
        <ul className="flex flex-wrap justify-center gap-x-2 px-4 py-2 text-sm font-medium">
          {navItems.map(({ key, icon: Icon, path }) => (
            <li key={path}>
              <Link
                to={path}
                aria-current={isActive(path, pathname) ? "page" : undefined}
                className={`flex items-center gap-1 rounded-md px-3 py-2 transition hover:bg-[#0077b6] ${
                  isActive(path, pathname) ? "bg-[#0077b6]" : ""
                }`}
              >
                <Icon size={16} />
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white p-4 border-b">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            {navItems.map(({ key, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  aria-current={isActive(path, pathname) ? "page" : undefined}
                  className={`block ${isActive(path, pathname) ? "text-[#023e8a] font-bold" : ""}`}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <AccountLinks onNavigate={() => setMenuOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  );
}
