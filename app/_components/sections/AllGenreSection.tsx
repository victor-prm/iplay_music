"use client";

import GenrePill from "../GenrePill";
import MediaSection from "../media_comps/MediaSection";
import { handpickedGenres } from "@/app/_data/static";

interface AllGenreSectionProps {
  genres?: string[];
  title?: string;
  fallbackToDefault?: boolean; // <-- new flag
}

export default function AllGenreSection({
  genres,
  title,
  fallbackToDefault = true,
}: AllGenreSectionProps) {
  const displayGenres =
    genres && genres.length
      ? genres
      : fallbackToDefault
      ? handpickedGenres
      : [];

  // If no genres to display, optionally return null to skip rendering
  if (displayGenres.length === 0) return null;

  const sectionTitle =
    title ?? (genres && genres.length ? "Genres" : "Browse genres");

  return (
    <MediaSection title={sectionTitle} isLoading={false}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {displayGenres.map((genre) => (
          <GenrePill
            key={genre}
            genre={genre}
            href={`/genre/${genre.replaceAll(" ", "_").toLowerCase()}`}
          />
        ))}
      </div>
    </MediaSection>
  );
}