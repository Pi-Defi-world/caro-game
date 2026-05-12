"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trophy, Award, Target, Swords, Star, Wallet, Coins, Timer } from "lucide-react"
import type { IUser } from "@/redux/slices/auth"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface UserProfileCardProps {
  user: IUser
  className?: string
}

export function UserProfileCard({ user, className }: UserProfileCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const avatar =
    "https://img.favpng.com/10/1/11/brawlhalla-portable-network-graphics-wiki-game-player-character-png-favpng-FfUV77Vj75YzA6NyNSGRuSPud.jpg"



  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const StatItem = ({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: React.ReactNode }) => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0"
    >
      <div className="flex items-center gap-2">
        {icon && <div className="w-4 h-4">{icon}</div>}
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", color)}
          />
        </div>
        <span className={cn("font-medium min-w-[70px] text-right text-sm", color)}>{value}</span>
      </div>
    </motion.div>
  )

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-6 border border-gray-700/50 shadow-lg transition-all duration-500",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Avatar and Basic Info */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          {/* Avatar with VIP Badge */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105">
              <Image src={avatar || "/placeholder.svg"} alt={user?.username || "User"} fill className="object-cover" />
            </div>
            {(user?.vipLevel?.level ?? 0) > 0 && (
              <div className="absolute -bottom-2 -right-2 bg-[#1d9bf0] rounded-full p-1.5 border-2 border-gray-700 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Username and Level */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{user.username}</h2>
              {(user?.vipLevel?.level ?? 0) > 0 && (
                <div className="relative group">
                  <div className="w-4 h-4 bg-[#1d9bf0] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-2.5 h-2.5 text-white"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  {/* <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-lg z-10">
                    VIP {user?.vipLevel?.level}
                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
                  </div> */}
                </div>
              )}
            </div>
            {/* <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="px-3 py-1 bg-[#1d9bf0]/20 rounded-full text-sm font-medium text-[#1d9bf0] border border-[#1d9bf0]/30">
                VIP {user?.vipLevel?.level || 0}
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Section - Game Stats */}
        {/* <div className="flex-1">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <div className="space-y-1">
              <StatItem 
                label="Wins" 
                value={gameStats.wins} 
                color="bg-green-500" 
                icon={<Swords className="w-3.5 h-3.5 text-green-400" />}
              />
              <StatItem 
                label="Losses" 
                value={gameStats.losses} 
                color="bg-red-500"
                icon={<Target className="w-3.5 h-3.5 text-red-400" />}
              />
              <StatItem 
                label="Win Rate" 
                value={gameStats.winRate} 
                color="bg-blue-500"
                icon={<Trophy className="w-3.5 h-3.5 text-blue-400" />}
              />
              <StatItem 
                label="Total Games" 
                value={gameStats.totalGames} 
                color="bg-purple-500"
                icon={<Timer className="w-3.5 h-3.5 text-purple-400" />}
              />
              <StatItem 
                label="Total Earned" 
                value={gameStats.totalEarnings} 
                color="bg-yellow-500"
                icon={<Wallet className="w-3.5 h-3.5 text-yellow-400" />}
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
