// app/_components/Greeting.tsx
import { getCurrentUser } from "../_lib/dal";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "../_utils/helpers";
import { FaRegCircleUser } from "react-icons/fa6";

export default async function UserGreeting() {
  const user: SpotifyApi.CurrentUsersProfileResponse = await getCurrentUser();

  const country = user.country ?? "unknown";
  const followers = user.followers?.total ?? 0;
  const isPremium = user.product === "premium";

  const images = spotifyImagesToMediaImages(
    user.images,
    user.display_name ?? "Spotify user"
  );

  return (
    <section className="flex items-center gap-4">
      <MediaFigure
        images={images}
        fallbackIcon={FaRegCircleUser}
        fallbackClassName="size-14 rounded-full"
        fallbackIconClassName="text-white/50"
      />

      <hgroup className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-poppins text-iplay-white">
          Welcome back, {user.display_name ?? "Spotify user"}!
        </h2>
        <p className="text-sm text-iplay-white/70 font-dm-sans">
          {isPremium ? "Premium user" : "Free user"} •{" "}
          {followers.toLocaleString()} follower{followers !== 1 ? "s" : ""} •{" "}
          {country}
        </p>
      </hgroup>
    </section>
  );
}