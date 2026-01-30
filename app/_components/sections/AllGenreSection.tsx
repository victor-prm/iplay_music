"use client";

import GenrePill from "../GenrePill";
import MediaSection from "../media_comps/MediaSection";
import { handpickedGenres } from "@/app/_data/static";

interface AllGenreSectionProps {
  genres?: string[];
  title?: string;
}

export default function AllGenreSection({ genres, title }: AllGenreSectionProps) {
  const displayGenres = genres?.length ? genres : handpickedGenres;
  const sectionTitle = title ?? "Browse genres";

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