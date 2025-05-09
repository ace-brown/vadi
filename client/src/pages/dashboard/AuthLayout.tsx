import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayoutPage() {
  return (
    <div className="min-h-screen p-6">
      <Outlet />
    </div>
  );
}
