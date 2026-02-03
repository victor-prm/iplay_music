// app/(auth)/login/page.tsx
import { getSpotifyAuthUrl } from "@/app/_lib/spotify";
import Image from "next/image";
import logo from "@/app/icon.svg";
import SplashScreen from "../SplashScreen"; // client component

export default function LoginPage() {
  const url = getSpotifyAuthUrl(); // runs server-side



  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 font-poppins">
        <Image
          src={logo}
          alt="iPlay Logo"
          width={200}
          height={200}
          className="size-24"
        />

        <hgroup className="flex flex-col gap-2 text-center max-w-xs">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm">
            Dive into our endless sea of music from all around the world!
          </p>
        </hgroup>

        <a
          href={url}
          className="w-full max-w-xs text-center text-iplay-white font-bold py-3 px-6
                   border-2 border-iplay-white rounded-full hover:bg-iplay-white/20
                   transition-colors"
        >
          Log in with Spotify
        </a>
      </div>
      <SplashScreen />
    </>

  );
}