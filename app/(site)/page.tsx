import GenreSection from "@/app/_components/sections/GenreSection";
import RecentSection from "@/app/_components/sections/RecentSection";
import UserGreeting from "../_components/UserGreeting";

export default function Home() {
  return (
    <>
      <UserGreeting />
      <GenreSection />
      <RecentSection />
    </>
  );
}