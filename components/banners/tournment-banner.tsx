"use client"

import { Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function TournamentBanner() {
 const [isStartBattleLoading, setIsStartBattleLoading] = useState(false)
 const [isStartBattleTommorow, setIsStartBattleTommorow] = useState(false)

 useEffect(()=>{
  if (isStartBattleLoading) {
    const timer = setTimeout(() => {
      setIsStartBattleLoading(false)
      setIsStartBattleTommorow(true)
    }, 2000)
    return () => clearTimeout(timer)
  }
  if (isStartBattleTommorow) {
    const timer = setTimeout(() => {
      setIsStartBattleTommorow(false)
    }, 2000)
    return () => clearTimeout(timer)
  }
 },[isStartBattleLoading, isStartBattleTommorow])

 return (
  <div className="relative h-ful overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 p-3 shadow-2xl">
    <div
            className="absolute right-0 top-1/2  -translate-y-1/2 w-full md:w-[120px] h-[110%] bg-[url('/tr3.png')] bg-cover bg-no-repeat opacity-20"
          ></div>
   <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
    
    <div className="mb-2 sm:text-sm md:mb-0 md:text-left">
     <h2 className="mb-2 text-2xl font-extrabold text-white drop-shadow-lg">Tournament Mode</h2>
     <p className="text-white mb-3 max-w-md">
      Battle players, climb ranks, and earn bigger Pi rewards in tournaments.
     </p>
     <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
      <Button
       size="sm"
       onClick={() => setIsStartBattleLoading(true)}
       className="bg-yellow-500 text-purple-900 hover:bg-yellow-400 font-bold"
      >
       {isStartBattleLoading ? "Coming soon..." :
        isStartBattleTommorow ? "Come back tomorrow" : <>
         <Swords className="mr-2 h-5 w-5" /> Join Now
        </>
       }
      </Button>
     </div>
    </div>
   </div>
  </div>
 )
}
