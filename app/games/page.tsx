import OurOrginalGames from "@/components/game-categories/OurOrginalGames";
import UpcomingGames from "@/components/game-categories/UpcomingGames";


export default function Games() {
  return (
    <div className="bg4-[#0F1226] text-slate-200 rounded-md mb-[70px]">
      <div className="max-w-7xl mx-auto space-y-2">
        <OurOrginalGames/>
        <UpcomingGames/>
      </div>
    </div>
  );
}
