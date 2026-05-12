"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { gsap } from "gsap"
import Confetti from "react-confetti"
import { X } from "lucide-react"
import CloudBanner from "./CloudBanner"
import RenderMessage from "./RenderMessage"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateUserBalance } from "@/redux/slices/auth"

interface WinnerModalProps {
  message: "win" | "loss" | "draw" | null
  roomId: string
}

const CloseButton = () => (
  <DialogClose className="absolute -right-3 -top-3 z-20">
    <div className="relative group">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-sm group-hover:blur-md transition-all" />
      <p className="relative p-2 rounded-full bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg border-2 border-white hover:scale-110 transition-transform">
        <X className="w-4 h-4 stroke-[3]" />
      </p>
    </div>
  </DialogClose>
)

export function WinnerModal({ message, roomId }: WinnerModalProps) {
  const [isOpen, setIsOpen] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const piRef = useRef<HTMLParagraphElement>(null)
  const expRef = useRef<HTMLParagraphElement>(null)
  const dispatch = useAppDispatch()
  const { currentRoom } = useAppSelector((state) => state.rooms)
  const { currentUser } = useAppSelector((state) => state.auth)

  const [balanceUpdated, setBalanceUpdated] = useState(false)

  const { prize, totalFee, betAmount } = useMemo(() => {
    const betAmount = Number(currentRoom?.betAmount) || 0
    // When player wins, they get 2x their bet amount
    const totalWinAmount = betAmount * 2
    // 5% fee is deducted from the win amount
    const fee = 0.05
    const totalFee = totalWinAmount * fee
    const prize = totalWinAmount * (1 - fee)

    return { prize, totalFee, betAmount }
  }, [currentRoom?.betAmount])

  // Memoize animation configurations
  const containerAnimation = useMemo(
    () => ({
      initial: { scale: 0, y: 100 },
      animate: { scale: 1, y: 0 },
      exit: { scale: 0, y: -100 },
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    }),
    [],
  )

  const buttonAnimation = useMemo(
    () => ({
      initial: { opacity: 0.1 },
      animate: { opacity: 1 },
      transition: { delay: 0.8 },
    }),
    [],
  )

  // Memoize winner information
  const winnerInfo = useMemo(
    () => ({
      winner: currentUser?._id || "",
      isDraw: message === "draw",
    }),
    [currentUser?._id, message],
  )

  // Handle animations when modal opens
  useEffect(() => {
    if (message === "win" && containerRef.current) {
      gsap.from(containerRef.current, {
        scale: 0,
        rotation: -15,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      })

      if (piRef.current) {
        gsap.from(piRef.current, {
          textContent: 0,
          duration: 1.5,
          snap: { textContent: 1 },
          stagger: 0.25,
          ease: "power2.out",
          delay: 0.5,
        })
      }

      if (expRef.current) {
        gsap.from(expRef.current, {
          textContent: 0,
          duration: 1,
          snap: { textContent: 1 },
          stagger: 0.25,
          ease: "power2.out",
          delay: 0.8,
        })
      }

      const tl = gsap.timeline()
      tl.from(".reward-item", {
        y: 50,
        opacity: 0,
        duration: 0.4,
        stagger: 0.2,
        ease: "back.out(1.7)",
      })
    }
  }, [message])

  // Function to update balance - will be called when dialog closes
  const updateBalance = useCallback(() => {
    if (message === "win" && prize && !balanceUpdated) {
      // console.log("Updating balance with prize:", prize)
      dispatch(updateUserBalance(prize))
      setBalanceUpdated(true)
      // alert(`user balance before update: ${currentUser?.balance}`)
      // alert(`Congratulations! ${prize.toFixed(2)} π has been added to your balance!`)
    }
  }, [message, prize, dispatch, balanceUpdated])

  // Memoize handlers to prevent recreating functions on each render
  const handleClose = useCallback(() => {
    // Update balance when closing the dialog
    updateBalance()
    setIsOpen(false)
  }, [updateBalance])

  const handleKeepPlaying = useCallback(() => {
    // Update balance when keeping playing
    updateBalance()
    setIsOpen(false)
  }, [updateBalance])

  // Memoize confetti configuration
  const confettiConfig = useMemo(
    () => ({
      numberOfPieces: 400,
      recycle: false,
      gravity: 0.2,
      tweenDuration: 4000,
    }),
    [],
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none pt-12">
        <CloudBanner message={message} />
        {message === "win" && <Confetti {...confettiConfig} />}
        <motion.div ref={containerRef} className="relative" {...containerAnimation}>
          <CloseButton />

          <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-400 opacity-90 blur-xl rounded-3xl" />
          <div className="relative bg-gradient-to-b from-pink-100 to-pink-200 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-white">
            <DialogHeader>
              
              <DialogTitle />
            </DialogHeader>

            <div className="mt-6 mb-8">
              <RenderMessage message={message} gfp={totalFee} prize={prize} />
            </div>

            <motion.div className="flex justify-center" {...buttonAnimation}>
              <Button
                variant="outline"
                onClick={handleKeepPlaying}
                className="px-8 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white border-none hover:opacity-90 transition-opacity"
              >
                Keep Playing!
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}