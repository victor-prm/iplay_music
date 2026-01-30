import FeaturedGenreSection from "../_components/sections/FeaturedGenreSection";
import AllGenreSection from "../_components/sections/AllGenreSection";
import RecentSection from "@/app/_components/sections/RecentSection";
import UserGreeting from "../_components/UserGreeting";
import EraSection from "../_components/sections/EraSection";
import CountrySection from "../_components/sections/CountrySection";


export default function Home() {
  return (
    <>
      <UserGreeting />
      <RecentSection />
      <FeaturedGenreSection />
      <EraSection />
      <AllGenreSection />
      <CountrySection />
    </>
  );
}