"use client";

import SpotifyPlayerProvider, { useSpotifyPlayer } from "../_components/SpotifyPlayerProvider";
import SpotifyGlobalPlayer from "../_components/SpotifyGlobalPlayer";
import Footer from "../_components/Footer";

export default function SpotifyClientWrapper({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  return (
    <SpotifyPlayerProvider token={token}>
      <ContentWrapper>{children}</ContentWrapper>
    </SpotifyPlayerProvider>
  );
}

// separate component to access context inside provider
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isPlayerVisible } = useSpotifyPlayer();

  return (
    <>
      {children}
      {isPlayerVisible && <SpotifyGlobalPlayer />}
      <Footer />
    </>
  );
}