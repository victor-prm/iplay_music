const CLIENT_ID = process.env.CLIENT_ID!;
const REDIRECT_URI = process.env.REDIRECT_URI ?? "http://localhost:3000"; 

// Include all the scopes your app needs
const SCOPES = [
  "playlist-read-private",
  "user-read-private",
  "user-library-read",
  "user-follow-read"
].join(" "); // space-separated for Spotify

const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

export default function Page() {
  return (
    <a href={url} className="font-headline">
      Log in with Spotify
    </a>
  );
}