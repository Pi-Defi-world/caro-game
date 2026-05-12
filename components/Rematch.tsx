"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Zap, RefreshCw, X, UserMinus2, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useSocket } from "@/hooks/useSocket"
import { leaveRoom } from "@/redux/slices/room"

interface RematchProps {
  isHost: boolean
  onRequestRematch: () => void
  onAcceptRematch: () => void
  onLeaveRoom: () => void
  onRejectRematch: () => void
  hasKickedOut: boolean
  onKickoutPlayer: () => void
  hasRequestedRematch: boolean
  amount: number
  opponentRequestedRematch: boolean
}

const Rematch = ({
  isHost,
  onRequestRematch,
  onAcceptRematch,
  onLeaveRoom,
  amount,
  onRejectRematch,
  hasKickedOut,
  onKickoutPlayer,
  hasRequestedRematch,
  opponentRequestedRematch,
}: RematchProps) => {
  const router = useRouter()
  const { currentUser } = useAppSelector(state => state.auth)



  const handleLeaveRoom = async() => {
    // if(!isHost){
    // }
    onLeaveRoom()
    router.push("/")
  }

  // Check if user has enough balance for rematch
  const insufficientBalance =
    typeof currentUser?.balance === "number" && amount > 0
      ? currentUser?.balance < amount
      : false

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-300 max-w-2xl w-full shadow-sm"
    >
      {/* Status Header */}
      <div className="relative w-full mb-8">
        <div className="relative flex flex-col items-center">
          <div
            className={cn(
              "flex items-center justify-center w-16 h-16 rounded-full mb-4",
              "bg-gray-100 border-2",
              opponentRequestedRematch ? "border-purple-500" : "border-gray-300",
            )}
          >
            {opponentRequestedRematch ? (
              <Zap className="w-8 h-8 text-purple-500" />
            ) : (
              <RefreshCw className="w-8 h-8 text-gray-500" />
            )}
          </div>

          <motion.h2
            className={cn(
              "text-xl font-bold text-center mb-2",
              opponentRequestedRematch ? "text-purple-600" : "text-gray-600",
            )}
          >
            {opponentRequestedRematch ? "Rematch Requested!" : "Want to Play Again?"}
          </motion.h2>

          <p className="text-gray-500 text-center text-sm max-w-xs">
            {opponentRequestedRematch
              ? "Your opponent wants to play again. Accept to start a new game!"
              : "Challenge your opponent to another round!"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-4">
        {isHost && (
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                type="button"
                onClick={onKickoutPlayer}
                className={cn(
                  "flex-1 py-2 font-medium rounded-lg border border-gray-300 bg-white text-gray-700 cursor-not-allowed opacity-80",
                  "flex items-center justify-center gap-2"
                )}
              >
                <UserMinus2 className="w-5 h-5" />
                Remove/Kick Player
              </Button>
              <Button
                type="button"
                disabled
                className={cn(
                  "flex-1 py-2 font-medium rounded-lg border border-yellow-400 bg-yellow-50 text-yellow-700 cursor-not-allowed opacity-80",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Crown className="w-5 h-5" />
                Give Room Ownership
              </Button>
            </div>
          </div>
        )}

        {/* If kicked out, only show rematch/accept/rematch/leave logic */}
        {hasKickedOut ? (
          <>
            {opponentRequestedRematch ? (
              <>
                <Button
                  onClick={onAcceptRematch}
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Accept Rematch
                </Button>
                <Button
                  onClick={onRejectRematch}
                  variant="outline"
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-red-600 hover:bg-red-700 text-white border border-red-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Reject Rematch
                </Button>
              </>
            ) : !hasRequestedRematch ? (
              <>
                <Button
                  onClick={onRequestRematch}
                  disabled={insufficientBalance}
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                    insufficientBalance && "opacity-60 cursor-not-allowed"
                  )}
                  title={
                    insufficientBalance
                      ? `Insufficient balance for rematch (required: ${amount}, you have: ${currentUser?.balance ?? 0})`
                      : undefined
                  }
                >
                  Request Rematch
                </Button>
                {insufficientBalance && (
                  <div className="text-center text-red-500 text-sm mb-2">
                    You don't have enough balance to request a rematch.
                  </div>
                )}
                <Button
                  onClick={handleLeaveRoom}
                  variant="outline"
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Leave Room
                </Button>
              </>
            ) : (
              <>
                <div className="text-center text-gray-500 mb-4">
                  Waiting for opponent to accept...
                </div>
                <Button
                  onClick={handleLeaveRoom}
                  variant="outline"
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Leave Room
                </Button>
              </>
            )}
          </>
        ) : (
          // Default logic if not kicked out (original logic)
          <>
            {opponentRequestedRematch ? (
              <>
                <Button
                  onClick={onAcceptRematch}
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Accept Rematch
                </Button>
                <Button
                  onClick={onRejectRematch}
                  variant="outline"
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-red-600 hover:bg-red-700 text-white border border-red-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Reject Rematch
                </Button>
              </>
            ) : !hasRequestedRematch ? (
              <>
                <Button
                  onClick={onRequestRematch}
                  disabled={insufficientBalance}
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-purple-600 hover:bg-purple-700 text-white border border-purple-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                    insufficientBalance && "opacity-60 cursor-not-allowed"
                  )}
                  title={
                    insufficientBalance
                      ? `Insufficient balance for rematch (required: ${amount}, you have: ${currentUser?.balance ?? 0})`
                      : undefined
                  }
                >
                  Request Rematch
                </Button>
                {insufficientBalance && (
                  <div className="text-center text-red-500 text-sm mb-2">
                    You don't have enough balance to request a rematch.
                  </div>
                )}
                <Button
                  onClick={handleLeaveRoom}
                  variant="outline"
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Leave Room
                </Button>
              </>
            ) : (
              <>
                <div className="text-center text-gray-500 mb-4">
                  Waiting for opponent to accept...
                </div>
                <Button
                  onClick={handleLeaveRoom}
                  variant="outline"
                  className={cn(
                    "w-full py-4 font-bold text-lg rounded-lg transition-all duration-200",
                    "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
                    "transform hover:scale-[1.02] active:scale-[0.98]",
                  )}
                >
                  Leave Room
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default Rematch