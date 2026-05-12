"use client"
import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Pause } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"
import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
import { useRouter } from "next/navigation"
import { useSocket } from "@/hooks/useSocket"

interface GamePausedProps {
  reason?: string
  className?: string
  opponent?: string,
  opponentId?: string,
  roomId?: string,
  isInRoom: boolean
}

const GamePaused: React.FC<GamePausedProps> = ({ reason, className, opponent, roomId, opponentId, isInRoom }) => {
  const onlinePlayers = useAppSelector((state) => state.rooms.onlinePlayers)
  const {currentUser}= useAppSelector((state) => state.auth)

  const [accepted, setAccepted] = useState(false)
  const [declined, setDeclined] = useState(false)

  const {lastJsonMessage, sendJsonMessage}= useSocket()

  const router = useRouter()

  useEffect(() => {
    //@ts-ignore
    if (lastJsonMessage?.type === "poke-accepted") {
      setAccepted(true)
      router.push(`/games/caro/${roomId}`)
    }
    //@ts-ignore
    if (lastJsonMessage?.type === "poke-declined") {
      setAccepted(false)
    }
  }, [lastJsonMessage])

  const isOpponentOnline = useMemo(() => {
    if (!opponent || !onlinePlayers?.length) return false
    return onlinePlayers.some((p) => p.username === opponent)
  }, [opponent, onlinePlayers])

  const handlePoke = () => {
    if (!roomId) return
    sendJsonMessage({
      type: "poke-opponent",
      payload:{
        roomId: roomId,
        userId: currentUser?._id,
        opponentId: opponentId,
        username: currentUser?.username,
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`absolute inset-0 bg-black/80 z-[9999] backdrop-blur-sm flex items-center justify-center ${className ?? ""}`}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-gradient-to-r w-[90%] mx-auto from-amber-500 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl border-2 border-white/20 text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Pause className="w-12 h-12 animate-pulse" />
          <div>
            <h2 className="text-3xl font-bold">GAME PAUSED</h2>
            {reason && <p className="text-lg opacity-90">{reason}</p>}
          </div>
        </div>
        <div className="text-sm opacity-75 mb-2">
          Game will resume when {opponent} returns. You can leave this room.
        </div>
        {isOpponentOnline && isInRoom && !accepted && !declined &&  (
          <button
            onClick={handlePoke}
            className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition"
            type="button"
          >
            Poke {opponent}
          </button>
        )}
        {accepted && (
          <div className="text-sm opacity-75 mb-2">
            {opponent} has accepted your poke.
          </div>
        )}
        
        {declined && (
          <div className="text-sm opacity-75 mb-2">
            {opponent} has declined your poke.
          </div>
        )}

      </motion.div>
    </motion.div>
  )
}

export default GamePaused
