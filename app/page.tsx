import AutoCarousel from "@/components/banners/banner-carousel";
import LiveGameHistory from "@/components/common/LiveGameHistory";
import OurOrginalGames from "@/components/game-categories/OurOrginalGames";
import RoomList from "@/components/RoomList";
import CaroLobby from "./games/caro/page";

export default function Home() {
  return (
   <div>

    {/* <PlatformCategoriesBanner/> */}
    {/* <RoomList/> */}
    <AutoCarousel/>
    {/* <TournamentBanner/> */}
    {/* <OurOrginalGames showAll={true} /> */}
    <CaroLobby/>
    <LiveGameHistory/>
   </div>
  );
}
