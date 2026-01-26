// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
    const token = request.cookies.get("IPM_access_token");
    const { pathname, search } = request.nextUrl;

    // 1. Skip internal assets
    const isInternal =
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        pathname.includes('.') || 
        pathname.startsWith('/.well-known');

    const isLoginPage = pathname === "/login";

    // 2. Auth Logic
    if (!token && !isInternal && !isLoginPage) {
        // HARDCODE the base from ENV. Do not trust request.url.
        const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
        const loginUrl = new URL("/login", baseUrl);
        
        console.log(`🚫 Redirecting to: ${loginUrl.toString()}`);
        const response = NextResponse.redirect(loginUrl);

        response.cookies.set({
            name: "login_from",
            value: pathname + search,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: false, // Force false for IP-based dev
        });

        return response;
    }

    // 3. IMPORTANT: You must return NextResponse.next() 
    // or the page will hang/404 if the user IS logged in!
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!login|api/auth/callback|_next/static|_next/image|favicon.ico|\\.well-known).*)",
    ],
};