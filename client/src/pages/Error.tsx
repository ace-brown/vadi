import Footer from "@/components/footer/footer";
import Header from "@/components/navigation/MainNavigation";
import { useTranslation } from "react-i18next";

export default function ErrorPage() {
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <main className="flex flex-col justify-start items-center min-h-screen">
        <h1 className="text-red-600 font-bold text-2xl mt-12">
          {t("errors.notFound")}
        </h1>
      </main>
      <Footer />
    </>
  );
}
