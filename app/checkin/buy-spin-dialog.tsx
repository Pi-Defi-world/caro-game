'use client'

import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { buySpins } from '@/redux/slices/auth'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog"

interface BuySpinDialogProps {
  isOpen: boolean
  onClose: () => void
}

const SPIN_COST = 0.5 

export const BuySpinDialog: React.FC<BuySpinDialogProps> = ({ isOpen, onClose }) => {
  const [spinsToBuy, setSpinsToBuy] = useState<string>("1")
  const [totalCost, setTotalCost] = useState<number>(SPIN_COST)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const sanitizedAmount = Number(spinsToBuy)
    if (!isNaN(sanitizedAmount)) {
      setTotalCost(sanitizedAmount * SPIN_COST)
    }
  }, [spinsToBuy])

  useEffect(() => {
    if (currentUser && totalCost > currentUser.GFP) {
      setError('Insufficient balance')
    } else {
      setError(null)
    }
  }, [totalCost, currentUser])

  const handleSpinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Remove any non-digit characters
    value = value.replace(/[^\d]/g, '')
    // Remove leading zeros
    value = value.replace(/^0+(?!$)/, '')
    // If empty, set to "1"
    if (value === '') value = "1"
    setSpinsToBuy(value)
  }

  const handleBuySpins = () => {
    const sanitizedAmount = Number(spinsToBuy)
    if (isNaN(sanitizedAmount) || sanitizedAmount < 1) {
      setError("Please enter a valid number of spins")
      return
    }

    if (currentUser && totalCost <= currentUser.GFP) {
      setLoading(true)
      dispatch(buySpins({
        amount: sanitizedAmount
      })).unwrap().then(() => {
        setLoading(false)
        onClose()
      }).catch((error) => {
        setError("Failed to purchase spins. Please try again.")
        setLoading(false)
      })
    }
  }

  if(!currentUser){
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/30" />
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl custom-border bg-[#191932] p-0 shadow-[0_0_30px_rgba(90,67,243,0.15)] backdrop-blur-sm">
        <DialogHeader className="bg-[#1e1e3a] p-6 rounded-t-xl border-b border-[#2e2e4a]">
          <DialogTitle className="text-center text-2xl font-bold text-white mb-2">
            Buy Spins
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="spinsToBuy" className="text-sm font-medium text-gray-200">
              Number of Spins to Buy
            </Label>
            <Input
              id="spinsToBuy"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={spinsToBuy}
              onChange={handleSpinsChange}
              className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalCost" className="text-sm font-medium text-gray-200">
              Total Cost (GFP) Points
            </Label>
            <div className="relative">
              <Input
                id="totalCost"
                type="text"
                value={totalCost.toFixed(2)}
                disabled
                className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <p className="text-yellow-500 font-bold">GFP</p>
              </div>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          <div className="flex justify-between items-center pt-2">
            <div className='flex items-center gap-1'>
              <p className="text-sm text-gray-400">
                Balance: 
              </p>
              <div className="flex items-center">
                <span className="text-yellow-500 font-bold">{(currentUser.GFP - totalCost).toFixed(2)}</span>
                <p className="text-yellow-500 font-bold ml-2">GFP</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-12 rounded-xl bg-[#1e1e3a] hover:bg-[#2e2e4a] border-0 text-white font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuySpins}
              disabled={!!error || !currentUser || loading}
              className="h-12 rounded-xl bg-[#5a43f3] hover:bg-[#4a33e3] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buy Spins"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
