import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import MediaSection from "@/app/_components/media_comps/MediaSection";
import { fetchFromSpotify } from "@/app/_lib/dal";
import type { UpToFour, MediaImage } from "@/types/components";

interface EraPageProps {
    params: { id: string };
}

export default async function EraPage({ params }: EraPageProps) {
    const { id: eraId } = await params;
    if (!eraId) return <p>Invalid era</p>;

    const startYear = parseInt(eraId, 10);
    if (isNaN(startYear)) return <p>Invalid era</p>;
    const endYear = startYear + 9;

    // Step 1: fetch albums for the decade
    const data = await fetchFromSpotify(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            `year:${startYear}-${endYear}`
        )}&type=album&limit=36&market=DK`
    ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

    if (!data.albums.items.length) {
        return (
            <MediaSection title={`Artists from the ${startYear}s`}>
                <p className="text-sm text-iplay-white/50">No artists found for this era.</p>
            </MediaSection>
        );
    }

    // Step 2: collect unique artist IDs (first artist of each album)
    const artistIds = Array.from(
        new Set(data.albums.items.map(album => album.artists[0]?.id).filter(Boolean))
    );

    // Step 3: fetch full artist info in batches of 50 (Spotify limit)
    const artistsFull: SpotifyApi.ArtistObjectFull[] = [];
    for (let i = 0; i < artistIds.length; i += 50) {
        const batch = artistIds.slice(i, i + 50);
        const resp = await fetchFromSpotify(
            `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`
        ) as { artists: SpotifyApi.ArtistObjectFull[] };
        artistsFull.push(...resp.artists);
    }

    // Step 4: sort artists by followers descending
    artistsFull.sort((a, b) => (b.followers?.total ?? 0) - (a.followers?.total ?? 0));

    // Step 5: map to MediaGridItem
    const gridItems: MediaGridItem[] = artistsFull.map(artist => ({
        id: artist.id,
        title: artist.name,
        href: `/artist/${artist.id}`,
        type: "artist",
        meta: `${artist.followers?.total.toLocaleString()} followers`,
        images: artist.images?.[0]
            ? [
                {
                    url: artist.images[0].url,
                    width: artist.images[0].width,
                    height: artist.images[0].height,
                    alt: `${artist.name} image`,
                },
            ]
            : [],
    }));

    return (
        <MediaSection title={`Artists from the ${startYear}s`}>
            <MediaGrid
                items={gridItems.map(item => ({ ...item, loading: false }))}
            />
        </MediaSection>
    );
}