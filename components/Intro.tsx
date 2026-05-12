"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Player {
  username: string
  avatar?: string
}

interface Room {
  players: Player[]
}

interface FightIntroProps {
  currentRoom: Room
  initialCountdown?: number
  onCountdownComplete?: () => void
}

const CountdownDigit = ({ digit }: { digit: number }) => {
  return (
    <div className="relative h-16 w-12 sm:h-20 sm:w-16 md:h-24 md:w-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-700/80 to-slate-900/80 rounded-xl border border-slate-500/40 shadow-2xl backdrop-blur-sm"></div>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0, scale: 1.3, rotateX: 90 }}
          animate={{ y: "0%", opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ y: "-100%", opacity: 0, scale: 0.7, rotateX: -90 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.6,
          }}
          className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-lg"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

const PlayerCard = ({
  player,
  isLeft,
  delay,
}: {
  player: Player
  isLeft: boolean
  delay: number
}) => {
  return (
    <motion.div
      initial={{
        x: isLeft ? "-100vw" : "100vw",
        opacity: 0,
        scale: 0.8,
        rotateY: isLeft ? -45 : 45,
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay,
        duration: 1.2,
      }}
      className={cn(
        "relative w-full max-w-[280px] sm:max-w-xs rounded-3xl overflow-hidden",
        "bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md",
        "border-2 shadow-2xl",
        isLeft ? "border-red-500/60" : "border-blue-500/60",
      )}
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute inset-0 opacity-30 blur-xl",
          isLeft
            ? "bg-gradient-to-br from-red-500 via-red-600 to-red-800"
            : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800",
        )}
      />

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 opacity-10",
            "bg-[radial-gradient(circle_at_50%_50%,transparent_40%,currentColor_41%,currentColor_60%,transparent_61%)]",
            isLeft ? "text-red-400" : "text-blue-400",
          )}
        />
      </div>

      {/* Player avatar */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: delay + 0.4,
        }}
        className="relative pt-6 pb-4 flex items-center justify-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              `0 0 20px 5px ${isLeft ? "rgba(239, 68, 68, 0.4)" : "rgba(59, 130, 246, 0.4)"}`,
              `0 0 40px 10px ${isLeft ? "rgba(239, 68, 68, 0.6)" : "rgba(59, 130, 246, 0.6)"}`,
              `0 0 20px 5px ${isLeft ? "rgba(239, 68, 68, 0.4)" : "rgba(59, 130, 246, 0.4)"}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className={cn(
            "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4",
            isLeft ? "border-red-400/70" : "border-blue-400/70",
          )}
        >
          <div
            className={cn(
              "w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white",
              isLeft ? "bg-gradient-to-br from-red-600 to-red-800" : "bg-gradient-to-br from-blue-600 to-blue-800",
            )}
          >
            {player?.username.charAt(0).toUpperCase()}
          </div>
        </motion.div>
      </motion.div>

      {/* Player info */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: delay + 0.6,
          duration: 0.8,
          ease: "easeOut",
        }}
        className="px-6 pb-6 text-center"
      >
        <h2
          className={cn(
            "text-xl sm:text-2xl font-bold truncate mb-2",
            "bg-clip-text text-transparent",
            isLeft
              ? "bg-gradient-to-r from-red-300 via-red-200 to-white"
              : "bg-gradient-to-r from-blue-300 via-blue-200 to-white",
          )}
        >
          {player.username}
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay + 0.8, duration: 0.6 }}
          className={cn(
            "h-1 rounded-full mx-auto mb-3",
            "w-16",
            isLeft ? "bg-gradient-to-r from-red-500 to-red-300" : "bg-gradient-to-r from-blue-500 to-blue-300",
          )}
        />
        <div className={cn("text-sm font-semibold tracking-wide", isLeft ? "text-red-300/90" : "text-blue-300/90")}>
          FIGHTER
        </div>
      </motion.div>
    </motion.div>
  )
}

const FloatingParticle = ({ delay, color }: { delay: number; color: string }) => {
  return (
    <motion.div
      initial={{
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        opacity: 0,
      }}
      animate={{
        y: -50,
        opacity: [0, 1, 0],
        x: Math.random() * window.innerWidth,
      }}
      transition={{
        duration: Math.random() * 10 + 15,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  )
}

export default function FightIntro({ currentRoom, initialCountdown = 12, onCountdownComplete }: FightIntroProps) {
  const [countdown, setCountdown] = useState(initialCountdown)
  const [showVS, setShowVS] = useState(false)

  useEffect(() => {
    // Show VS after initial delay
    const vsTimer = setTimeout(() => setShowVS(true), 1500)

    // Countdown logic
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          onCountdownComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(vsTimer)
      clearInterval(countdownInterval)
    }
  }, [onCountdownComplete])

  const countdownDigits = countdown.toString().padStart(2, "0").split("")
  const player1 = currentRoom.players[0]
  const player2 = currentRoom.players[1]

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-red-900/30 to-transparent" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-900/30 to-transparent" />

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            color={i % 2 === 0 ? "rgba(239, 68, 68, 0.6)" : "rgba(59, 130, 246, 0.6)"}
          />
        ))}
      </div>

      {/* Countdown section - Fixed at top */}
      <div className="relative z-20 flex-shrink-0 pt-8 sm:pt-12 md:pt-16 pb-4">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center"
        >
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 tracking-widest">
            BATTLE BEGINS IN
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {countdownDigits.map((digit, index) => (
              <CountdownDigit key={index} digit={Number.parseInt(digit)} />
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white ml-2"
            >
              s
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Main battle area - Flexible space */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8">
        {/* VS Animation */}
        <AnimatePresence>
          {showVS && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 1,
              }}
              className="absolute z-30 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotateZ: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-blue-500/30 rounded-full blur-3xl scale-150" />
                <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-blue-400 drop-shadow-2xl">
                  VS
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player cards container */}
        <div className="w-full max-w-7xl flex items-center justify-between">
          {/* Player 1 */}
          <div className="flex-1 flex justify-center lg:justify-end lg:pr-16">
            <PlayerCard player={player1} isLeft={true} delay={0.2} />
          </div>

          {/* Spacer for VS */}
          <div className="w-4 sm:w-40 md:w-48 lg:w-56 flex-shrink-0" />

          {/* Player 2 */}
          <div className="flex-1 flex justify-center lg:justify-start lg:pl-16">
            <PlayerCard player={player2} isLeft={false} delay={0.5} />
          </div>
        </div>
      </div>

      {/* Bottom section - Fixed at bottom */}
      <div className="relative z-20 flex-shrink-0 pb-6 sm:pb-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-center"
        >
          <div className="text-slate-400 text-sm sm:text-base font-semibold tracking-[0.3em] mb-2">
            CHAMPIONSHIP BATTLE
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-32 h-1 bg-gradient-to-r from-red-500 via-white to-blue-500 mx-auto rounded-full"
          />
        </motion.div>
      </div>
    </div>
  )
}
