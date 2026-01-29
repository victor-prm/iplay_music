"use client";

import { useState, useEffect } from "react";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import { fetchFromSpotify } from "@/app/_lib/dal";

interface Props {
  startYear: number;
  initialAlbums: SpotifyApi.AlbumObjectSimplified[];
  pageSize: number;
}

export default function ArtistGridEra({ startYear, initialAlbums, pageSize }: Props) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [offset, setOffset] = useState(initialAlbums.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const endYear = startYear + 9;

  // Fetch full artists from a batch of albums
  const loadArtistsFromAlbums = async (albumBatch: SpotifyApi.AlbumObjectSimplified[]) => {
    const artistIds = Array.from(
      new Set(albumBatch.map(album => album.artists[0]?.id).filter(Boolean))
    );

    const fullArtists: SpotifyApi.ArtistObjectFull[] = [];
    for (let i = 0; i < artistIds.length; i += 50) {
      const batch = artistIds.slice(i, i + 50);
      const resp = await fetchFromSpotify(
        `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`
      ) as { artists: SpotifyApi.ArtistObjectFull[] };
      fullArtists.push(...resp.artists);
    }

    return fullArtists;
  };

  // ✅ Move initial fetch into useEffect
  useEffect(() => {
    const init = async () => {
      const full = await loadArtistsFromAlbums(initialAlbums);
      full.sort((a, b) => (b.followers?.total ?? 0) - (a.followers?.total ?? 0));
      setArtists(full);
    };

    if (!artists.length) {
      init();
    }
  }, [initialAlbums]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const data = await fetchFromSpotify(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        `year:${startYear}-${endYear}`
      )}&type=album&limit=${pageSize}&offset=${offset}&market=DK`
    ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

    const nextAlbums = data.albums.items ?? [];
    if (!nextAlbums.length) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setAlbums(prev => [...prev, ...nextAlbums]);
    setOffset(prev => prev + nextAlbums.length);

    const newArtists = await loadArtistsFromAlbums(nextAlbums);

    // Deduplicate by ID
    const uniqueArtists = Array.from(
      new Map([...artists, ...newArtists].map(a => [a.id, a])).values()
    );

    uniqueArtists.sort((a, b) => (b.followers?.total ?? 0) - (a.followers?.total ?? 0));
    setArtists(uniqueArtists);

    setLoading(false);
  };

  const items: MediaGridItem[] = artists.map(artist => ({
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
    <>
      <MediaGrid items={items.map(item => ({ ...item, loading: false }))} />

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-iplay-white/10 hover:bg-iplay-white/20 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}