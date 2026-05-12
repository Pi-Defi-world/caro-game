"use client"

import Game from "@/components/Game"
import { useSocket } from "@/hooks/useSocket"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchCurrentRoom } from "@/redux/slices/room"
import { Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo, useCallback } from "react"
import { GameEvent } from "@/enum"
import CaroGameInfo from "@/components/games/caro/CaroGameInfo"
import CaroWaitingPlayerCard from "@/components/games/caro/cards/CaroWaitingPlayerCard"
import ChatComponent from "@/components/common/ChatComponent"
import CaroSettingDialog from "@/components/games/caro/dialogs/CaroSettingModal"

export type ChatMessage = {
  player: string
  message: string
}

const RoomPage = () => {
  const { sendJsonMessage, lastJsonMessage } = useSocket()
  const params = useParams<{ id: string }>()
  const roomId = params.id
  const { currentUser } = useAppSelector((state) => state.auth)
  const { currentRoom } = useAppSelector((state) => state.rooms)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [message, setMessage] = useState({
    player: "",
    message: "",
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSpectator, setIsSpectator] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const dispatch = useAppDispatch()
  const router = useRouter()

  // Redirect if the room is closed
  // useEffect(() => {
  //   if (currentRoom && currentRoom.status === "closed") {
  //     setIsRedirecting(true)
  //     const redirectTimer = setTimeout(() => {
  //       router.push("/games/caro")
  //     }, 1500)
  //     return () => clearTimeout(redirectTimer)
  //   }
  // }, [currentRoom, router])

  useEffect(() => {
    if (lastJsonMessage) {
      // @ts-expect-error
      const { type, payload } = lastJsonMessage
      if (type === "message") {
        setMessage(payload)
        setChatMessages((prevMessages) => [...prevMessages, payload])
      }
    }
  }, [lastJsonMessage])

  useEffect(() => {
    if (!currentRoom && roomId) {
      dispatch(fetchCurrentRoom(roomId))
    }
  }, [currentRoom, roomId, dispatch])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendJsonMessage({
        type: "message",
        payload: {
          player: currentUser?.username,
          message: newMessage.trim(),
          roomId,
          isSpectator,
        },
      })
      setNewMessage("")
    }
  }

  const handleBeReady = () => {
    try {
      sendJsonMessage({
        type: GameEvent.READY,
        payload: {
          userId: currentUser?._id,
          roomId,
        },
      })
    } catch (error) {
      console.error("Failed to send ready status:", error)
    }
  }

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-8 w-8 text-white" />
      </div>
    )
  }

  const roomAmount = Number(currentRoom?.betAmount)
  const statusMessage = roomAmount
    ? `Winner get: ${(roomAmount * 2 * (1 - 0.05)).toFixed(2)} Pi`
    : "Room bet is in progress..."

  const uniquePlayers = new Set(currentRoom.players.map((player) => player._id))
  const isWaiting = uniquePlayers.size < currentRoom.maxPlayers && !isSpectator

  const isInRoom = currentRoom.players.some((player) => player._id === currentUser?._id)

  if (!currentRoom || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <Loader className="animate-spin h-8 w-8 text-white" />
        {isRedirecting && (
          <p className="text-white text-sm">
            This room has been closed. Redirecting you back...
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-screen h-screen ">
      <div className="flex flex-col w-full h-full overflow-hidden">
        {/* <CaroGameInfo /> */}
        <div className="flex-1 flex flex-col gap-3 lg:flex-row overflow-hidden">
          <div className="flex-1 rounded-lg justify-center items-center flex">
            {isSpectator && (
              <div className="absolute top-4 left-4 z-50 bg-amber-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                Spectator Mode
              </div>
            )}
            {isWaiting ? (
              <CaroWaitingPlayerCard room={currentRoom} roomId={roomId} />
            ) : (
              <Game
                currentUser={currentUser!}
                onReady={handleBeReady}
                currentRoom={currentRoom}
                messages={message}
                isHost={currentUser?._id.toString() === currentRoom.host._id.toString()}
                isInRoom={isInRoom}
              />
            )}
          </div>
          <ChatComponent
            chatMessages={chatMessages}
            newMessage={newMessage}
            onSendMessage={handleSendMessage}
            onNewMessageChange={setNewMessage}
            statusMessage={statusMessage}
          />
        </div>
      </div>
      <CaroSettingDialog open={isSettingsOpen} setOpen={setIsSettingsOpen} />
    </div>
  )
}

export default RoomPage
