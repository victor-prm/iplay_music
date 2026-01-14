export function buildGenreQuery(genre: string) {
  // Wrap in quotes and URL-encode only the genre itself
  return `genre:"${encodeURIComponent(genre)}"`;
}