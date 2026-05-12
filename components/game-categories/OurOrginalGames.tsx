"use client"
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Gamepad, Gamepad2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import GamerCard from "../cards/GamerCard";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

interface OurOrginalGamesProps {
  showAll?: boolean;
}

export default function OurOrginalGames({ showAll }: OurOrginalGamesProps) {
  const {games} = useAppSelector(state => state.game)

  return (
    <div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Games
              </h2>
            </div>
            {showAll && <Link className="text-blue-600" href={"/games"}>See All</Link>}
          </div>
          {/* <ScrollArea> */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pb-4">
              {games.map((game) => (
                <GamerCard game={game} key={game.id} />
              ))}
            </div>
            {/* <ScrollBar orientation="horizontal" /> */}
          {/* </ScrollArea> */}
        </div>
    </div>
  );
}
