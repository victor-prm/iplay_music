import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("IPM_access_token");

  if (!hasToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    // Store the current path in a cookie for after login
    response.cookies.set({
      name: "login_from",
      value: request.nextUrl.pathname + request.nextUrl.search,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|api/auth/callback|favicon.ico|\\.well-known).*)",
  ],
};