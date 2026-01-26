import { fetchFromSpotify, getFilteredPlaylists } from "./_lib/dal";
import { buildGenreQuery } from "./_utils/helpers";

export default async function Home() {

  // 1️⃣ Search for playlists
  /*  "https://api.spotify.com/v1/search?q=pop&type=playlist&limit=20" */
  /*  `https://api.spotify.com/v1/search?q=${buildGenreQuery("rock")}&type=artist&limit=20` */
  /*  `https://api.spotify.com/v1/me/shows?offset=0&limit=20`*/
  /*  `https://api.spotify.com/v1/me/playlists` */

  let genres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "blues",
    "chill",
    "classical",
    "country",
    "dance",
    "deep-house",
    "disco",
    "drum-and-bass",
    "dubstep",
    "edm",
    "electronic",
    "folk",
    "funk",
    "gospel",
    "grime",
    "hard-rock",
    "hip-hop",
    "house",
    "indie",
    "indie-pop",
    "j-pop",
    "jazz",
    "k-pop",
    "latin",
    "lo-fi",
    "metal",
    "pop",
    "punk",
    "r-n-b",
    "rap",
    "reggae",
    "reggaeton",
    "rock",
    "salsa",
    "singer-songwriter",
    "soul",
    "techno",
    "trance",
    "tropical-house",
    "vocal",
    "world-music"
  ]

  const searchData: any = await fetchFromSpotify(
    `https://api.spotify.com/v1/search?q=genre:soul&type=artist&market=DK&limit=20`
  );

  // 2️⃣ Get the array of playlists
  const searchResults = searchData.playlists?.items || [];

  // 3️⃣ Filter playlists
  const data = await getFilteredPlaylists(searchResults, 20, 10);

  //console.log(data);
 /*  console.log(searchData.artists.items) */

  return <h1>Home</h1>;
}