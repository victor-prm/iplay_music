import { getSpotifyAuthUrl } from "@/app/_lib/spotify";

export default function Page() {
  const url = getSpotifyAuthUrl();

  return (
    <div className="flex flex-col max-w-65 gap-10 font-poppins">
      <hgroup className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Login</h1>
        <p>Dive into our endless sea of music from all around the world!</p>
      </hgroup>
      <a
        href={url}
        className="font-headline w-full text-center text-iplay-white font-bold py-3 px-6 border-2 border-iplay-white rounded-full hover:bg-iplay-white/20 transition-colors"
      >
        Log in with Spotify
      </a>
    </div>


  );
}