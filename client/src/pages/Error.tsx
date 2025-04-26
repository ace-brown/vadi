import Header from "@/components/navigation/MainNavigation";
import React from "react";

export default function ErrorPage() {
  return (
    <>
      <Header />
      <main>
        <h1 className="text-red-600 font-bold">صحفه مورد نظر پیدا نشد</h1>
      </main>
    </>
  );
}
