import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const cookieStore = await cookies();

    // 1. Validate the code
    if (!code) {
        return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    try {
        // 2. Exchange code for Spotify Tokens
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                ).toString("base64")}`,
            },
            body: new URLSearchParams({
                code,
                redirect_uri: process.env.REDIRECT_URI!,
                grant_type: "authorization_code",
            }),
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error("Spotify Token Error:", data);
            return NextResponse.json(data, { status: tokenResponse.status });
        }

        // 3. Determine the redirect destination
        // Pull the 'login_from' cookie we set in proxy.ts
        const redirectTo = cookieStore.get("login_from")?.value || "/";

        // Determine the base URL (Force 127.0.0.1 if defined in env)
        // app/api/auth/callback/route.ts
        // Use your BASE_URL instead of origin
        const base = process.env.BASE_URL || "http://127.0.0.1:3000";
        const response = NextResponse.redirect(new URL(redirectTo, base));

        // 4. Set Cookie Configuration
        // domain: "127.0.0.1" ensures the browser doesn't try to share this with localhost
        const commonConfig = {
            path: "/",
            httpOnly: true,
            secure: false, // Essential for HTTP on 127.0.0.1
            sameSite: "lax" as const,
            domain: "127.0.0.1",
        };

        // 5. Attach tokens to the Response object
        response.cookies.set("IPM_access_token", data.access_token, {
            ...commonConfig,
            maxAge: data.expires_in,
        });

        if (data.refresh_token) {
            response.cookies.set("IPM_refresh_token", data.refresh_token, {
                ...commonConfig,
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        // 6. Clean up the 'login_from' cookie
        response.cookies.delete("login_from");

        console.log(`✅ Success! Redirecting to ${base}${redirectTo}`);
        return response;

    } catch (error) {
        console.error("Auth Callback Crash:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}