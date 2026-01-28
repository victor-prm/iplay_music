import GenreSection from "@/app/_components/sections/GenreSection";
import RecentSection from "@/app/_components/sections/RecentSection";
import UserGreeting from "../_components/UserGreeting";
import EraSection from "../_components/sections/EraSection";

export default function Home() {
  return (
    <>
      <UserGreeting />
      <RecentSection />
      <GenreSection />
      <EraSection />
    </>
  );
}