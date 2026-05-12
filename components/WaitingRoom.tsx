"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Users, Zap, CheckCircle, AlertCircle, Info, Gamepad2, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import CaroGameRulesModal from "./games/caro/dialogs/GameRulesModal"

interface WaitingRoomProps {
  isHost: boolean
  onStartGame: () => void
  onReady: () => void
  isOpponentReady: boolean
}

const WaitingRoom = ({ isHost, onStartGame, onReady, isOpponentReady }: WaitingRoomProps) => {
  const [waiting, setWaiting] = useState(false)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    const accept = localStorage.getItem("hasAccepted")
    if (accept) {
      setHasAccepted(true)
    }
  }, [open])

  useEffect(() => {
    setWaiting(false)
  }, [])

  const handleReady = () => {
    if (!hasAccepted) {
      setOpen(true)
      return
    }
    setWaiting(true)
    onReady()
  }

  const handleStart = () => {
    if (!hasAccepted) {
      setOpen(true)
      return
    }
    setWaiting(true)
    onStartGame()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 max-w-2xl w-full shadow-2xl"
    >
      {/* Status Header */}
      <div className="relative w-full mb-6 lg:mb-8">
        <div className="relative flex flex-col items-center">
          {/* Status Icon */}
          <motion.div
            className={cn(
              "flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full mb-4 lg:mb-6 border-2 shadow-lg",
              isHost
                ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300"
                : "bg-gradient-to-br from-green-50 to-green-100 border-green-300",
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {isHost ? (
              isOpponentReady ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-gray-500" />
                </motion.div>
              )
            ) : (
              <motion.div
                className={cn(
                  "w-8 h-8 lg:w-10 lg:h-10",
                  waiting ? "text-green-600" : "text-gray-500"
                )}
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {waiting ? <CheckCircle className="w-full h-full" /> : <AlertCircle className="w-full h-full" />}
              </motion.div>
            )}
          </motion.div>

          {/* Status Title */}
          <motion.h2
            className={cn(
              "text-xl lg:text-2xl font-bold text-center mb-2 lg:mb-3",
              isHost
                ? isOpponentReady
                  ? "text-blue-600"
                  : "text-gray-600"
                : waiting
                  ? "text-green-600"
                  : "text-gray-600",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isHost
              ? isOpponentReady
                ? "Ready to Start!"
                : "Waiting for Opponent"
              : waiting
                ? "Ready!"
                : "Ready to Play?"}
          </motion.h2>

          {/* Status Description */}
          <motion.p
            className="text-gray-500 text-center text-sm lg:text-base max-w-xs lg:max-w-sm leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isHost
              ? isOpponentReady
                ? "Your opponent is ready. Click the Start Game button when you're ready."
                : "Waiting for your opponent to click the Ready button."
              : waiting
                ? "Waiting for the host to start the game."
                : "Click Ready when you're prepared to begin the match."}
          </motion.p>
        </div>
      </div>

      {/* Player Status Indicators */}
      <motion.div
        className="w-full mb-6 lg:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 lg:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-3 lg:mb-0">
            <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mr-3 lg:mr-4">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 font-medium text-sm lg:text-base">Players</p>
              <p className="text-gray-500 text-xs lg:text-sm">2/2 Connected</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div
              className={cn(
                "flex items-center px-3 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium border shadow-sm",
                isHost
                  ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300"
                  : "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-300",
              )}
            >
              {isHost ? "Host" : "Guest"}
            </div>
            <div
              className={cn(
                "flex items-center px-3 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium border shadow-sm",
                isOpponentReady || waiting
                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300"
                  : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border-yellow-300",
              )}
            >
              {isOpponentReady || waiting ? "Ready" : "Not Ready"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence mode="wait">
        {isHost ? (
          isOpponentReady ? (
            <motion.div
              key="host-start"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Button
                onClick={handleStart}
                className={cn(
                  "w-full py-4 lg:py-5 font-bold text-lg lg:text-xl rounded-xl transition-all duration-200 shadow-lg",
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0",
                  "transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl",
                )}
              >
                <Gamepad2 className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                Start Game
              </Button>
            </motion.div>
          ) : null
        ) : !waiting ? (
          <motion.div
            key="guest-ready"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Button
              onClick={handleReady}
              className={cn(
                "w-full py-4 lg:py-5 font-bold text-lg lg:text-xl rounded-xl transition-all duration-200 shadow-lg",
                "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0",
                "transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl",
              )}
            >
              <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
              I'm Ready
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Game Rules Link */}
      <motion.div
        className="mt-6 lg:mt-8 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors group"
        >
          <Info className="w-4 h-4 lg:w-5 lg:h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm lg:text-base font-medium">Game Rules</span>
        </button>
      </motion.div>

      {/* Chat Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-6 lg:mt-8 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm"
      >
        <div className="flex items-center gap-2 text-blue-600">
          <Trophy className="w-4 h-4 lg:w-5 lg:h-5" />
          <p className="text-center text-sm lg:text-base font-medium">
            You can chat with your opponent while waiting!
          </p>
        </div>
      </motion.div>

      {/* Game Rules Modal */}
      <CaroGameRulesModal open={open} setOpen={setOpen} />
    </motion.div>
  )
}

export default WaitingRoom
