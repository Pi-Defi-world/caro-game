"use client"

import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useAppSelector } from "@/redux/hooks";
import GamerCard from "../cards/GamerCard";

export default function UpcomingGames() {
  const {upcomingGames} = useAppSelector(state => state.game)
  return (
    <div>
      {upcomingGames.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-yellow-400">
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                <path d="M12 7v5l3 3"></path>
              </svg>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Upcoming Games</h2>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 pb-4">
              {upcomingGames.map((game) => <GamerCard game={game} key={game.id} isUpComing={true}/>)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
