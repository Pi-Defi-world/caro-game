"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Swords, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EpicBattleBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [isStartBattleLoading, setIsStartBattleLoading] = useState(false);
  const [isTommorow, setIsTommorow] = useState(false);
  const [isStartBattleTommorow, setIsStartBattleTommorow] = useState(false);
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(()=>{

    if(isLoading){
      setTimeout(()=>{
        setIsLoading(false)
        setIsTommorow(true)
      },3000)
    }
    if(isTommorow){
      setTimeout(()=>{
        setIsTommorow(false)
      },3000)
    }
    if(isStartBattleLoading){
      setTimeout(()=>{
        setIsStartBattleLoading(false)
        setIsStartBattleTommorow(true)
      },3000)
    }
    if(isStartBattleTommorow){
      setTimeout(()=>{
        setIsStartBattleTommorow(false)
      },3000)
    }
    
  },[isLoading,isTommorow,isStartBattleLoading])
  

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-4 shadow-2xl mb-4">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/placeholder.svg?height=400&width=800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 sm:text-sm md:mb-0 text-center md:text-left">
          <h2 className="mb-2 text-xl  font-extrabold text-white drop-shadow-lg">
            Challenge a Friend, Win Pi!
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              size="lg"
              onClick={()=> setIsStartBattleLoading(true)}
              className="bg-yellow-500 text-purple-900 hover:bg-yellow-400 font-bold"
            >
              {
                isStartBattleLoading ? "Coming soon..." :
                isStartBattleTommorow ? "come back tomorrow" : <>
                <Swords className="mr-2 h-5 w-5" /> Start a Battle
                </>
              }
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={()=> setIsLoading(true)}
              className="bg-purple-800 text-white hover:bg-purple-700 border-white"
            >
               {
                isLoading ? "Coming soon..." :
                isTommorow ? "come back tomorrow" : <>
                <Users className="mr-2 h-5 w-5" /> Challenge Friends
                </>
               }
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              onClick={()=> router.push("/friends")}
              className="bg-purple-800 text-white hover:bg-purple-700 border-white"
            >
              <Users className="mr-2 h-5 w-5" /> Challenge Friends
            </Button> */}
          </div>
        </div>
        {/* <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-white">
            Next Tournament Starts In:
          </div>
          <div className="text-4xl font-bold text-yellow-300 mb-4">
            {`${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
              .toString()
              .padStart(2, "0")}:${timeLeft.seconds
              .toString()
              .padStart(2, "0")}`}
          </div>
        </div> */}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-70"></div>
    </div>
  );
}
