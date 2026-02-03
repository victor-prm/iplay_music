import Header from "../_components/Header";
import SpotifyClientWrapper from "./SpotifyClientWrapper";
import { cookies } from "next/headers";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("IPM_access_token")?.value ?? "";

  return (
    <>
      <Header />

      <SpotifyClientWrapper token={token}>
        <main className="flex flex-col gap-12 container p-2 mx-auto pt-16 pb-40 h-full max-w-300">
          {children}
        </main>
      </SpotifyClientWrapper>
    </>
  );
}