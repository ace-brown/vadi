import { Outlet } from "react-router-dom";

export default function AuthLayoutPage() {
  return (
    <div className="min-h-[50vh] p-6">
      <Outlet />
    </div>
  );
}
