import { ImageObject } from "@/types/spotify";

// Color palette
const COLORS = [
  "--color-iplay-grape",
  "--color-iplay-black",
  "--color-iplay-white",
  "--color-iplay-pink",
  "--color-iplay-coral",
  "--color-iplay-magenta",
  "--color-iplay-orange",
  "--color-iplay-yellow",
  "--color-iplay-lime",
  "--color-iplay-forest",
  "--color-iplay-teal",
  "--color-iplay-cyan",
  "--color-iplay-blue",
];

// Deterministic hash function
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Ensure deterministic unique selection
function getGradientColors(seed: string): [string, string] {
  const hash = hashString(seed);
  const firstIndex = hash % COLORS.length;
  let secondIndex = (Math.floor(hash / COLORS.length)) % COLORS.length;

  // ensure unique
  if (secondIndex === firstIndex) {
    secondIndex = (secondIndex + 1) % COLORS.length;
  }

  return [`var(${COLORS[firstIndex]})`, `var(${COLORS[secondIndex]})`];
}

/**
 * Returns a deterministic linear gradient for a given string.
 * If no angle is provided, the angle is derived from the string hash.
 */
export function backroundGradient(genre: string, angle?: number): string {
  const [color1, color2] = getGradientColors(genre);

  // Compute deterministic angle if not provided
  const finalAngle =
    angle !== undefined ? angle : hashString(genre) % 360;

  return `linear-gradient(${finalAngle}deg, ${color1}, ${color2})`;
}

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

export function formatDate(dateStr: string, precision?: "year" | "month" | "day") {
  const date = new Date(dateStr);
  if (precision === "year") {
    return date.getFullYear();
  } else if (precision === "month") {
    return date.toLocaleString(undefined, { year: "numeric", month: "long" });
  } else {
    // day precision
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}