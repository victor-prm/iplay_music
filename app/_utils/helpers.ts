export function buildGenreQuery(genre: string) {
  // Wrap in quotes and URL-encode only the genre itself
  return `genre:"${encodeURIComponent(genre)}"`;
}

export function formatGenreQuery(genre: string) {
  return genre.replaceAll(/_/g, " ").replaceAll("%26", "&");
}