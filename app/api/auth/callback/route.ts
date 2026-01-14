import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function GET(request: NextRequest) {
    const url = new URL(request.nextUrl);
    const searchParams = request.nextUrl.searchParams;
    const { code } = Object.fromEntries(searchParams);

    if (!code || typeof code !== "string") {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }
    console.log("___code___", code);

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${CLIENT_ID}:${CLIENT_SECRET}`
            ).toString("base64")}`,
        },
        body: new URLSearchParams({
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        }),
    });

    const data = await response.json();

    const cookieStore = await cookies();
    // 1 hour max age
    cookieStore.set("IPM_access_token", data.access_token, { maxAge: data.expires_in })
    // 5 hour max age
    cookieStore.set("IPM_refresh_token", data.refresh_token, { maxAge: data.expires_in * 5 })

    console.log("___response___", data);
    console.log("___next-response___", NextResponse.json(data));
    return NextResponse.redirect(new URL("http://127.0.0.1:3000", url));
}