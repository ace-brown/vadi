import React from "react";
import Header from "@/components/navigation/MainNavigation";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
