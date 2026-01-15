import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export async function fetchFromSpotify(
    url: string,
    options?: { revalidate?: number }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("IPM_access_token");

    if (!token) {
        redirect("/login");
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
        cache: options?.revalidate ? "force-cache" : "no-store",
        next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
        const text = await response.text();
        console.error("Spotify HTTP error", response.status, text);
        throw new Error(`Spotify error ${response.status}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
        console.error("Spotify returned non-JSON or empty response");
        return null;
    }

    return response.json();
}


interface SpotifyPlaylist {
    id: string;
    name: string;
    owner: {
        display_name: string;
        id: string;
    };
    images: { url: string; height?: number; width?: number }[];
    tracks: {
        total: number;
    };
    followers?: {
        total: number;
    };
    public?: boolean;
}

export type FilteredPlaylist = {
    id: string;
    name: string;
    images: { url: string; height?: number; width?: number }[];
    owner: string;
    tracks: number;
    followers: number;
    public: boolean | null;
};

export async function getFilteredPlaylists(
    searchResults: SpotifyPlaylist[],
    minTracks = 20,
    minFollowers = 10
): Promise<FilteredPlaylist[]> {
    // 1. Remove nulls from the search results
    const valid = searchResults.filter(Boolean);

    // 2. Keep playlists that have enough tracks
    const enoughTracks = valid.filter((pl) => pl.tracks?.total >= minTracks);

    // 3. Optionally fetch full details for follower info
    const detailed = await Promise.all(
        enoughTracks.map((pl) => fetchFromSpotify(`https://api.spotify.com/v1/playlists/${pl.id}`) as Promise<SpotifyPlaylist>)
    );

    // 4. Filter by minimum followers
    const popular = detailed.filter(
        (pl) => pl.followers?.total != null && pl.followers.total >= minFollowers
    );

    // 5. Trim to only the keys you care about
    const trimmed: FilteredPlaylist[] = popular.map((pl) => ({
        id: pl.id,
        name: pl.name,
        images: pl.images,
        owner: pl.owner.display_name,
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


export async function getArtistsByName(names: string[], market = "DK") {
    interface SpotifyArtist {
        id: string;
        name: string;
        followers: { total: number };
        popularity: number;
        images?: { url: string; height: number; width: number }[];
        genres?: string[];
        [key: string]: any;
    }

    const results: SpotifyArtist[] = [];

    const promises = names.map(async (name) => {
        const data = (await fetchFromSpotify(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&market=${market}&limit=5`,
            { revalidate: 3600 }
        )) as { artists?: { items: SpotifyArtist[] } };

        if (data.artists?.items?.length) {
            const normalizedQuery = name.toLowerCase();

            const nameMatches: SpotifyArtist[] = data.artists.items.filter(
                (a) => a.name.toLowerCase().includes(normalizedQuery)
            );

            const bestMatch: SpotifyArtist =
                nameMatches.length > 0
                    ? nameMatches.reduce((prev, curr) =>
                          curr.followers.total > prev.followers.total ? curr : prev
                      )
                    : data.artists.items[0];

            results.push(bestMatch);
        }
    });

    await Promise.all(promises);

    // Deduplicate by id
    const uniqueResults: SpotifyArtist[] = Array.from(
        new Map(results.map((a) => [a.id, a])).values()
    );

    // Sort by popularity descending
    uniqueResults.sort((a, b) => b.popularity - a.popularity);

    return uniqueResults;
}