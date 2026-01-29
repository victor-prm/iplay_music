"use client";

import { useEffect, useState } from "react";
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { myCategories } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { UpToFour, MediaImage } from "@/types/components";

export default function GenreSection() {
  const [items, setItems] = useState<MediaGridItem[]>([]);

  useEffect(() => {
    const randomCategories = [...myCategories]
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    const targetArtistsPerCategory = 3;

    // Fetch each category one by one, appending items as they load
    randomCategories.forEach(async (cat) => {
      const artists = await getArtistsByGenre(cat, targetArtistsPerCategory);
      const selected = artists.slice(0, targetArtistsPerCategory);
      if (!selected.length) return;

      const images = selected
        .map(a => a.images?.[0])
        .filter(Boolean)
        .slice(0, 4) as UpToFour<MediaImage>;

      const newItem: MediaGridItem = {
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

      // Append the item to state
      setItems(prev => [...prev, newItem]);
    });
  }, []);

  // Placeholders to preserve grid layout
  const placeholders = Array.from({ length: 12 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: "",
    images: [] as UpToFour<MediaImage>,
    meta: null,
    href: "#",
    type: "genre",
  }));

  return (
    <MediaSection title="Browse genres">
      <MediaGrid
        items={items.length ? items : placeholders}
        loadingShape="wide"
      />
    </MediaSection>
  );
}