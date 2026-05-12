/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Settings, ArrowDown, ArrowLeft } from 'lucide-react'
import Image from "next/image"
import { useAppDispatch } from "@/redux/hooks"
import { deposit } from "@/redux/slices/payment"

export default function DepositPage() {
  const [amount, setAmount] = useState("0")
    const [selectedWallet, setSelectedWallet] = useState("pi")
    const dispatch = useAppDispatch();

  const handleNumberClick = (num: string) => {
    if (amount === "0" && num !== ".") {
      setAmount(num)
    } else {
      setAmount(prev => {
        if (num === "." && prev.includes(".")) return prev
        return prev + num
      })
    }
  }

  const handleBackspace = () => {
    setAmount(prev => {
      if (prev.length <= 1) return "0"
      return prev.slice(0, -1)
    })
  }

  const toggleWallet = () => {
    setSelectedWallet(prev => prev === "pi" ? "pcm" : "pi")
  }
    
      const handleDeposit = async () => {
        const sanitizedAmount = parseFloat(amount);
    
        if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
          return;
        }
    
        await dispatch(
          deposit({
            amount: sanitizedAmount,
            memo: "Deposit",
            paymentMetadata: {
              memo: "Deposit",
              amount: sanitizedAmount,
            },
          })
        );
    
        setAmount("");
      };

  return (
    <div className="min-h-screen bg-black text-white">
      

      
      <div className="p-4 space-y-2">
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={amount}
              readOnly
              className="bg-transparent text-3xl font-light w-full outline-none"
            />
            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
              <span>PI</span>
            </div>
          </div>
        </div>

        {/* <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-gray-900 p-2 rounded-full">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div> */}

        {/* <div className="bg-gray-900 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-light">Deposit to</span>
            <button 
              onClick={toggleWallet}
              className="bg-purple-500 hover:bg-purple-600 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            >
              {selectedWallet === "pi" ? "Pi Wallet" : "PCM Wallet"}
            </button>
          </div>
        </div> */}
      </div>
      <div className="fixed bottom-10 left-0 right-0 bg-gray-900 p-4 pb-8">
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="text-2xl font-light h-12 hover:bg-gray-800 rounded-full transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberClick(".")}
            className="text-2xl font-light h-12 hover:bg-gray-800 rounded-full transition-colors"
          >
            .
          </button>
          <button
            onClick={() => handleNumberClick("0")}
            className="text-2xl font-light h-12 hover:bg-gray-800 rounded-full transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="flex items-center justify-center h-12 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <button onClick={handleDeposit} className="w-full mt-4 bg-purple-500 hover:bg-purple-600 rounded-full py-3 text-center font-medium transition-colors">
          Deposit
        </button>
      </div>
    </div>
  )
}

