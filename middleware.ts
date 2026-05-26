import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/checkout", "/orders", "/account", "/auth/change-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const locale = request.cookies.get("locale")?.value ?? "en";

  const isProtected = protectedRoutes.some((r) => pathname.includes(r));

  if (isProtected && !token) {
    const loginUrl = new URL(`/auth/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  if (!request.cookies.get("locale")) {
    response.cookies.set("locale", locale, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
