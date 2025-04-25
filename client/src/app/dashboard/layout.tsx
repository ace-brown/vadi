"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaSeedling,
  FaUsers,
  FaShoppingCart,
  FaFileAlt,
  FaPenFancy,
} from "react-icons/fa";

import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/context/auth-context";

const links = [
  {
    href: "/dashboard",
    asideLabel: "رخ‌ نما",
    pageLabel: "رخ نمای",
    icon: <FaUser />,
  },
  {
    href: "/dashboard/user-ideas",
    asideLabel: "ایده های من",
    pageLabel: "ایده های",
    icon: <FaSeedling />,
  },
  {
    href: "/dashboard/reports",
    asideLabel: "گزارش های من",
    pageLabel: "گزارش های",
    icon: <FaFileAlt />,
  },
  {
    href: "/dashboard/register-idea",
    asideLabel: "ثبت ایده جدید",
    pageLabel: "ثبت ایده جدید برای",
    icon: <FaPenFancy />,
  },
  {
    href: "/dashboard/costs",
    asideLabel: "هزینه های من",
    pageLabel: "هزینه های",
    icon: <FaShoppingCart />,
  },
  {
    href: "/dashboard/users",
    asideLabel: "کاربران",
    pageLabel: "کاربران",
    icon: <FaUsers />,
  },
  // { href: "/dashboard/analytics", asideLabel: "نمودارها",pageLabel:  icon: <FaChartBar /> },
  // { href: "/dashboard/settings", asideLabel: "تنظیمات",pageLabel icon: <FaCog /> },
];

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useContext(AuthContext);
  const pathname = usePathname();
  // Find the current label for the heading
  const currentLink = links.find((link) => link.href === pathname);
  const heading = currentLink ? currentLink.pageLabel : "";
  return (
    <div className="w-[80%] ml-auto mr-[8rem] shadow border p-8 mt-8 rounded-[0.5rem]">
      <h1 className="text-2xl">{`${heading} ${auth.username}`}</h1>
      <Separator className="bg-border h-[1px] w-full mt-6 mb-4" />
      <div>
        <aside className="fixed top-[4rem] right-0 w-[200px] h-screen border shadow">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 mt-2">
            {links.map((link) => {
              if (link.href === "/dashboard/users" && auth.role !== "admin") {
                return null; // Hide the link for non-admin users
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 font-medium rounded-md py-2 px-6 ${
                    pathname === link.href
                      ? "text-blue-500 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {link.icon}
                  {link.asideLabel}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
