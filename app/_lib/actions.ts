import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export async function fetchFromSpotify(url: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("IPM_access_token");

    if (!token) {
        throw new Error("No access token");
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
        cache: "no-store",
    });

    const contentType = response.headers.get("content-type");

    // 🔴 Log EVERYTHING if it’s not OK
    if (!response.ok) {
        const text = await response.text();
        console.error("Spotify HTTP error", response.status, text);
        throw new Error(`Spotify error ${response.status}`);
    }

    // 🔴 Spotify returned NO body
    if (!contentType || !contentType.includes("application/json")) {
        console.error("Spotify returned non-JSON or empty response");
        return null;
    }

    const json = await response.json();
    return json;
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



export async function getAllAlbumsForArtist(artistId: string, includeGroups = ["album", "single"]) {
    const limit = 50; // max Spotify allows
    let offset = 0;
    let allAlbums: any[] = [];
    let hasMore = true;

    while (hasMore) {
        const url = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${includeGroups.join(
            ","
        )}&limit=${limit}&offset=${offset}`;

        const data = await fetchFromSpotify(url);

        allAlbums = allAlbums.concat(data.items);

        if (data.next) {
            offset += limit;
        } else {
            hasMore = false;
        }
    }

    // Optional: remove duplicates (Spotify sometimes returns same album in multiple markets)
    const uniqueAlbums = Array.from(new Map(allAlbums.map(a => [a.id, a])).values());

    return uniqueAlbums;
}

export async function getAlbumTracks(albumId: string) {
  if (!albumId) throw new Error("Album ID is required");

  const limit = 50;
  let offset = 0;
  let allTracks: any[] = [];

  while (true) {
    const data = await fetchFromSpotify(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=${limit}&offset=${offset}&market=DK`
    );

    if (!data?.items || !Array.isArray(data.items)) {
      console.error("Unexpected Spotify response:", data);
      break;
    }

    allTracks.push(...data.items);

    if (!data.next) break;
    offset += limit;
  }

  return allTracks;
}