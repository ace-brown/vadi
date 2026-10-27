import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "./de";
import en from "./en";

export const LANGUAGES = ["de", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "language";

function storedLanguage(): Language {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "de" || value === "en") return value;
  } catch {
    // Storage can be unavailable (private mode); fall back to German
  }
  return "de";
}

i18n.use(initReactI18next).init({
  resources: { de: { translation: de }, en: { translation: en } },
  lng: storedLanguage(),
  fallbackLng: "de",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language;
}
syncDocumentLanguage(i18n.language);

i18n.on("languageChanged", (language) => {
  syncDocumentLanguage(language);
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore: the choice just won't be remembered
  }
});

export function currentLocale() {
  return i18n.language === "en" ? "en-IE" : "de-DE";
}

export default i18n;
