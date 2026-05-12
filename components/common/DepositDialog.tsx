"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { deposit, withdrawPi } from "@/redux/slices/payment"
import { fetchUserBalance } from "@/redux/slices/auth"
import { Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { DialogOverlay } from "@/components/ui/dialog"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  action: "deposit" | "withdraw"
}

export function DepositModal({ isOpen, onClose, action }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [trx_hash, setTrxHash] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [successData, setSuccessData] = useState<{ amount: number; walletAddress: string } | null>(null)
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)

  const validateAmount = (): boolean => {
    const sanitizedAmount = Number.parseFloat(amount)
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      setError("Amount must be greater than 0.")
      return false
    }

    // Check if withdrawal amount exceeds balance
    if (action === "withdraw" && currentUser?.balance && sanitizedAmount > currentUser.balance) {
      setError(`Insufficient balance. Your current balance is ${currentUser.balance.toFixed(1)} π`)
      return false
    }

    setError(null)
    return true
  }

  const validateWalletAddress = (): boolean => {
    if (action === "withdraw" && !walletAddress.trim()) {
      setError("Wallet address is required for withdrawal.")
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

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (action === "withdraw") {
      e.preventDefault()
    }
  }

  const handleDeposit = async () => {
    if (!validateAmount()) return

    const sanitizedAmount = Number.parseFloat(amount)
    setLoading(true)

    try {
      await dispatch(
        deposit({
          amount: sanitizedAmount,
          memo: "Deposit",
          paymentMetadata: {
            memo: "Deposit",
            amount: sanitizedAmount,
          },
        }),
      )
        .unwrap()
        .then(() => dispatch(fetchUserBalance()))

      setAmount("")
      onClose()
    } catch (error) {
      setError("Failed to process deposit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!validateAmount() || !validateWalletAddress()) return

    const sanitizedAmount = Number.parseFloat(amount)
    setLoading(true)

    try {
      await dispatch(
        withdrawPi({
          amount: sanitizedAmount,
          walletAddress: walletAddress.trim(),
        }),
      )
        .unwrap()
        .then((res) => {
          dispatch(fetchUserBalance())
          setTrxHash(res.trx_hash)
          setTime(new Date(res.createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
            year: "numeric",
          }))
        })

      // Set success data and show success screen
      setSuccessData({
        amount: sanitizedAmount,
        walletAddress: walletAddress.trim(),
      })
      setWithdrawSuccess(true)
    } catch (error) {
      setError("Failed to process withdrawal. Please try again.")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (action === "deposit") {
      handleDeposit()
    } else {
      handleWithdraw()
    }
  }

  const resetForm = () => {
    setAmount("")
    setWalletAddress("")
    setError(null)
    setLoading(false)
    setWithdrawSuccess(false)
    setSuccessData(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Success Screen Component
  const SuccessScreen = () => (
    <div className="p-4 text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle className="w-12 h-12 text-white animate-bounce" />
        </div>
        <div className="absolute inset-0 w-20 h-20 mx-auto bg-green-400 rounded-full animate-ping opacity-20"></div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white">Congratulations!</h2>
        <p className="text-gray-300 text-lg">Your withdrawal has been processed successfully</p>
      </div>

      <div className="bg-[#1e1e3a] border border-[#2e2e4a] rounded-xl p-2 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Amount:</span>
          <span className="text-yellow-500 font-semibold text-lg">{successData?.amount.toFixed(1)} π</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Time:</span>
          <span className="text-white font-mono text-sm">
            {time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">To:</span>
          <span className="text-white font-mono text-sm">
            {successData?.walletAddress.slice(0, 6)}...{successData?.walletAddress.slice(-6)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Hash:</span>
          <a
            href={`https://blockexplorer.minepi.com/testnet/transactions/${trx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm"
          >
            {trx_hash.slice(0, 6)}...{trx_hash.slice(-6)}
          </a>
        </div>
      </div>

      {/* <div className="bg-gradient-to-r from-[#5a43f3]/10 to-[#4a33e3]/10 border border-[#5a43f3]/20 rounded-xl p-4">
        <div className="flex items-center justify-center space-x-2 text-[#5a43f3]">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm font-medium">Transaction is being processed</span>
        </div>
        <p className="text-gray-400 text-xs mt-2">Your π coins will be transferred to your wallet shortly</p>
      </div> */}

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
        {withdrawSuccess && action === "withdraw" ? (
          <SuccessScreen />
        ) : (
          <>
            <DialogHeader className="bg-[#1e1e3a] p-6 rounded-t-xl border-b border-[#2e2e4a]">
              <DialogTitle className="text-center text-2xl font-bold text-white mb-2">
                {action === "deposit" ? "Deposit π" : "Withdraw π"}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                {action === "deposit"
                  ? "Enter the amount of π you want to deposit"
                  : "Enter the amount and wallet address for withdrawal"}
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 space-y-3">
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
                    onPaste={handlePaste}
                    placeholder="Enter amount"
                    min={1}
                    className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {action === "withdraw" && (
                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-sm font-medium text-gray-200">
                    Wallet Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="walletAddress"
                      type="text"
                      value={walletAddress}
                      onChange={handleWalletAddressChange}
                      placeholder="Enter wallet address"
                      className="h-12 bg-[#1e1e3a] border-0 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-[#5a43f3] focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              )}

              {action === "withdraw" && currentUser?.balance && (
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
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-12 rounded-xl bg-[#5a43f3] hover:bg-[#4a33e3] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : action === "deposit" ? (
                    "Deposit"
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
