import { NextResponse } from "next/server";

const CLIENT_ID = process.env.CLIENT_ID!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function GET() {
  const SCOPES = [
    "playlist-read-private",
    "user-read-private",
    "user-library-read",
    "user-follow-read"
  ].join(" "); // Spotify wants space-separated scopes

  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

  return NextResponse.redirect(url);
}