import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { spinTheWheel } from '@/redux/slices/auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { Gift } from 'lucide-react'

interface PrizeModalProps {
  isOpen: boolean
  onClose: () => void
  prize: string
  onBuyVIP: () => void
}

// Function to generate random spark properties
const generateSpark = () => ({
  id: Math.random(),
  x: Math.random() * 100 - 50, // Random X between -50 and 50
  y: Math.random() * 100 - 50, // Random Y between -50 and 50
  size: Math.random() * 4 + 2, // Random size between 2 and 6
  duration: Math.random() * 1 + 0.5, // Random duration between 0.5 and 1.5
  delay: Math.random() * 0.5, // Random delay up to 0.5
})

export const PrizeModal: React.FC<PrizeModalProps> = ({ isOpen, onClose, prize, onBuyVIP }) => {
  const dispatch = useAppDispatch()
  const [showPrize, setShowPrize] = useState(false)
  const [sparks, setSparks] = useState<ReturnType<typeof generateSpark>[]>([] as ReturnType<typeof generateSpark>[])

  useEffect(() => {
    if (prize) {
      const amount = prize.split(" ")[0]
      const currency = prize.split(" ")[1]
      dispatch(spinTheWheel({
        amount: parseFloat(amount),
        prize: currency
      }))
    }
  }, [prize, dispatch])

  useEffect(() => {
    if (isOpen) {
      // Delay showing the prize to allow for chest animation
      const timer = setTimeout(() => {
        setShowPrize(true)
        // Generate sparks when prize is revealed
        const newSparks = Array.from({ length: 20 }).map(generateSpark)
        setSparks(newSparks)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setShowPrize(false)
      setSparks([]) // Clear sparks when modal is closed
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/30" />
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl custom-border bg-[#191932] p-0 shadow-[0_0_30px_rgba(90,67,243,0.15)] backdrop-blur-sm overflow-hidden">
        <DialogHeader className="bg-[#1e1e3a] p-6 rounded-t-xl border-b border-[#2e2e4a]">
          <DialogTitle className="text-center text-2xl font-bold text-white mb-2">
            Congratulations!
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="text-center relative h-48 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!showPrize ? (
                <motion.div
                  key="chest"
                  initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 1.5, opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute"
                >
                  <Gift className="w-24 h-24 text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="prize"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="absolute flex flex-col items-center justify-center"
                >
                  {/* Realistic Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-400 opacity-70 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.9, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                   <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-300 opacity-50 blur-lg"
                    animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white opacity-30 blur-md"
                    animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />

                  {/* Sparkle Effect */}
                  <AnimatePresence>
                    {sparks.map((spark) => (
                      <motion.div
                        key={spark.id}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 0, x: spark.x, y: spark.y, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: spark.duration, delay: spark.delay }}
                        className="absolute rounded-full bg-white"
                        style={{ width: spark.size, height: spark.size }}
                      />
                    ))}
                  </AnimatePresence>

                  <p className="text-3xl font-bold text-yellow-500 relative z-10">
                    {prize}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={onBuyVIP}
              className="h-12 rounded-xl bg-[#5a43f3] hover:bg-[#4a33e3] text-white font-medium"
            >
              Buy more spin using GFP points
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="h-12 rounded-xl bg-[#1e1e3a] hover:bg-[#2e2e4a] border-0 text-white font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

