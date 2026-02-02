import MediaSection from "@/app/_components/media_comps/MediaSection";
import ArtistGridGenre from "./ArtistGridGenre";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { ArtistFull } from "@/types/spotify";

interface GenrePageProps {
  params: { id: string };
}

const PAGE_SIZE = 50; // max per batch

export default async function GenrePage({ params }: GenrePageProps) {
  const resolvedParams = await params;
  const genreSlug = resolvedParams.id;

  if (!genreSlug) return <p>No genre selected.</p>;

  // Fetch artists via DAL
  const initialArtists: ArtistFull[] = await getArtistsByGenre(
    genreSlug,
    PAGE_SIZE,
    "DK", // market
    5,    // max tries
    PAGE_SIZE // limit per page
  );

  /*console.log(initialArtists) */

  if (!initialArtists.length) {
    return (
      <MediaSection title={`Popular ${formatGenreQuery(genreSlug)} artists`}>
        <p className="text-sm text-iplay-white/60 font-dm-sans">No artists found for this genre.</p>
      </MediaSection>
    );
  }

  return (
    <MediaSection title={`Popular ${formatGenreQuery(genreSlug)} artists`}>
      <p className="text-sm text-iplay-white/60 font-dm-sans">
        Showing {initialArtists.length} result{initialArtists.length > 1 ? "s" : ""}
      </p>

      <ArtistGridGenre initialArtists={initialArtists} />
    </MediaSection>
  );
}