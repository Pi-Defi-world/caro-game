import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Gamepad2, Loader2, Swords } from "lucide-react";

export default function PlatformCategoriesBanner() {
  return (
    <div className="mb- grid gap-4 md:grid-cols-1">
      <Link href="/games">
        <div className="rounded-xl relative bg-gradient-to-r from-purple-600 to-purple-800 p-3 md:p-6">
        <h2 className="mb-3 text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
          Play with Friend, Win Pi!
          </h2>
          <p className="text-white/70">
            Play,Challenge friends or visitors and earn Pi as prize as you win game!
          </p>
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] md:w-[120px] h-[110%] bg-[url('/chat3.png')] bg-cover bg-no-repeat opacity-100 z-50"
          ></div>
          <Button
              size="sm"
              // onClick={() => setIsStartBattleLoading(true)}
              className="bg-yellow-500 mt-1 text-purple-900 hover:bg-yellow-400 font-bold transition-all duration-300 hover:scale-105"
              // disabled={isStartBattleLoading || isStartBattleTomorrow}
            >
              
  
                  <Gamepad2 className="mr-2 h-5 w-5" /> Play Now
             
            </Button>
        </div>
      </Link>
      {/* <Link href="/">
        <div className="rounded-xl relative bg-gradient-to-r from-[#F7931A] to-yellow-500 p-3 md:p-6 flex flex-col items-cente">
          <h2 className="mb-2 text-3xl font-bold text-white">Peer Betting</h2>
          <p className="text-white/70">
            Peer-to-peer betting with Pi payment for community and competition.
          </p>
        </div>
      </Link> */}
    </div>
  );
}
