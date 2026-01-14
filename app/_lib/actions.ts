import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export async function fetchFromSpotify(link: string) {
    const cookieStore = await cookies();
    const accessTokenCookie: any = cookieStore.get("IPM_access_token");
    const accessRefreshCookie = cookieStore.get("IPM_refresh_token");

    if (!accessTokenCookie) {
        redirect("/login")
    }

    //console.log(accessTokenCookie, accessRefreshCookie)

    const response = await fetch(link, {
        headers: {
            Authorization: `Bearer ${accessTokenCookie.value}`,
        },
        cache: "no-store",
    });

    /*  if (!response.ok) {
         const error = await response.text();
         throw new Error(error);
     } */

    return response.json();
}


export async function getFilteredPlaylists(
    searchResults: any,
    minTracks = 20,
    minFollowers = 10
) {
    // 1️⃣ Remove nulls
    const valid = searchResults.filter(Boolean);

    // 2️⃣ Keep playlists with enough tracks
    const enoughTracks = valid.filter(pl => pl.tracks?.total >= minTracks);

    // 3️⃣ Optionally fetch full details for follower info
    const detailed = await Promise.all(
        enoughTracks.map(pl => fetchFromSpotify(`https://api.spotify.com/v1/playlists/${pl.id}`))
    );

    // 4️⃣ Filter by minimum followers
    const popular = detailed.filter(pl => pl.followers?.total >= minFollowers);

    // 5️⃣ Trim to only the keys you care about
    const trimmed = popular.map(pl => ({
        id: pl.id,
        name: pl.name,
        owner: pl.owner.display_name,
        images: pl.images,
        tracks: pl.tracks.total,
        followers: pl.followers?.total ?? 0,
        public: pl.public ?? null,
    }));

    return trimmed;
}