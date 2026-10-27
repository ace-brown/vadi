import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

// Show the page only to logged-in users (or admins); others go to the login page
export default function RequireAuth({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth.isLoggedIn || (admin && auth.role !== "admin")) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
