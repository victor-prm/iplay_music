"use client";

import Link from "next/link";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "@/app/_utils/helpers";
import type { SearchResult, MusicItemProps, UpToFour, MediaImage } from "@/types/components";

export default function MusicItem({ res, onSelect }: MusicItemProps) {
  const meta = getResultMeta(res);
  const href = getHref(res);

  // Ensure each image is cast to the exact MediaImage type from your module
  const rawImages = spotifyImagesToMediaImages(getImages(res), res.item.name) ?? [];
  const images: UpToFour<MediaImage> = rawImages
    .slice(0, 4)
    .map(img => ({
      url: img.url ?? "",
      alt: img.alt ?? "",
      width: img.width,
      height: img.height,
    })) as UpToFour<MediaImage>;

  return (
    <li className="p-1 odd:bg-white/10 rounded-sm my-1">
      <Link href={href} onClick={onSelect}>
        <article className="flex items-center gap-2">
          <div className="size-12 overflow-hidden rounded-sm border border-white/10">
            <MediaFigure images={images} />
          </div>

          <hgroup className="flex flex-col min-w-0">
            <h3 className="font-poppins truncate">{res.item.name}</h3>
            <small className="font-dm-sans capitalize opacity-50 truncate">
              {res.type}
              {meta && (
                <>
                  {" "}•{" "}
                  <span className="normal-case">{meta}</span>
                </>
              )}
            </small>
          </hgroup>
        </article>
      </Link>
    </li>
  );
}

function getResultMeta(res: SearchResult): string | null {
  switch (res.type) {
    case "artist":
      return null;
    case "album":
    case "track":
      return res.item.artists?.[0]?.name ?? null;
    case "playlist":
      return res.item.owner?.display_name ?? null;
  }
}

function getImages(res: SearchResult) {
  switch (res.type) {
    case "track":
      return res.item.album?.images;
    case "album":
    case "playlist":
    case "artist":
      return res.item.images;
  }
}

function getHref(res: SearchResult) {
  if (res.type === "track") {
    return `/album/${res.item.album.id}?highlight=${res.item.id}`;
  }
  return `/${res.type}/${res.item.id}`;
}