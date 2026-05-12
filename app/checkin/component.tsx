'use client'

import React, { useState, useEffect, memo } from "react"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axiosClient from "@/lib/axios"
import {  updateCheckinDate, updateGFPBalance,updateUserBalance,updateUserSpin } from "@/redux/slices/auth"
import { Wheel } from 'react-custom-roulette'
import {  Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { CircularProgress } from "@/components/me/Circular"
import { PrizeModal } from "@/components/me/PrizeModal"
import { BuySpinDialog } from "./buy-spin-dialog"

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
  const [prizeNumber, setPrizeNumber] = useState<number| null>(null)
  const [mustSpin, setMustSpin] = useState(false)
  const [showPrizeModal, setShowPrizeModal] = useState(false)
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
          setProgressPercentager(100)
        } else {
          const hours = String(Math.floor((remainingTime / (1000 * 60 * 60)) % 24)).padStart(2, "0")
          const minutes = String(Math.floor((remainingTime / (1000 * 60)) % 60)).padStart(2, "0")
          const seconds = String(Math.floor((remainingTime / 1000) % 60)).padStart(2, "0")

          setTimeRemaining(`${hours}:${minutes}:${seconds}`)
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
    <div className="flex flex-col items-center gap-2">
    <div className="w-full">
     {/* <BackNav link="/me" title="Daily checkin"/> */}
    </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Total Points</span>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg py-1 px-2">
            <span className="text-yellow-500 font-bold text-xl">{currentUser?.GFP.toFixed(2)}</span>
            <Image className="w-8 h-8" src="/coin.png" width={32} height={32} alt="Coin" />
          </div>
        </div>
        <div className="rounded-full p-2 flex items-center justify-center border-2 border-purple-500 bg-purple-900">
          <div className="text-sm text-white rounded-full w-7 h-7 flex flex-col items-center justify-center">
            <span className="font-semibold text-xs">+3.14</span>
            <span className="font-semibold text-xs">Today</span>
          </div>
        </div>
      </div>

      <div className=" p-2 rounded-2xl shadow-md">
        {timeRemaining ? (
          <CircularProgress
            percentage={progressPercentager}
            size={100}
            remainingTime={timeRemaining}
            strokeWidth={12}
          />
        ) : (
          <div className="text-center">
            <button
              onClick={handleCheckIn}
              className="py-1 px-3 rounded-full  font-semibold
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                bg-yellow-400 hover:bg-yellow-500 text-purple-900 hover:scale-105 active:bg-yellow-600"
              aria-label="Check in now"
            >
              {
                loading ? <Loader className=" w-4 h-4 animate-spin"/> : "Sign In"
              }
            </button>
          </div>
        )}
      </div>

      <div className='flex flex-col justify-center items-center'>
        <MemoizedWheel
          mustStartSpinning={mustSpin}
          //@ts-expect-error
          prizeNumber={prizeNumber}
          data={data}
          backgroundColors={["yellow"]}
          textColors={['#ffffff']}
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
            } else {
              console.error(`Invalid amount: ${amount}`);
            }
          }
        }}
        />
        <div className="flex flex-col items-center mt-3">
          {(isVIP || isVIP1) && remainingSpins === 0 ? (
            <button
              onClick={handleBuySpins}
              disabled={mustSpin}
              className="mt-4 px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Buy More Spins
            </button>
          ) : (
            <button
              onClick={handleSpinClick}
              disabled={mustSpin || (!isVIP && !isVIP1 && remainingSpins === 0)}
              className={`px-6 py-2 text-sm font-semibold text-white shadow-[2px_3px_2px_#1D4ED8] bg-[#0000FF] rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                (mustSpin || (!isVIP && !isVIP1 && remainingSpins === 0)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {mustSpin ? 'Spinning...' : (isVIP || isVIP1) ? (remainingSpins > 0 ? `Spin the Wheel (${remainingSpins} spin left)` : 'Out of Spins') : 'Buy VIP to spin'}
            </button>
          )}
        </div>
      </div>

      {prizeNumber && <PrizeModal
        isOpen={showPrizeModal}
        onClose={() => setShowPrizeModal(false)}
        prize={data[prizeNumber].option}
        onBuyVIP={handleBuyVIP}
      />}

      <BuySpinDialog
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
