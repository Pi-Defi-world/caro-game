"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type React from "react"
import { type SetStateAction, useState } from "react"
import { createRoom, joinRoom, setCurrentRoom, type IRoom } from "@/redux/slices/room"
import { Loader2, Coins, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { updateUserBalance } from "@/redux/slices/auth"

interface ICreateRoomProps {
  open: boolean
  setOpen: React.Dispatch<SetStateAction<boolean>>
}

const CaroCreateRoomDialog: React.FC<ICreateRoomProps> = ({ open, setOpen }) => {
  const [roomName, setRoomName] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { currentUser } = useAppSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(false)
  const [room, setRoom] = useState<IRoom | null>(null)
  const router = useRouter()
  const dispatch = useAppDispatch()

  if (!currentUser) {
    return null
  }

  const validateInputs = (): boolean => {
    if (!roomName.trim()) {
      setError("Room name is required.")
      return false
    }
    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Amount must be greater than 0.")
      return false
    }
    if (currentUser.balance < amountValue) {
      setError("Insufficient balance.")
      return false
    }
    setError(null)
    return true
  }

  const handleCreateRoom = async () => {
    if (!validateInputs()) return

    setLoading(true)
    setError(null)

    try {
      const createRoomAction = await dispatch(
        createRoom({
          name: roomName,
          betAmount: Number.parseInt(amount),
        }),
      ).unwrap()

      setRoomName("")
      setAmount("")
      setRoom(createRoomAction)

      const joinRoomAction = await dispatch(joinRoom(createRoomAction._id)).unwrap()
      dispatch(updateUserBalance(-createRoomAction.betAmount))
      dispatch(setCurrentRoom(joinRoomAction))
      router.push(`/games/caro/${joinRoomAction._id}`)
    } catch (error: any) {
      console.error("Failed to create room:", error)
      if (error.message) {
        setError(error.message)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("Failed to create room. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const copyRoomId = () => {
    if (room?._id) {
      navigator.clipboard.writeText(room._id)
      setCopied(true)
      // Reset copied state immediately after a brief moment
      setTimeout(() => setCopied(false), 1000)
    }
  }

  const handleJoinGame = async () => {
    if (!room) return

    setJoiningRoom(true)
    setError(null)

    try {
      const result = await dispatch(joinRoom(room._id)).unwrap()
      dispatch(setCurrentRoom(result))
      router.push(`/games/caro/${room._id}`)
    } catch (error: any) {
      console.error("Failed to join room:", error)
      if (error.message) {
        setError(error.message)
      } else if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("Failed to join room. Please try again.")
      }
    } finally {
      setJoiningRoom(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Remove all non-digit and non-decimal characters
    value = value.replace(/[^\d.]/g, "")
    // Remove leading zeros (but keep '0.' for decimals)
    value = value.replace(/^0+(?!\.)/, "")
    // Only allow one decimal point
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }
    // Prevent negative and empty string
    if (value.startsWith("-")) value = value.replace("-", "")
    setAmount(value)
  }

  const handleDialogClose = () => {
    setOpen(false)
    setRoom(null)
    setError(null)
    setCopied(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/30" />
      {room ? (
        <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl bg-[#191932] p-0 shadow-[0_0_30px_rgba(90,67,243,0.15)] custom-border">
          <DialogHeader className="bg-[#1e1e3a] p-6 rounded-t-xl border-b border-[#2e2e4a]">
            <DialogTitle className="text-center text-2xl font-bold text-white mb-2">Room Created!</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Your game room has been created successfully
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-2">
            <div className="space-y-3">
              <div className="bg-[#1e1e3a] rounded-xl p-4">
                <Label className="text-sm text-gray-400 block mb-1">Room Name</Label>
                <p className="text-white font-medium">{room.name}</p>
              </div>

              <div className="bg-[#1e1e3a] rounded-xl p-4">
                <Label className="text-sm text-gray-400 block mb-1">Bet Amount</Label>
                <div className="flex items-center">
                  <Coins className="w-4 h-4 text-yellow-500 mr-2" />
                  <p className="text-white font-medium">{room.betAmount} π</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <Button
              onClick={handleJoinGame}
              disabled={joiningRoom}
              className="w-full  rounded-xl bg-gradient-to-r from-[#5a43f3] to-[#7a63ff] hover:from-[#4a33e3] hover:to-[#6a53ef] text-white font-medium group disabled:opacity-50"
            >
              {joiningRoom ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Joining...
                </div>
              ) : (
                <span className="flex items-center">
                  Join Game
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl custom-border bg-[#191932] p-0 shadow-[0_0_30px_rgba(90,67,243,0.15)]">
          <DialogHeader className="bg-[#1e1e3a] p-6 rounded-t-xl border-b border-[#2e2e4a]">
            <DialogTitle className="text-center text-2xl font-bold text-white mb-2">Host New Game</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Create a new game room and set your bet amount
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-sm font-medium text-gray-200">
                Room Name
              </Label>
              <Input
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className=" bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-200">
                Amount (π)
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  min={0.1}
                  onChange={handleAmountChange}
                  placeholder="Enter bet amount"
                  className=" bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0 pl-11"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Your balance: <span className="font-medium text-white">{currentUser.balance.toFixed(2)} π</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={handleDialogClose}
                variant="outline"
                className=" rounded-xl bg-[#1e1e3a] hover:bg-[#2e2e4a] border-0 text-white font-medium"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRoom}
                disabled={loading}
                className=" rounded-xl bg-[#5a43f3] hover:bg-[#4a33e3] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Creating...
                  </div>
                ) : (
                  "Create Room"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default CaroCreateRoomDialog
