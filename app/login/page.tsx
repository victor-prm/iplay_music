const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=playlist-read-private`


export default function Page() {
    return (
        <a href={url} className="font-headline">
            Log in with Spotify
        </a>
    )
}