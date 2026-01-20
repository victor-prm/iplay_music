const CLIENT_ID = process.env.CLIENT_ID;
if (!CLIENT_ID) throw new Error("Missing Spotify CLIENT_ID");

const REDIRECT_URI = process.env.REDIRECT_URI ?? "http://localhost:3000";

const SCOPES = [
  "playlist-read-private",
  "user-read-private",
  "user-library-read",
  "user-follow-read",
].join(" ");

export function getSpotifyAuthUrl(): string {
  const clientId = CLIENT_ID as string; // assert safe
  const redirectUri = REDIRECT_URI; // already a string because of ??
  const scope = SCOPES;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}