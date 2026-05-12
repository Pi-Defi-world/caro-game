'use client'

import React, { useState, useEffect, memo } from "react"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axiosClient from "@/lib/axios"
import { spinTheWheel, updateCheckinDate, updateGFPBalance,updateUserBalance,updateUserSpin } from "@/redux/slices/auth"
import { CircularProgress } from "./Circular"
import { Wheel } from 'react-custom-roulette'
import { PrizeModal } from "./PrizeModal"
import Link from "next/link"
import { ChevronLeft, Loader, Gift, Clock, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import BackNav from "./BackNav"
import { BuySpinDialog } from "@/app/checkin/buy-spin-dialog"
import ShopBanner from "@/app/shop/ShopBanner"

const vip1Data = [
  { option: "2 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "0.5 PCM", style: { backgroundColor: "blue", textColor: "white" } },
  { option: "0.2 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "0.5 PI", style: { backgroundColor: "blue", textColor: "white" } },
  { option: "0.1 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "0.2 PCM", style: { backgroundColor: "blue", textColor: "white" } },
  { option: "5 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "0.01 PI", style: { backgroundColor: "blue", textColor: "white" } },
];

const vipData = [
  { option: "5 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "1 PCM", style: { backgroundColor: "blue", textColor: "white" } },
  { option: "0.5 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "1 PI", style: { backgroundColor: "blue", textColor: "white" } },
  { option: "0.2 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "0.5 PCM", style: { backgroundColor: "blue", textColor: "white" } },
  { option: "10 GFP", style: { backgroundColor: "yellow", textColor: "#000" } },
  { option: "0.02 PI", style: { backgroundColor: "blue", textColor: "white" } },
];

const MemoizedWheel = memo(Wheel, (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next);
})

export default function Checkin() {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  const [progressPercentager, setProgressPercentager] = useState(100)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState<number| null>(null)
  const [mustSpin, setMustSpin] = useState(false)
  const [showPrizeModal, setShowPrizeModal] = useState(false)
  const [showVIPModal, setShowVIPModal] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)

  const userChekin = currentUser?.lastCheckIn
  const isVIP = currentUser?.vipLevel !== null
  const isVIP1 = isVIP && currentUser?.vipLevel?.level === 1
  const remainingSpins = currentUser?.spins || 0
  const router = useRouter()

  const data = isVIP1 ? vip1Data : isVIP ? vipData : vip1Data

  useEffect(() => {
    const updateRemainingTime = () => {
      if (userChekin) {
        const now = new Date()
        const nextCheckInTime = new Date(userChekin)
        nextCheckInTime.setDate(nextCheckInTime.getDate() + 1)

        const totalDuration = 24 * 60 * 60 * 1000
        const remainingTime = nextCheckInTime.getTime() - now.getTime()
        
        if (remainingTime <= 0) {
          setTimeRemaining(null)
          setIsCheckedIn(false)
          setProgressPercentager(100)
        } else {
          const hours = String(Math.floor((remainingTime / (1000 * 60 * 60)) % 24)).padStart(2, "0")
          const minutes = String(Math.floor((remainingTime / (1000 * 60)) % 60)).padStart(2, "0")
          const seconds = String(Math.floor((remainingTime / 1000) % 60)).padStart(2, "0")

          setTimeRemaining(`${hours}:${minutes}:${seconds}`)
          setIsCheckedIn(true)
          const progress = (remainingTime / totalDuration) * 100
          setProgressPercentager(progress)
        }
      }
    }

    updateRemainingTime()
    const interval = setInterval(updateRemainingTime, 1000)

    return () => clearInterval(interval)
  }, [userChekin])

  const handleCheckIn = async () => {
    setLoading(true)
    try {
      const response = await axiosClient.post("/users/checkin")
      
      if (response.status === 200) {
        const now = new Date()
        dispatch(updateCheckinDate(now))
        setIsCheckedIn(true)
        setProgressPercentager(100)
        dispatch(updateGFPBalance(3.14))
        if (isVIP || isVIP1) {
          dispatch(updateUserSpin(-1))
        }
      }
    } catch (error) {
      console.error("Check-in failed:", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSpinClick = () => {
    if ((isVIP || isVIP1) && remainingSpins > 0) {
      const randomPrizeNumber = Math.floor(Math.random() * data.length)
      setPrizeNumber(randomPrizeNumber)
      setMustSpin(true)
      dispatch(updateUserSpin(-1))
    } else if (!isVIP && !isVIP1) {
      router.push("/shop/vips")
    }
  }

  const handleBuyVIP = () => {
    setShowPrizeModal(false)
    setOpen(true)
  }

  const handleBuySpins = () => {
     setOpen(true)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full">
        <ShopBanner title="Check-in" redirect="/me"/>
      </div>

      

      {/* Check-in Section */}
      <div className="w-full max-w-md bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-700/50">
        <div className="flex flex-col items-center gap-">
          {timeRemaining ? (
            <>
              <CircularProgress
                percentage={progressPercentager}
                size={100}
                remainingTime={timeRemaining}
                strokeWidth={12}
              />
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Next check-in available in {timeRemaining}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-yellow-400">
                <Gift className="w-5 h-5" />
                <span className="text-lg font-semibold">+3.14 Points</span>
              </div>
              <button
                onClick={handleCheckIn}
                className="w-full py-2 px-4 rounded-xl font-semibold text-lg
                  transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                  bg-yellow-400 hover:bg-yellow-500 text-purple-900 hover:scale-105 active:bg-yellow-600
                  flex items-center justify-center gap-2"
                aria-label="Check in now"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Claim Daily Reward
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wheel Section */}
      <div className="w-full relative max-w-md bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-[40px]">
      {/* Spins Counter */}
      {(isVIP || isVIP1) && (
        <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50 shadow-lg">
          <div className="flex items-center gap-2">
            {/* <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" /> */}
            <Target className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-gray-200">
              {remainingSpins}
            </span>
          </div>
        </div>
      )}
        <div className="flex flex-col items-center gap-1">
          <MemoizedWheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber || 0}
            data={data}
            backgroundColors={["#FFD700"]}
            textColors={['#000000']}
            onStopSpinning={() => {
              setMustSpin(false);
              setShowPrizeModal(true);
              const prize = prizeNumber !== null ? data[prizeNumber].option : null;

              if (prize) {
                const [amount, currency] = prize.split(" ");
                const parsedAmount = parseFloat(amount);

                if (!isNaN(parsedAmount)) {
                  switch (currency.toLowerCase()) {
                    case "pi":
                      dispatch(updateUserBalance(parsedAmount));
                      break;
                    case "pcm":
                      // dispatch(updateUserBalance(parsedAmount * 100));
                      break;
                    case "gfp":
                      dispatch(updateGFPBalance(parsedAmount));
                      break;
                    default:
                      console.warn(`Unhandled currency type: ${currency}`);
                  }
                }
              }
            }}
          />

          {(isVIP || isVIP1) && remainingSpins === 0 ? (
            <button
              onClick={handleBuySpins}
              disabled={mustSpin}
              className="w-full py-3 px-6 rounded-xl text-base font-semibold text-white 
                bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                transition-all duration-300 hover:scale-105"
            >
              Buy More Spins
            </button>
          ) : (
            <button
              onClick={handleSpinClick}
              disabled={mustSpin || (!isVIP && !isVIP1 && remainingSpins === 0)}
              className={`w-full py-3 px-6 rounded-xl text-base font-semibold text-white 
                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-300 hover:scale-105
                ${(mustSpin || (!isVIP && !isVIP1 && remainingSpins === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mustSpin ? 'Spinning...' : 
                (isVIP || isVIP1) ? 
                  (remainingSpins > 0 ? `Spin the Wheel (${remainingSpins} left)` : 'Out of Spins') : 
                  'Buy VIP to spin'}
            </button>
          )}
        </div>
      </div>

      {prizeNumber && (
        <PrizeModal
          isOpen={showPrizeModal}
          onClose={() => setShowPrizeModal(false)}
          prize={data[prizeNumber].option}
          onBuyVIP={handleBuyVIP}
        />
      )}

      <BuySpinDialog
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
