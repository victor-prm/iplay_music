import { getSpotifyAuthUrl } from "@/app/_lib/spotify";
import Image from "next/image";
import logo from "@/app/icon.svg"

export default function Page() {
  const url = getSpotifyAuthUrl();

  return (
    <div className="flex flex-col max-w-58 gap-16 font-poppins">
      <Image 
      src={logo}
      alt="iPlay Logo"
      width={200}
      height={200}
      className="size-24 mx-auto"/>
      <hgroup className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Login</h1>
        <p className="text-sm">Dive into our endless sea of music from all around the world!</p>
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