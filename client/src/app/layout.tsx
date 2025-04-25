import type { Metadata } from "next";
import "@fontsource/vazir";

import NavBar from "@/components/navigation/nav-bar";
import Footer from "@/components/footer";
import { Providers } from "./providers";
import "./globals.css";

// const geistSans = localFont({
//   src: "../fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "../fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "خیام سانا",
  description:
    "از اعتبارسنجی تا اجرا، ابزارها، راهنمایی‌ها و جامعه‌ای را که برای ساخت، راه‌اندازی و رشد کسب‌وکارتان نیاز دارید، در اختیار شما می‌گذاریم",
};

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col justify-between">
            <NavBar />
            <main className="w-[90%] mx-auto md:w-[80%]">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
