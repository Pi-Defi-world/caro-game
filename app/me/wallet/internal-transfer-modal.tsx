"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
// import { internalTransfer } from "@/redux/slices/payment"
import { fetchUserBalance } from "@/redux/slices/auth"
import { Loader2, Send, User, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { DialogOverlay } from "@/components/ui/dialog"

interface InternalTransferModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InternalTransferModal({ isOpen, onClose }: InternalTransferModalProps) {
  const [amount, setAmount] = useState("")
  const [recipientUsername, setRecipientUsername] = useState("")
  const [memo, setMemo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transferSuccess, setTransferSuccess] = useState(false)
  const [successData, setSuccessData] = useState<{ amount: number; recipient: string } | null>(null)

  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)

  const validateAmount = (): boolean => {
    const sanitizedAmount = Number.parseFloat(amount)
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      setError("Amount must be greater than 0.")
      return false
    }

    if (currentUser?.balance && sanitizedAmount > currentUser.balance) {
      setError(`Insufficient balance. Your current balance is ${currentUser.balance.toFixed(1)} π`)
      return false
    }

    setError(null)
    return true
  }

  const validateRecipient = (): boolean => {
    if (!recipientUsername.trim()) {
      setError("Recipient username is required.")
      return false
    }
    return true
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^\d.]/g, "")
    value = value.replace(/^0+(?!\.)/, "")
    const parts = value.split(".")
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("")
    }
    if (value.startsWith("-")) value = value.replace("-", "")
    setAmount(value)
  }

  const handleTransfer = async () => {
    if (!validateAmount() || !validateRecipient()) return

    const sanitizedAmount = Number.parseFloat(amount)
    setLoading(true)

    try {
    //   await dispatch(
    //     internalTransfer({
    //       amount: sanitizedAmount,
    //       recipientUsername: recipientUsername.trim(),
    //       memo: memo.trim() || "Internal transfer",
    //     }),
    //   )
    //     .unwrap()
    //     .then(() => dispatch(fetchUserBalance()))

      setSuccessData({
        amount: sanitizedAmount,
        recipient: recipientUsername.trim(),
      })
      setTransferSuccess(true)
    } catch (error) {
      setError("Failed to process transfer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setAmount("")
    setRecipientUsername("")
    setMemo("")
    setError(null)
    setLoading(false)
    setTransferSuccess(false)
    setSuccessData(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const SuccessScreen = () => (
    <div className="p-8 text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle className="w-12 h-12 text-white animate-bounce" />
        </div>
        <div className="absolute inset-0 w-20 h-20 mx-auto bg-emerald-400 rounded-full animate-ping opacity-20"></div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white">Transfer Successful!</h2>
        <p className="text-gray-300 text-lg">Your π coins have been sent successfully</p>
      </div>

      <div className="bg-[#1e1e3a] border border-[#2e2e4a] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Amount:</span>
          <span className="text-yellow-500 font-semibold text-lg">{successData?.amount.toFixed(1)} π</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">To:</span>
          <span className="text-white font-medium">@{successData?.recipient}</span>
        </div>
      </div>

      <Button
        onClick={handleClose}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#5a43f3] to-[#4a33e3] hover:from-[#4a33e3] hover:to-[#3a23d3] text-white font-medium transition-all duration-300 transform hover:scale-105"
      >
        Done
      </Button>
    </div>
  )

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!loading) {
          handleClose()
        }
      }}
    >
      <DialogOverlay className="backdrop-blur-sm bg-black/30" />
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl custom-border bg-[#191932] p-0 shadow-[0_0_30px_rgba(90,67,243,0.15)] backdrop-blur-sm">
        {transferSuccess ? (
          <SuccessScreen />
        ) : (
          <>
            <DialogHeader className="bg-[#1e1e3a] p-6 rounded-t-xl border-b border-[#2e2e4a]">
              <DialogTitle className="text-center text-2xl font-bold text-white mb-2">Internal Transfer</DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                Send π coins to another user instantly
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-sm font-medium text-gray-200">
                  Recipient Username
                </Label>
                <div className="relative">
                  <Input
                    id="recipient"
                    type="text"
                    value={recipientUsername}
                    onChange={(e) => setRecipientUsername(e.target.value)}
                    placeholder="Enter username"
                    className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0 pl-11"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
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
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0 pl-11"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Send className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo" className="text-sm font-medium text-gray-200">
                  Memo (Optional)
                </Label>
                <Input
                  id="memo"
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Add a note"
                  className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0"
                />
              </div>

              {currentUser?.balance && (
                <div className="bg-[#1e1e3a] border border-[#2e2e4a] rounded-xl p-3">
                  <p className="text-gray-300 text-sm text-center">
                    Available Balance:{" "}
                    <span className="text-yellow-500 font-medium">{currentUser.balance.toFixed(1)} π</span>
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  disabled={loading}
                  className="h-12 rounded-xl bg-[#1e1e3a] hover:bg-[#2e2e4a] border-0 text-white font-medium disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTransfer}
                  disabled={loading}
                  className="h-12 rounded-xl bg-[#5a43f3] hover:bg-[#4a33e3] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
