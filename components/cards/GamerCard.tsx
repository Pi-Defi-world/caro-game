

"use client";

import { IGame } from "@/redux/slices/games";
import { UsersThree } from "@phosphor-icons/react";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function GamerCard({ game,isUpComing }: { game: IGame,isUpComing?:boolean }) {
  const router = useRouter();

  return (
    <div
      className="flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-105 "
      onClick={() => router.push(game.url)}
    >
      <div className="relative aspect-[3.5/4] shadow-[2px_2px_1px_gray] overflow-hidden rounded-xl cursor-pointer bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
        {/* <p>Up</p> */}
        <img
          src={game.image}
          alt={game.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 inset-0 bg-gradient-to-t from-black/1000 to-transparent" />
         <div className="absolute bottom-0 p-2 right-0 left-0">
            {/* {!isUpComing && <h3 className="font-semibold text-xl text-white mb-0 font-luckyGuy">
              {game.name}
            </h3>} */}
            <div className="flex justify-between  items-center w-[100%]">
               <p className="text-sm text-white/80">{game.provider}</p>
              {/* { !isUpComing && <div className="flex items-center space-x-1">
                <span className="bg-green-600 w-2 h-2 rounded-full"></span>
                <Users className="w-3 h-3 text-green-600" />
                <p className="text-sm text-white/80 text-[10px]">245</p>
              </div>} */}
            </div>
          </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100" />
      </div>
    </div>
  );
}

