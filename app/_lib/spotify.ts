// _lib/spotify.ts
const REDIRECT_URI = process.env.REDIRECT_URI;

export function getSpotifyAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CLIENT_ID!,
    redirect_uri: REDIRECT_URI!, // This will now be 127.0.0.1
    scope: [
      "playlist-read-private",
      "user-read-private",
      "user-library-read",
      "user-follow-read",
    ].join(" "),
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}