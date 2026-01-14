import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const accessTokenCookie: any = cookieStore.get("IPM_access_token");
  const accessRefreshCookie = cookieStore.get("IPM_refresh_token");

  console.log(accessTokenCookie, accessRefreshCookie)

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessTokenCookie.value}`,
    },
  });

  const text = await response.text();
  console.log("Spotify raw response:", response.status, text);

  return null;
}
