import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get("IPM_access_token");
    const refreshToken = request.cookies.get("IPM_refresh_token");
    const { pathname, search } = request.nextUrl;

    // 1. REFRESH LOGIC: No access token, but we have a refresh token
    if (!accessToken && refreshToken) {
        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                    ).toString("base64")}`,
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken.value,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("🔄 Access Token refreshed successfully");

                // Continue to the requested page
                const nextResponse = NextResponse.next();

                // Set the new access token in the cookies
                nextResponse.cookies.set("IPM_access_token", data.access_token, {
                    maxAge: data.expires_in,
                    path: "/",
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                });

                // Spotify sometimes sends a NEW refresh token; update if so
                if (data.refresh_token) {
                    nextResponse.cookies.set("IPM_refresh_token", data.refresh_token, {
                        maxAge: 60 * 60 * 24 * 30,
                        path: "/",
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                    });
                }

                return nextResponse;
            }
        } catch (error) {
            console.error("❌ Failed to refresh Spotify token:", error);
            // Fall through to the redirect logic below if refresh fails
        }
    }

    // 2. REDIRECT LOGIC: Totally logged out (no tokens)
    if (!accessToken) {
        const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
        const loginUrl = `${baseUrl}/login`;

        const response = NextResponse.redirect(loginUrl);
        response.cookies.set({
            name: "login_from",
            value: pathname + search,
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!login|api/auth/callback|_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon|manifest.webmanifest|\\.well-known).*)",
    ],
};