import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronRight, Gift } from 'lucide-react'
import { ICharacter, purchaseCharatcer } from "@/redux/slices/characters"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useState } from "react"
import { deposit } from "@/redux/slices/payment"
import { updateBalance } from "@/redux/slices/auth"
import { toast } from 'react-toastify'
import { LoginDrawer } from "@/components/drawers/LoginDrawer"

export interface CharacterDialogProps {
  character: ICharacter
  isOpen: boolean
  onClose: () => void
  onNext: () => void
}

export function CharacterDialog({ character, isOpen, onClose, onNext }: CharacterDialogProps) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const dispatch = useAppDispatch()
  const { isPurchasing } = useAppSelector(state => state.pets)
  const { currentUser } = useAppSelector(state => state.auth)

  const handleBuyCharacter = async (a: ICharacter) => {
    if (!currentUser) {
      setOpen(true)
      return
    }

    if (currentUser.balance < a.price) {
      dispatch(deposit({
        amount: a.price - currentUser.balance,
        memo: "deposit to buy character",
        paymentMetadata: {
          characterId: a._id,
        }
      }))
      return
    }

    setIsProcessing(true)
    dispatch(purchaseCharatcer(a._id)).unwrap().then(() => {
      dispatch(updateBalance(-a.price))
      toast.success("Purchase succesful", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        closeButton: false,
      })
    }).finally(() => {
      setIsProcessing(false)
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl bg-[#0A0A1B] border-[3px] border-[#00FFFF]/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          <DialogHeader className="relative">
            <DialogTitle className=""></DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py- relative">
            <div className="relative aspect-square rounded-xl overflow-hidden border-[3px] border-[#00FFFF]/30 group">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00FFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <img src={character.image} alt={character.benefit[1]} className="w-full transform group-hover:scale-110 transition-all duration-500" />
              <div className='absolute top-3 left-3 rounded-lg px-3 py-1.5 bg-black/80 border border-[#00FFFF]/50 backdrop-blur-sm'>
                <div className="text-sm text-[#00FFFF] font-mono font-bold">{character.remaining}/{character.quantity}</div>
              </div>
            </div>
            <div className="">
              {character.benefit.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 rounded-lg p-2.5 mb-2 last:mb-0
                    bg-[#0a0a23]/50 hover:bg-[#00FFFF]/10
                    border border-[#00FFFF]/20 hover:border-[#00FFFF]/40
                    transform hover:translate-x-1 hover:scale-[1.02]
                    transition-all duration-300 ease-out
                    group"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] group-hover:animate-pulse">
                    <Gift className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-gradient-to-b cursor-pointer py-1 from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black text-lg rounded-xl transform hover:scale-105 transition-all duration-300 shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] active:shadow-[0_0_0_rgb(202,138,4)] active:translate-y-1"
              onClick={() => handleBuyCharacter(character)}
              disabled={isPurchasing || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PROCESSING...
                </div>
              ) : currentUser && currentUser.balance < character.price ? (
                `DEPOSIT ${character.price - currentUser.balance} PI TO UNLOCK`
              ) : (
                `${character.price} PI - UNLOCK NOW`
              )}
            </Button>
            <Button
              onClick={onNext}
              className="absolute top-1/2 -translate-y-1/2 -right-5 bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] rounded-full p-3 shadow-[0_0_15px_rgba(0,255,255,0.4)] transform hover:scale-110 transition-all duration-300 hover:rotate-180"
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LoginDrawer
        isDrawerOpen={open}
        setIsDrawerOpen={setOpen}
      />
    </>
  )
}
