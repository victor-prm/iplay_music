"use client";

import { useEffect, useState } from "react";
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import MediaGridSkeleton from "../media_comps/MediaGridSkeleton";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { myCategories } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { UpToFour, MediaImage } from "@/types/components";

export default function GenreSection() {
  const [items, setItems] = useState<(MediaGridItem | null)[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const randomCategories = [...myCategories]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);

      const targetArtistsPerCategory = 3;

      const genrePreviews: (MediaGridItem | null)[] =
        Array(randomCategories.length).fill(null);

      for (let i = 0; i < randomCategories.length; i++) {
        const cat = randomCategories[i];

        // Over-fetch slightly for robustness
        const artists = await getArtistsByGenre(
          cat,
          targetArtistsPerCategory
        );

        const selected = artists.slice(0, targetArtistsPerCategory);
        if (!selected.length) continue;

        const images = selected
          .map(a => a.images?.[0])
          .filter(Boolean)
          .slice(0, 4) as UpToFour<MediaImage>;

        genrePreviews[i] = {
          id: cat,
          title: formatGenreQuery(cat),
          images,
          meta: (
            <span className="text-xs opacity-70 line-clamp-2">
              {selected.map(a => a.name).join(" • ")}
              {artists.length > selected.length && (
                <span className="opacity-50"> etc.</span>
              )}
            </span>
          ),
          href: `/genre/${cat.replaceAll(" ", "_").toLowerCase()}`,
          type: "genre",
        };

        // incremental update
        setItems([...genrePreviews]);
      }
    }

    fetchData();
  }, []);

  return (
    <MediaSection title="Browse genres">
      {items === null ? (
        <MediaGridSkeleton />
      ) : items.every(i => i === null) ? (
        <p className="text-sm text-iplay-white/50">
          No genres available at this time.
        </p>
      ) : (
        <MediaGrid
          items={items.map(item =>
            item ??
            ({
              id: `loading-${Math.random()}`,
              title: "Loading...",
              images: [],
              meta: null,
              href: "#",
              type: "genre",
              loading: true,
            } as MediaGridItem)
          )}
        />
      )}
    </MediaSection>
  );
}