"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateUserBalance } from "@/redux/slices/auth"
import { type IRoom, joinRoom, setCurrentRoom } from "@/redux/slices/room"
import { Loader2, Users } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useMemo, useRef, useCallback } from "react"
import LoadingModal from "./LoadingModal"

interface CardRoomProp {
  room: IRoom
}
const displayAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}Mπ`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}kπ`
  }
  return `${amount}π`
}

export const CaroRoomCard = ({ room }: CardRoomProp) => {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { currentUser } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()


  const isGridLayout = true

  const balanceUpdatedRef = useRef(false)

  const { isWaiting, isHost, formattedAmount, betAmount } = useMemo(() => {
    const isWaiting = room.players.length < room.maxPlayers
    const isHost = room.host?._id === currentUser?._id
    const betAmount = room.betAmount
    const formattedAmount = displayAmount(betAmount)

    return { isWaiting, isHost, formattedAmount, betAmount }
  }, [room.players.length, room.maxPlayers, room.host?._id, currentUser?._id, room.betAmount])

  
  const handleJoinGame = useCallback(async () => {
    if (!room || !currentUser) return
    if (loading) return

    setLoading(true)
    setShowModal(false)
    setError(null)

    try {
      balanceUpdatedRef.current = false

      const res = await dispatch(joinRoom(room._id)).unwrap()

      if (!balanceUpdatedRef.current) {
        dispatch(updateUserBalance(-betAmount))
        balanceUpdatedRef.current = true
      }

      dispatch(setCurrentRoom(res))
      router.push(`/games/caro/${res._id}`)
    } catch (err: any) {
      setError(err)
      setShowModal(true)
      
      setTimeout(() => {
        setShowModal(false)
        setError(null)
      }, 5000)

    } finally {
      setLoading(false)
    }
  }, [room, currentUser, loading, betAmount, dispatch, router])


  if (isGridLayout) {
    return (
      <div
        key={room._id}
        className="relative border border-purple-500/20 bg-gradient-to-b from-gray-800/80 to-gray-900/80 rounded-xl p-1 flex flex-col items-start shadow-md"
      >
        <div className="flex justify-between items-center gap-1">
          <div className="text-white font-bold text-base mb-1 truncate text-ellipsis">
            <div
              className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-1 align-middle"
            />
            {room.host?.username.length > 15
              ? `${room.host?.username.slice(0, 15)}...`
              : room.host?.username}
          </div>
          <div className="flex items-center ml-1">
            <Users className="h-3 w-3  text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              {room.players.length}/{room.maxPlayers}
            </span>
          </div>
        </div>
        <div className="text-white text-sm flex items-center">
          {isWaiting && (
            <span className="text-[11px] ml-1 truncate">
              waiting for players...
            </span>
          )}
        </div>
        {/* <span className="text-xs text-gray-400">
          Waiting for players...
        </span> */}
        <button
          onClick={handleJoinGame}
          disabled={loading}
          className="bg-gradient-to-b cursor-pointer mt-2 from-yellow-400 to-yellow-600 rounded-xl px-2 py-0.5 border-2 border-white w-full flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center justify-center w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            `Join ${formattedAmount}`
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="relative border border-purple-500/20 bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl px-2 py- border-b-2 flex items-center">
      <div className="w-11 h-11 flex-shrink-0 relative">
        <Image src="/3d.png" alt="Coins" width={60} height={60} className="w-full h-full -translate-x-2.5" />
      </div>
      <div className="flex-1 flex flex-col items-start -translate-x-2.5">
        <span className="text-white font-bold text-sm">
          <div
            className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-2 align-middle"
          />
          {room.name}
          {isHost && <span className="ml-2 px-2 py-1 text-xs bg-purple-500 rounded-full">Your Room</span>}
        </span>
        <div className="text-white text-sm flex items-center">
          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm">
            {room.players.length}/{room.maxPlayers}
          </span>
          {isWaiting && <span className="text-[12px] ml-1">waiting for players...</span>}
        </div>
      </div>
      <button
        onClick={handleJoinGame}
        disabled={loading}
        className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-xl px-2 py-0.5 border-2 border-white"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Join (${formattedAmount})`}
      </button>

      <LoadingModal
        isOpen={showModal}
        roomName={room.name}
        betAmount={room.betAmount}
        playersCount={room.players.length}
        maxPlayers={room.maxPlayers}
        error={error}
      />
    </div>
  )
}
