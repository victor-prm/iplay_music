import { fetchFromSpotify, getFilteredPlaylists } from "./_lib/actions";
import { buildGenreQuery } from "./_utils/helpers";

export default async function Home() {
  "use client"

  // 1️⃣ Search for playlists
  /*  "https://api.spotify.com/v1/search?q=pop&type=playlist&limit=20" */
  /*  `https://api.spotify.com/v1/search?q=${buildGenreQuery("rock")}&type=artist&limit=20` */
  /*  `https://api.spotify.com/v1/me/shows?offset=0&limit=20`*/
  /*  `https://api.spotify.com/v1/me/playlists` */

  const searchData: any = await fetchFromSpotify(
`https://api.spotify.com/v1/search?q=genre:rock&type=artist&limit=20&market=DK`
  );

  // 2️⃣ Get the array of playlists
  const searchResults = searchData.playlists?.items || [];

  // 3️⃣ Filter playlists
  const data = await getFilteredPlaylists(searchResults, 20, 10);

  //console.log(data);
  console.log(searchData)

  return <h1>Home</h1>;
}