"use client";

import SpotifyPlayerProvider from "../_components/SpotifyPlayerProvider";
import SpotifyGlobalPlayer from "../_components/SpotifyGlobalPlayer";

export default function SpotifyClientWrapper({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  return (
    <SpotifyPlayerProvider token={token}>
      {children}
      <SpotifyGlobalPlayer />
    </SpotifyPlayerProvider>
  );
}