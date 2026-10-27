import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const links = [
    { to: "/how-we-compare", label: t("footer.howWeCompare") },
    { to: "/impressum", label: t("footer.imprint") },
    { to: "/privacy", label: t("footer.privacy") },
    { to: "/terms", label: t("footer.terms") },
    { to: "/contact", label: t("footer.contact") },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 px-8 pb-4 pt-6 mt-20 relative z-10">
      <nav aria-label="Footer">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-center text-xs text-gray-400 mt-4">{t("common.vatNote")}</p>
      <p className="text-center text-xs text-gray-500 mt-1">{t("footer.rights")}</p>
    </footer>
  );
}
