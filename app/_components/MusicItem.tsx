import Link from "next/link";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

interface MusicItemProps {
  res: any;
  onSelect: () => void;
}

export default function MusicItem({ res, onSelect }: MusicItemProps) {
  const item = res.item;

  function getResultMeta(res: any): string | null {
    if (res.type === "album" || res.type === "track") {
      return res.item.artists?.[0]?.name ?? null;
    }

    if (res.type === "playlist") {
      return res.item.owner?.display_name ?? null;
    }

    return null;
  }

  const meta = getResultMeta(res);
  const thumbnail =
    res.type === "track"
      ? item.album?.images?.[0]
      : item.images?.[0];

  return (
    <li className="p-1 odd:bg-white/10 rounded-sm my-1">
      <Link href={`/${res.type}/${item.id}`} onClick={onSelect}>
        <article className="flex items-center gap-2">
          {thumbnail ? (
            <Image
              src={thumbnail.url}
              alt={item.name}
              width={64}
              height={64}
              className="size-12 object-cover rounded-sm border border-white/10"
            />
          ) : (
            <figure className="size-12 grid place-items-center rounded-sm border border-white/10 bg-iplay-plum">
              <FaMusic className="size-5 text-iplay-pink/33" />
            </figure>
          )}

          <hgroup className="flex flex-col">
            <h3 className="font-poppins">{item.name}</h3>
            <small className="font-dm-sans capitalize opacity-50">
              {res.type}
              {meta && <> • <span className="normal-case">{meta}</span></>}
            </small>
          </hgroup>
        </article>
      </Link>
    </li>
  );
}