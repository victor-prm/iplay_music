// _lib/spotify.ts
const REDIRECT_URI = process.env.REDIRECT_URI;

export function getSpotifyAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CLIENT_ID!,
    redirect_uri: REDIRECT_URI!,
    scope: [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-read-private",
      "user-library-read",
      "user-follow-read",
    ].join(" "),
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}