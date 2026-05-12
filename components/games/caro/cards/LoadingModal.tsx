"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Gamepad2, Users, Trophy, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LoadingModalProps {
  isOpen: boolean
  onClose?: () => void
  roomName?: string
  betAmount?: number
  playersCount?: number
  maxPlayers?: number
  error?: string | null
}

export const LoadingModal = ({
  isOpen,
  onClose, 
  roomName = "Loading Room...",
  betAmount = 0,
  playersCount = 0,
  maxPlayers = 2,
  error = null,
}: LoadingModalProps) => {
  const isError = !!error

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90%] p-0 border-0 bg-transparent shadow-none">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
              className="relative w-full"
            >
              <div className="absolute inset-0 rounded-2xl bg-black/20 backdrop-blur-sm" />

                             <div
                 className={cn(
                   "relative rounded-2xl border shadow-xl overflow-hidden backdrop-blur-md",
                   isError ? "bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-red-500/30" : "bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/20",
                 )}
               >
                {onClose && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                )}

                                 <DialogHeader
                   className={cn(
                     "relative p-6 text-center border-b",
                     isError ? "border-red-500/20" : "border-purple-500/20",
                   )}
                 >
                  <motion.div
                    animate={isError ? {} : { rotate: [0, 360] }}
                    transition={{
                      rotate: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                    }}
                                         className={cn(
                       "inline-flex items-center justify-center w-12 h-12 rounded-full mb-4",
                       isError ? "bg-red-500/20 border border-red-500/30" : "bg-purple-500/20 border border-purple-500/30",
                     )}
                  >
                    <Gamepad2 className={cn("w-6 h-6", isError ? "text-red-400" : "text-purple-300")} />
                  </motion.div>

                  <DialogTitle className="text-xl font-semibold text-white mb-2">
                    {isError ? "Failed to Join Room" : "Joining Game Room"}
                  </DialogTitle>
                                     <p className={cn("text-sm", isError ? "text-red-400" : "text-purple-300")}>
                     {isError ? error : roomName}
                   </p>
                </DialogHeader>

                <div className="p-6 text-center">
                  {isError ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                        <div className="text-red-400 text-2xl">❌</div>
                      </div>
                      <div className="text-red-300 font-medium">
                        Could not join the room
                      </div>
                      <div className="text-gray-500 text-sm">
                        {typeof error === "string" && error.length > 0
                          ? error
                          : "Room is full, closed, or unavailable. Please try another room."}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-transparent border-t-purple-400 rounded-full animate-spin" />
                                                     <div className="absolute inset-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                             <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
                           </div>
                        </div>
                      </div>

                      <div className="text-white font-medium mb-4">
                        Waiting for room to accept you...
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                                                 <div className="bg-gray-800/30 p-3 rounded-lg border border-purple-500/20">
                           <div className="flex items-center justify-center gap-2 mb-1">
                             <Users className="w-3 h-3 text-purple-400" />
                             <span className="text-purple-400 text-xs">PLAYERS</span>
                           </div>
                           <div className="text-white font-semibold">
                             {playersCount}/{maxPlayers}
                           </div>
                         </div>
                         <div className="bg-gray-800/30 p-3 rounded-lg border border-purple-500/20">
                                                     <div className="flex items-center justify-center gap-2 mb-1">
                             <Trophy className="w-3 h-3 text-yellow-400" />
                             <span className="text-yellow-400 text-xs">BET</span>
                           </div>
                          <div className="text-white font-semibold">{betAmount}π</div>
                        </div>
                      </div>

                                             <div className="w-full bg-gray-800/50 rounded-full h-1 mb-4 overflow-hidden">
                         <motion.div
                           initial={{ width: "0%" }}
                           animate={{ width: "100%" }}
                           transition={{
                             duration: 3,
                             repeat: Number.POSITIVE_INFINITY,
                             ease: "easeInOut",
                           }}
                           className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                         />
                       </div>

                      <div className="text-gray-500 text-sm">
                        Waiting for the room to be ready...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export default LoadingModal





