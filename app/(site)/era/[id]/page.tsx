import MediaSection from "@/app/_components/media_comps/MediaSection";
import ArtistGridEra from "./ArtistGridEra";
import { fetchFromSpotify } from "@/app/_lib/dal";

interface EraPageProps {
  params: { id: string };
}

const PAGE_SIZE = 36;

export default async function EraPage({ params }: EraPageProps) {
  const resolvedParams = await params;
  const eraId = resolvedParams.id;
  if (!eraId) return <p>Invalid era</p>;

  const startYear = parseInt(eraId, 10);
  if (isNaN(startYear)) return <p>Invalid era</p>;
  const endYear = startYear + 9;

  // Step 1: fetch albums for the decade
  const data = await fetchFromSpotify(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      `year:${startYear}-${endYear}`
    )}&type=album&limit=${PAGE_SIZE}&market=DK`
  ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

  if (!data.albums.items.length) {
    return (
      <MediaSection title={`Artists from the ${startYear}s`}>
        <p className="text-sm text-iplay-white/50">No artists found for this era.</p>
      </MediaSection>
    );
  }

  return (
    <MediaSection title={`Artists from the ${startYear}s`}>
      <p className="text-sm text-iplay-white/60">
        Showing {data.albums.items.length} results
      </p>

      <ArtistGridEra
        startYear={startYear}
        initialAlbums={data.albums.items}
        pageSize={PAGE_SIZE}
      />
    </MediaSection>
  );
}