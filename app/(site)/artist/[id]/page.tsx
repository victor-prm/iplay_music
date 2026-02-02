import { AlbumFull, TrackFull, ArtistFull } from "@/types/spotify";
import { abbreviateNumber, formatDate } from "@/app/_utils/helpers";

import MediaHero from "@/app/_components/media_comps/MediaHero";
import MediaSection from "@/app/_components/media_comps/MediaSection";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import TrackList from "@/app/_components/TrackList";
import AllGenreSection from "@/app/_components/sections/AllGenreSection";
import { getAllAlbumsForArtist, fetchFromSpotify } from "@/app/_lib/dal";

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id: artistId } = await params;
  if (!artistId) throw new Error("Artist ID is required");

  const albumsByGroup = await getAllAlbumsForArtist(artistId, [
    "album",
    "single",
    "compilation",
    "appears_on",
  ]);

  const artistInfo: ArtistFull = await fetchFromSpotify(
    `https://api.spotify.com/v1/artists/${artistId}?market=DK`
  );

  const topTracksData: { tracks: TrackFull[] } = await fetchFromSpotify(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=DK`
  );
  const topTracks: TrackFull[] = topTracksData.tracks || [];

  const groupTitles: Record<string, string> = {
    album: "Albums",
    single: "Singles",
    compilation: "Compilations",
    appears_on: "Appears On",
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Artist Hero */}
      <MediaHero title={artistInfo.name} images={artistInfo.images}>
        <p className="font-dm-sans opacity-70">
          {artistInfo.followers.total > 0 && abbreviateNumber(artistInfo.followers.total)} followers
        </p>
      </MediaHero>

      {/* Top Tracks */}
      {topTracks.length > 0 && (
        <TrackList
          title="Popular songs"
          discs={[{ discNumber: 1, tracks: topTracks }]}
        />
      )}

      {/* Genres */}
      <AllGenreSection
        genres={artistInfo.genres}
        fallbackToDefault={false}
        title={`Genres for ${artistInfo.name}`}
      />

      {/* Albums / Singles / Compilations / Appears On */}
      {Object.entries(albumsByGroup).map(([group, items]) =>
        items.length > 0 ? (
          <MediaSection
            key={group}
            title={groupTitles[group] || group}
            isLoading={false}
          >
            <MediaGrid
              variant="horizontal"
              items={items.map<MediaGridItem>((album: AlbumFull) => ({
                id: album.id,
                title: album.name,
                images: album.images?.length ? [album.images[0]] : undefined,
                href: `/album/${album.id}`,
                type: "album",
                meta: album.release_date ? formatDate(album.release_date, "day") : undefined,
              }))}
              loadingShape="wide"
              minLoadingMs={0}
            />
          </MediaSection>
        ) : null
      )}
    </div>
  );
}