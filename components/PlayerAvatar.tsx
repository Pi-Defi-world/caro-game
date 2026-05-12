"use client"

import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { gsap } from "gsap"
import { useAppSelector } from "@/redux/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import ThinkingDots from "./ThinkingDot"
import { Clock } from "lucide-react"
import { Crown } from "lucide-react"

interface PlayerAvatarProps {
  username: string
  symbol: string
  isYourTurn: boolean
  onTimerEnd: () => void
  className?: string
  hasStarted: boolean
  message?: string
  isPaused?: boolean
}

export default function PlayerAvatar({
  username,
  symbol,
  isYourTurn,
  onTimerEnd,
  className,
  hasStarted,
  message,
  isPaused = false,
}: PlayerAvatarProps) {
  const [timeLeft, setTimeLeft] = useState(25)
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { currentUser } = useAppSelector((state) => state.auth)
  const { myPets } = useAppSelector((state) => state.pets)
  const isUser = currentUser?.username === username

  // Fixed 25 seconds for all players
  const baseTime = 25

  // Responsive sizing functions
  const getTimerSize = () => {
    if (isMobile) return "w-16 h-16"
    return "w-20 h-20"
  }

  const getAvatarSize = () => {
    if (isMobile) return "w-12 h-12"
    return "w-14 h-14"
  }

  const getSymbolSize = () => {
    if (isMobile) return "w-5 h-5"
    return "w-6 h-6"
  }

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isYourTurn && hasStarted) {
      setTimeLeft(baseTime)
      setProgress(100)

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          setProgress((newTime / baseTime) * 100)

          if (newTime <= 0) {
            clearInterval(timer)
            // Fix: Wrap onTimerEnd in setTimeout to defer the call until after render
            setTimeout(() => {
              onTimerEnd()
            }, 0)
          }

          return newTime > 0 ? newTime : 0
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isYourTurn, onTimerEnd, hasStarted, baseTime])



  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000) // Extended visibility time for better readability

      return () => clearTimeout(timer)
    }
  }, [message])

  // Calculate if the message should appear on the left instead of right
  // This helps with positioning for players on different sides of the screen
  const showOnLeft = className?.includes("right") || false

  return (
    <div className={cn("relative mt-4 flex items-center justify-center", className)}>
      {/* Timer Circle */}
      {hasStarted && !isPaused && (
        <svg 
          className={cn("absolute -rotate-90", getTimerSize())} 
          viewBox="0 0 100 100" 
          aria-hidden="true"
        >
          <circle 
            className="stroke-gray-600/30" 
            cx="50" 
            cy="50" 
            r="40" 
            strokeWidth="4" 
            fill="none" 
          />
          <circle
            className={cn(
              "transition-all duration-1000 ease-linear",
              isYourTurn 
                ? (timeLeft < 5 ? "stroke-red-500" : "stroke-cyan-500") 
                : "stroke-gray-500/50",
            )}
            cx="50"
            cy="50"
            r="40"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${progress * 2.51} 251`}
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Turn Indicator */}
      {isYourTurn && hasStarted && !isPaused && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Clock className="w-3 h-3 inline mr-1" />
          {timeLeft}s
        </motion.div>
      )}

      {/* Player Avatar */}
      <motion.div 
        className={cn("relative z-10 transition-all duration-300", getAvatarSize())}
        whileHover={{ scale: 1.05 }}
        animate={isYourTurn && !isPaused ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: isYourTurn && !isPaused ? Infinity : 0 }}
      >
        <Avatar
          className={cn(
            "w-full h-full border-2 shadow-lg transition-all duration-300",
            isPaused
              ? "border-gray-500/50 ring-2 ring-gray-300/50 shadow-gray-500/25"
              : isYourTurn 
                ? "border-cyan-500 ring-2 ring-cyan-300/50 shadow-cyan-500/25" 
                : "border-gray-700/50",
          )}
        >
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <Image src="/pet.png" alt={`${username}'s avatar`} layout="fill" className="object-cover" />
          </AvatarFallback>
        </Avatar>

        {/* Player Symbol */}
        <motion.div
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center rounded-full text-white font-bold shadow-md",
            getSymbolSize(),
            isPaused
              ? "bg-gray-500"
              : isYourTurn 
                ? "bg-cyan-500" 
                : "bg-gray-800",
          )}
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {symbol.toUpperCase()}
        </motion.div>

        {/* Crown for host */}
        {isUser && (
          <motion.div
            className={cn(
              "absolute -top-1 -left-1",
              isPaused ? "text-gray-400" : "text-yellow-400"
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Crown className="w-4 h-4" />
          </motion.div>
        )}
      </motion.div>

      {/* Username */}
      <motion.div 
        className={cn(
          "absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-md backdrop-blur-sm text-xs font-medium whitespace-nowrap shadow-lg",
          isPaused
            ? "bg-gray-600/90 text-gray-200"
            : "bg-gray-800/90 text-white"
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {isUser ? "You" : username}
      </motion.div>

      {/* Thinking Indicator */}
      {hasStarted && isYourTurn && !isPaused && (
        <motion.div 
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 z-20 px-2 py-1 rounded-full bg-gray-800/90 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <ThinkingDots className="text-cyan-400" />
        </motion.div>
      )}

      {/* Message Bubble */}
      <AnimatePresence>
        {isVisible && !isUser && message && (
          <motion.div
            ref={messageRef}
            className={cn("absolute z-30 max-w-[400px]", showOnLeft ? "right-full mr-3" : "left-full ml-3")}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {/* Message bubble pointer */}
              <div
                className={cn(
                  "absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rotate-45 bg-gradient-to-br from-gray-800 to-gray-900",
                  showOnLeft ? "right-[-6px]" : "left-[-6px]",
                )}
              />
              {/* Message bubble */}
              <div className={cn(
                "relative px-3 py-2 rounded-full shadow-xl border backdrop-blur-md",
                isPaused
                  ? "bg-gray-700 border-gray-600/50"
                  : "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50"
              )}>
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className={isPaused ? "text-gray-500" : "text-gray-400"} />
                  <p className={cn(
                    "text-sm max-w-[250px] lg:max-w-[350px] overflow-hidden text-ellipsis font-medium whitespace-nowrap",
                    isPaused ? "text-gray-400" : "text-white"
                  )}>
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
