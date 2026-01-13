const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export default async function Page({ searchParams }: { [key: string]: string | string[] | undefined }) {
    const { code } = await searchParams;
    console.log("code___", code);

    if (!code) {
        return <h1>Invalid callback</h1>;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`
        },
        //Code is on-time use. If lost, have to regenerate
        body: `code=${code}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`
    })

    console.log("response", await response.json());


    return (
        <>
            <h1>Hello</h1>
        </>
    )
}