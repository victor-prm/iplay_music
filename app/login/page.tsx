import { getSpotifyAuthUrl } from "@/app/_lib/spotify";

export default function Page() {
  const url = getSpotifyAuthUrl();

  return (
    <a
      href={url}
      className="font-headline text-iplay-pink hover:underline"
    >
      Log in with Spotify
    </a>
  );
}