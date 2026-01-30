"use client";

import { useEffect, useState } from "react";
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { myCategories } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { UpToFour, MediaImage } from "@/types/components";

const PLACEHOLDER_COUNT = 6;

const placeholders: MediaGridItem[] = Array.from(
  { length: PLACEHOLDER_COUNT },
  (_, i) => ({
    id: `genre-slot-${i}`,
    title: "",
    images: undefined,
    meta: null,
    href: "#",
    type: "genre",
  })
);

export default function FeaturedGenreSection() {
  const [items, setItems] = useState<MediaGridItem[]>(placeholders);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const randomCategories = [...myCategories]
        .sort(() => Math.random() - 0.5)
        .slice(0, PLACEHOLDER_COUNT);

      const TARGET_ARTISTS = 3;

      const results = await Promise.all(
        randomCategories.map(async (cat) => {
          const artists = await getArtistsByGenre(cat, TARGET_ARTISTS);
          const selected = artists.slice(0, TARGET_ARTISTS);
          if (!selected.length) return null;

          const images = selected
            .map(a => a.images?.[0])
            .filter(Boolean)
            .slice(0, 4) as UpToFour<MediaImage>;

          return {
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
          } satisfies MediaGridItem;
        })
      );

      if (cancelled) return;

      setItems(prev => {
        const next = [...prev];
        results.forEach((item, i) => {
          if (item) next[i] = { ...next[i], ...item };
        });
        return next;
      });

      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MediaSection title="Discover genres" isLoading={isLoading}>
      <MediaGrid items={items} loadingShape="wide" minLoadingMs={0} />
    </MediaSection>
  );
}