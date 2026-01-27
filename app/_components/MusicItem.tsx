"use client";

import Link from "next/link";
import Image from "next/image";

import MediaFigureFallback from "./ MediaFigureFallback";
import type { SearchResult } from "@/types/components";
import { MusicItemProps } from "@/types/components";



export default function MusicItem({ res, onSelect }: MusicItemProps) {
  const meta = getResultMeta(res);
  const thumbnail = getThumbnail(res);
  const href = getHref(res);

  return (
    <li className="p-1 odd:bg-white/10 rounded-sm my-1">
      <Link href={href} onClick={onSelect}>
        <article className="flex items-center gap-2">
          {thumbnail ? (
            <Image
              src={thumbnail.url}
              alt={res.item.name}
              width={64}
              height={64}
              className="size-12 object-cover rounded-sm border border-white/10"
            />
          ) : (
            <MediaFigureFallback />
          )}

          <hgroup className="flex flex-col">
            <h3 className="font-poppins">{res.item.name}</h3>
            <small className="font-dm-sans capitalize opacity-50">
              {res.type}
              {meta && <> • <span className="normal-case">{meta}</span></>}
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

function getThumbnail(res: SearchResult) {
  switch (res.type) {
    case "track":
      return res.item.album?.images?.[0];
    case "album":
    case "playlist":
    case "artist":
      return res.item.images?.[0];
  }
}

function getHref(res: SearchResult) {
  if (res.type === "track") {
    return `/album/${res.item.album.id}?highlight=${res.item.id}`;
  }
  return `/${res.type}/${res.item.id}`;
}