import { ImageObject } from "@/types/spotify";

export function buildGenreQuery(genre: string) {
  // Wrap in quotes and URL-encode only the genre itself
  return `genre:"${encodeURIComponent(genre)}"`;
}

export function formatGenreQuery(genre: string) {
  return genre.replaceAll(/_/g, " ").replaceAll("%26", "&");
}

export function normalizeImages(images?: { url: string; height?: number; width?: number }[]): ImageObject[] {
  if (!images) return [];
  return images.map(img => ({
    url: img.url,
    height: img.height ?? undefined,
    width: img.width ?? undefined,
  }));
}

export function abbreviateNumber(value: number) {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}