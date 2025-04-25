import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken"); // Adjust based on your auth setup

  // If no token and trying to access /dashboard, redirect to /
  if (!token && req.nextUrl.pathname === "/dashboard") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect /dashboard and all subroutes
};
