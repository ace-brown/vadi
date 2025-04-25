"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Ensure role is defined and user is authorized
    if (
      !auth.isLoggedIn ||
      !auth.role || // Check if role is null or undefined
      (allowedRoles && !allowedRoles.includes(auth.role))
    ) {
      router.replace("/"); // Redirect unauthorized users
    }
  }, [auth.isLoggedIn, auth.role, allowedRoles, router]);

  // Render children if the user is authorized
  return (
    <>
      {auth.isLoggedIn &&
        auth.role &&
        allowedRoles.includes(auth.role) &&
        children}
    </>
  );
}
