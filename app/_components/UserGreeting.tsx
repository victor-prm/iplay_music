// app/_components/Greeting.tsx
import { getCurrentUser } from "../_lib/dal";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "../_utils/helpers";
import { FaRegUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdMoneyOffCsred } from "react-icons/md";
import { GiSevenPointedStar } from "react-icons/gi";

import { UpToFour, MediaImage } from "@/types/components";
import Image from "next/image";

export default async function UserGreeting() {
  const user: SpotifyApi.CurrentUsersProfileResponse = await getCurrentUser();

  const country = user.country ?? "unknown";
  const followers = user.followers?.total ?? 0;
  const isPremium = user.product === "premium";

  const images = (
    spotifyImagesToMediaImages(
      user.images,
      user.display_name ?? "Spotify user"
    ) ?? []
  ).slice(0, 1) as UpToFour<MediaImage>;

  return (
    <section className="flex items-center gap-4">
      <MediaFigure
        images={images}
        fallbackIcon={FaRegUser}
        fallbackClassName="size-14 rounded-full"
        fallbackIconClassName="text-white/50"
      />

      <hgroup className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-poppins text-iplay-white">
          Welcome back, {user.display_name ?? "Spotify user"}!
        </h2>
        <p className="text-sm text-iplay-white/70 font-dm-sans flex items-center gap-4">
          {isPremium ? (
            <small className="flex gap-1 items-center">
              <GiSevenPointedStar className="inline size-4 text-iplay-pink" />
              Premium user
            </small>
          ) : (
            <small className="flex gap-1 items-center">
              <MdMoneyOffCsred className="inline size-4 text-iplay-pink"/>
              Free user
            </small>
          )}
          {(<small className="flex gap-1 items-center">
            <FaPeopleGroup className="inline size-4 text-iplay-pink" />
            {followers.toLocaleString()} follower{followers !== 1 ? "s" : ""}
          </small>)}

          {country && (
            <small className="flex gap-1 items-center">
              <Image
                src={`https://flagsapi.com/${country}/flat/32.png`}
                alt={country}
                width={20}
                height={20}
                className="rounded-sm inline size-4"
              />
              {country}
            </small>
          )}
        </p>
      </hgroup>
    </section>
  );
}