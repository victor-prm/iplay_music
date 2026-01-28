import { FaMusic } from "react-icons/fa";

export default function MediaFigureFallback() {
  return (
    <figure className="size-10 aspect-square grid place-items-center rounded-sm border border-white/10 bg-iplay-plum">
      <FaMusic className="size-[50%] text-iplay-pink/33" />
    </figure>
  );
}