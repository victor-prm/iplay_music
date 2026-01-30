"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import { formatGenreQuery } from "../_utils/helpers";
import { ArtistFull } from "@/types/spotify";
import { normalizeImages } from "../_utils/helpers";

export async function fetchFromSpotify(
    url: string,
    options?: { revalidate?: number; token?: string }
) {
    let tokenValue = options?.token;

    if (!tokenValue) {
        const cookieStore = await cookies();
        const token = cookieStore.get("IPM_access_token");
        if (!token) redirect("/login");
        tokenValue = token.value;
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${tokenValue}`,
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


export async function getAllAlbumsForArtist(
    artistId: string,
    includeGroups: ("album" | "single" | "appears_on" | "compilation")[] = [
        "album",
        "single",
        "appears_on",
        "compilation",
    ]
) {
    const limit = 50;
    let offset = 0;
    let allAlbums: any[] = [];
    let hasMore = true;

    // Fetch all pages
    while (hasMore) {
        const url = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${includeGroups.join(
            ","
        )}&limit=${limit}&offset=${offset}`;

        const data = await fetchFromSpotify(url);
        allAlbums = allAlbums.concat(data.items);

        if (data.next) offset += limit;
        else hasMore = false;
    }

    // Deduplicate
    const uniqueAlbums = Array.from(new Map(allAlbums.map(a => [a.id, a])).values());

    // Group by album_group
    const grouped: Record<string, any[]> = {
        album: [],
        single: [],
        compilation: [],
        appears_on: [],
    };

    uniqueAlbums.forEach(album => {
        const group = album.album_group || album.album_type || "album";
        if (grouped[group]) grouped[group].push(album);
    });

    return grouped;
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

    // group tracks by disc_number
    const discs: Record<number, any[]> = {};
    allTracks.forEach(track => {
        const disc = track.disc_number || 1;
        if (!discs[disc]) discs[disc] = [];
        discs[disc].push(track);
    });

    // convert to array sorted by disc number
    const discArray = Object.keys(discs)
        .sort((a, b) => Number(a) - Number(b))
        .map(discNum => ({
            discNumber: Number(discNum),
            tracks: discs[Number(discNum)],
        }));

    return discArray;
}

export async function getArtistsByName(
    names: string[],
    market = "DK"
): Promise<ArtistFull[]> {
    const results: ArtistFull[] = [];

    const promises = names.map(async (name) => {
        const data = (await fetchFromSpotify(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&market=${market}&limit=5`,
            { revalidate: 3600 }
        )) as { artists?: { items: any[] } };

        if (!data.artists?.items?.length) return;

        const normalizedQuery = name.toLowerCase();

        const nameMatches = data.artists.items.filter((a) =>
            a.name.toLowerCase().includes(normalizedQuery)
        );

        const bestMatch = nameMatches.length
            ? nameMatches.reduce((prev, curr) =>
                curr.followers.total > prev.followers.total ? curr : prev
            )
            : data.artists.items[0];

        // Normalize into ArtistFull
        const normalized: ArtistFull = {
            ...bestMatch,
            type: "artist",
            href: `https://api.spotify.com/v1/artists/${bestMatch.id}`,
            external_urls: { spotify: `https://open.spotify.com/artist/${bestMatch.id}` },
            uri: `spotify:artist:${bestMatch.id}`,
            followers: {
                total: bestMatch.followers?.total ?? 0,
                href: bestMatch.followers?.href ?? null,
            },
            genres: bestMatch.genres ?? [],
            images: normalizeImages(bestMatch.images),
        };

        results.push(normalized);
    });

    await Promise.all(promises);

    // Deduplicate by id
    const uniqueResults = Array.from(new Map(results.map((a) => [a.id, a])).values());

    // Sort by popularity descending
    uniqueResults.sort((a, b) => b.popularity - a.popularity);

    return uniqueResults;
}


interface SpotifyArtist {
    id: string;
    name: string;
    followers: { total: number };
    popularity: number;
    genres?: string[];
    images?: { url: string; height?: number; width?: number }[];
    [key: string]: any;
}

/**
 * Fetch artists by genre slug, filter by genre keywords,
 * ensure at least `minResults` results (fetch more pages if necessary)
 */
export async function getArtistsByGenre(
    genreSlug: string,
    minResults = 10,
    market = "DK",
    maxTries = 5,
    limitPerPage = 50
): Promise<ArtistFull[]> {
    // Convert slug to a readable genre string
    const genreQuery = formatGenreQuery(genreSlug) // "heavy_metal" → "heavy metal"
    let offset = 0;
    let results: SpotifyArtist[] = [];
    let tries = 0;

    while (results.length < minResults && tries < maxTries) {
        const data: any = await fetchFromSpotify(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                genreQuery
            )}&type=artist&market=${market}&limit=${limitPerPage}&offset=${offset}`,
            { revalidate: 3600 }
        );

        if (!data.artists?.items?.length) break;

        const matchesGenre = (artistGenre: string, query: string) => {
            // \b = word boundary
            // 'i' = case-insensitive
            const regex = new RegExp(`\\b${query}\\b`, "i");
            return regex.test(artistGenre);
        };

        // Filter artists by genre matching the full query string
        const filtered = data.artists.items.filter((artist: SpotifyArtist) => {
            if (!artist.genres?.length) return false;
            return artist.genres.some((g) => matchesGenre(g, genreQuery));
        });

        results.push(...filtered);

        // If fewer than limitPerPage returned, no more results
        if (data.artists.items.length < limitPerPage) break;

        offset += limitPerPage;
        tries++;
    }

    // Deduplicate by id
    const uniqueResults: SpotifyArtist[] = Array.from(
        new Map(results.map((a) => [a.id, a])).values()
    );

    // Sort by followers (most popular first)
    uniqueResults.sort((a, b) => (b.followers?.total ?? 0) - (a.followers?.total ?? 0));

    return uniqueResults.map((artist): ArtistFull => ({
        ...artist,
        type: "artist",
        href: `https://api.spotify.com/v1/artists/${artist.id}`,
        external_urls: { spotify: `https://open.spotify.com/artist/${artist.id}` },
        uri: `spotify:artist:${artist.id}`,
        followers: {
            total: artist.followers?.total ?? 0,
            href: null,
        },
        genres: artist.genres ?? [],
        images: normalizeImages(artist.images),
    }));
}

export async function getCurrentUser() {
    return fetchFromSpotify("https://api.spotify.com/v1/me");
}