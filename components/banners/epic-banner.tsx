"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Swords, Users, Trophy, Coins, Clock, Info } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export default function EpicBattleBanner2() {
  const [isLoading, setIsLoading] = useState(false);
  const [isStartBattleLoading, setIsStartBattleLoading] = useState(false);
  const [isTomorrow, setIsTomorrow] = useState(false);
  const [isStartBattleTomorrow, setIsStartBattleTomorrow] = useState(false);
  const [showPrizeInfo, setShowPrizeInfo] = useState(false);
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Handle loading states with timeouts
  useEffect(() => {
    let timer:any;
    
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
        setIsTomorrow(true);
      }, 3000);
    }
    
    if (isTomorrow) {
      timer = setTimeout(() => {
        setIsTomorrow(false);
      }, 3000);
    }
    
    if (isStartBattleLoading) {
      timer = setTimeout(() => {
        setIsStartBattleLoading(false);
        setIsStartBattleTomorrow(true);
      }, 3000);
    }
    
    if (isStartBattleTomorrow) {
      timer = setTimeout(() => {
        setIsStartBattleTomorrow(false);
      }, 3000);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading, isTomorrow, isStartBattleLoading, isStartBattleTomorrow]);

  // Countdown timer
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 md:p-4 p-3 shadow-2xl mb-6"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url('/placeholder.svg?height=400&width=800')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1px)",
        }}
      />
    
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-start lg:justify-start mb-2">
            <Badge className="bg-yellow-400 text-purple-900 font-bold px-2 py-0.5 text-xs">
              LIVE NOW
            </Badge>
            <Badge className="ml-2 bg-purple-900 text-white px-3 py-0.5 text-xs">
              <Coins className="mr-1 h-3 w-3" />Get Pi Rewards
            </Badge>
          </div>
          
          <h2 className="mb-3 text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
          Play with Friend, Win Pi!
          </h2>
          
          <p className="mb-4 text-white/80 max-w-md">
            Play with friends or with others and earn Pi prizes daily!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Button
              size="sm"
              onClick={() => setIsStartBattleLoading(true)}
              className="bg-yellow-500 text-purple-900 hover:bg-yellow-400 font-bold transition-all duration-300 hover:scale-105"
              disabled={isStartBattleLoading || isStartBattleTomorrow}
            >
              {isStartBattleLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                </>
              ) : isStartBattleTomorrow ? (
                "Come back tomorrow"
              ) : (
                <>
                  <Swords className="mr-2 h-5 w-5" /> Start a Battle
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLoading(true)}
              className="bg-purple-800/50 text-white hover:bg-purple-700 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              disabled={isLoading || isTomorrow}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                </>
              ) : isTomorrow ? (
                "Come back tomorrow"
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" /> Challenge Friends
                </>
              )}
            </Button>
          </div>
        </div>

        <div
       className={`absolute right-5 w-[230px] animate-bounc h-[230px] bg-[url('/chat3.png')] bg-cover bg-no-repeat opacity-0 md:opacity-50`}
     ></div>
        
        {/* Tournament countdown */}
        {/* <div className="text-center bg-purple-900/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <div className="mb-2 text-lg font-semibold text-white flex items-center justify-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
            <span>Next Tournament Starts In:</span>
          </div>
          
          <div className="flex justify-center gap-2 mb-3">
            <div className="bg-purple-800 rounded-lg p-2 w-16 text-center">
              <div className="text-3xl font-bold text-yellow-300">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/70">HOURS</div>
            </div>
            
            <div className="bg-purple-800 rounded-lg p-2 w-16 text-center">
              <div className="text-3xl font-bold text-yellow-300">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/70">MINUTES</div>
            </div>
            
            <div className="bg-purple-800 rounded-lg p-2 w-16 text-center">
              <div className="text-3xl font-bold text-yellow-300">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/70">SECONDS</div>
            </div>
          </div>
          
          <div className="text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-yellow-300 hover:text-yellow-200"
                    onClick={() => setShowPrizeInfo(!showPrizeInfo)}
                  >
                    <Info className="h-4 w-4 mr-1" /> Prize Pool Details
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-purple-900 border-purple-700 text-white p-3 max-w-xs">
                  <p>1st Place: 100 Pi</p>
                  <p>2nd Place: 50 Pi</p>
                  <p>3rd Place: 25 Pi</p>
                  <p className="text-xs mt-2 text-white/70">
                    All participants receive 5 Pi just for playing!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {showPrizeInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 text-sm text-white/80 bg-purple-800/50 p-2 rounded"
            >
              <div className="flex justify-between mb-1">
                <span>1st Place:</span>
                <span className="font-bold text-yellow-300">100 Pi</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>2nd Place:</span>
                <span className="font-bold text-yellow-300">50 Pi</span>
              </div>
              <div className="flex justify-between">
                <span>3rd Place:</span>
                <span className="font-bold text-yellow-300">25 Pi</span>
              </div>
            </motion.div>
          )}
        </div> */}
      </div>
      
      {/* Live player count */}
      <div className="absolute bottom-2 right-2 text-xs text-white/70 flex items-center">
        <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
        <span>1,248 players online now</span>
      </div>
    </motion.div>
  );
}
