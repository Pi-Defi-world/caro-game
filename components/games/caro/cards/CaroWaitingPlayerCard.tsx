"use client"

import { Clock, Loader2, Users, Crown, Zap, UserPlus, Check, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { type IRoom, leaveRoom } from "@/redux/slices/room"
import { fetchFriends, type IFriend } from "@/redux/slices/friends"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { updateUserBalance } from "@/redux/slices/auth"
import { useSocket } from "@/hooks/useSocket"

interface WaitingPlayerCardProps {
  room: IRoom
  roomId: string
}

export default function CaroWaitingPlayerCard({ room, roomId }: WaitingPlayerCardProps) {
  const [loading, setLoading] = useState(false)
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set())
  const inviteTimers = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const [showInviteFriend, setShowInviteFriend] = useState(false)
  const [showAvailableFriends, setShowAvailableFriends] = useState(true)

  const total = room.maxPlayers
  const players = room.players
  const remainingPlayers = total - players.length
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { sendJsonMessage } = useSocket()
  const { friends } = useAppSelector((state) => state.friends)
  const { onlinePlayers } = useAppSelector((state) => state.rooms)
  const { currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if(friends.length === 0) {
      dispatch(fetchFriends())
    }
  }, [dispatch, friends.length])

  useEffect(() => {
    return () => {
      inviteTimers.current.forEach((timeout) => clearTimeout(timeout))
      inviteTimers.current.clear()
    }
  }, [])

  const onlineFriends = friends
    .filter(friend => 
      onlinePlayers.some((onlinePlayer: IFriend) => onlinePlayer._id === friend._id) &&
      !players.some(player => player._id === friend._id) &&
      friend._id !== currentUser?._id
    )
    .filter((friend, index, self) => 
      index === self.findIndex(f => f._id === friend._id)
    )

  const availableOnlineFriends = onlineFriends.filter(friend => !invitedFriends.has(friend._id))
  const invitedOnlineFriends = onlineFriends.filter(friend => invitedFriends.has(friend._id))

  if (onlineFriends.length > 0) {
    console.log('Online friends found:', onlineFriends.map(f => ({ id: f._id, username: f.username })))
    console.log('Total friends:', friends.length)
    console.log('Online players:', onlinePlayers.length)
  }

  const handleInviteFriend = (friendId: string) => {
    if (invitedFriends.has(friendId)) {
      return
    }
    setInvitedFriends(prev => new Set([...prev, friendId]))
    // After inviting, hide available list but keep the invited list visible
    setShowAvailableFriends(false)
    sendJsonMessage({
      type: 'invite-friend',
      payload: { 
        userId: friendId, 
        inviterId: currentUser?._id,
        roomId,
        roomName: room.name,
        betAmount: room.betAmount,
        hostUsername: currentUser?.username
      }
    })
    const timeout = setTimeout(() => {
      setInvitedFriends(prev => {
        const next = new Set(prev)
        next.delete(friendId)
        return next
      })
      inviteTimers.current.delete(friendId)
    }, 15000)
    inviteTimers.current.set(friendId, timeout)
  }

  const handleLeaveRoom = async () => {
    try {
      setLoading(true)
      const result = await dispatch(leaveRoom(roomId)).unwrap()
      console.log("Successfully left room:", result)
      const amount = result.betAmount
      dispatch(updateUserBalance(amount))
      router.push("/")
    } catch (error) {
      console.error("Failed to leave room:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-[500px] bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-2xl p-4 w-full border border-gray-700 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.div 
          className="flex items-center gap-3"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="relative">
            <motion.div 
              className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Clock className="relative w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{room.name}</h2>
            <p className="text-gray-400 text-sm">Waiting for players...</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600">
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-white font-semibold">{players.length}/{total}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {Array.from({ length: total }).map((_, index) => {
          const player = players[index]
          const isEmpty = !player
          
          return (
          <motion.div
            key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setShowInviteFriend(prev => {
              const next = !prev
              if (next) setShowAvailableFriends(true)
              return next
            })}
            className={cn(
                "relative h-32 rounded-xl border-2 transition-all duration-300 overflow-hidden",
                isEmpty 
                  ? "bg-gray-800/50 border-gray-600 border-dashed" 
                  : "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50"
              )}
            >
              {isEmpty ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full text-gray-500 cursor-pointer group"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30 mb-2 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 group-hover:border-blue-400/50 transition-all duration-200"
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    <Search className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                  </motion.div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">Invite Friend</p>
                </motion.div>
              ) : (
                <div className="flex flex-col h-full p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-white text-sm font-medium truncate">
                        {player.username || `Player ${index + 1}`}
                      </span>
                    </div>
                    {index === 0 && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-white font-bold text-lg">
                        {player.username?.charAt(0).toUpperCase() || "P"}
                      </span>
                    </motion.div>
      </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 text-xs font-medium">Ready</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {(showInviteFriend && (availableOnlineFriends.length > 0 || invitedOnlineFriends.length > 0)) && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Online Friends</h3>
            <span className="text-gray-400 text-sm">({onlineFriends.length})</span>
          </div>
          
          {showAvailableFriends && availableOnlineFriends.length > 0 && (
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto mb-4">
              {availableOnlineFriends.map((friend) => (
                <motion.div
                  key={friend._id}
                  className="flex items-center justify-between bg-gray-800/50 rounded-lg p-1 border border-gray-600/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {friend.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{friend.username}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">Online</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleInviteFriend(friend._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1",
                      "bg-blue-600/20 text-blue-400 border border-blue-500/50 hover:bg-blue-600/30 hover:border-blue-400/70"
                    )}
                  >
                    <UserPlus className="w-3 h-3" />
                    Invite
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          
        </motion.div>
      )}

{invitedOnlineFriends.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-400" />
                <h4 className="text-white font-semibold">Invited (pending)</h4>
                <span className="text-gray-400 text-sm">({invitedOnlineFriends.length})</span>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto mb-2">
                {invitedOnlineFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between bg-gray-800/30 rounded-lg p-1 border border-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {friend.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{friend.username}</p>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          <span className="text-yellow-400 text-xs">Invited</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

      <div className="flex-1 flex flex-col justify-end">
        <motion.div 
          className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-4 mb-4 border border-gray-600/50"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Game Info</span>
            <span className="text-green-400 text-sm font-medium">Caro Game</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Bet Amount:</span>
            <span className="text-yellow-400 font-medium">{room.betAmount || 0} PI</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Players:</span>
            <span className="text-blue-400 font-medium">{players.length}/{total}</span>
          </div>
        </motion.div>

        <motion.button
        onClick={handleLeaveRoom}
        disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        className={cn(
            "w-full py-2 px-4 font-semibold rounded-xl transition-all duration-200",
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
          "text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
            "border border-red-500/50 hover:border-red-400/70",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Leaving Room...</span>
          </>
        ) : (
            <>
          <span>Leave Room</span>
            </>
        )}
        </motion.button>
      </div>
    </motion.div>
  )
}
