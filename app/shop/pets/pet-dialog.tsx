import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Gift } from 'lucide-react'
import { IPET, purchasePet } from "@/redux/slices/pets"
import { useAppDispatch } from "@/redux/hooks"
import { useAppSelector } from "@/redux/hooks"
import { useState } from "react"
import { deposit } from "@/redux/slices/payment"
import { updateBalance } from "@/redux/slices/auth";
import {toast } from 'react-toastify';
import { LoginDrawer } from "@/components/drawers/LoginDrawer"

export interface PetProps {
  pet: IPET
  isOpen: boolean
  onClose: () => void
  onNext: () => void
}

export function PetModal({ pet, isOpen, onClose, onNext }: PetProps) {

  const [open,setOpen] = useState(false)

  const dispatch = useAppDispatch()
  const {isPurchasing} = useAppSelector(state => state.pets)
  const {currentUser} = useAppSelector(state => state.auth)

  const handleBuyPet=async(a:IPET)=>{
    if (!currentUser) {
      setOpen(true)
      return
    }

    if (currentUser.balance < a.price) {
      dispatch(deposit({amount: a.price - currentUser.balance, memo: "deposit to buy pet", paymentMetadata: {
      petId:a._id,
    }}
      ))
      return
    }

    dispatch(purchasePet(a._id)).unwrap().then(() => {
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
      });
    })
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-xl bg-[#0A0A1B] border-[3px] border-[#00FFFF]/30 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        <DialogHeader className="relative">
          {/* <div className="absolute -top-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent"></div> */}
          <DialogTitle className="">
    
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py- relative">
          <div className="relative aspect-square rounded-xl overflow-hidden border-[3px] border-[#00FFFF]/30 group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00FFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <img src={pet.image} alt={pet.benefit[1]} className="w-full transform group-hover:scale-110 transition-all duration-500" />
            <div className='absolute top-3 left-3 rounded-lg px-3 py-1.5 bg-black/80 border border-[#00FFFF]/50 backdrop-blur-sm'>
              <div className="text-sm text-[#00FFFF] font-mono font-bold">{pet.remaining}/{pet.quantity}</div>
            </div>
          </div>
          <div className="">
            {pet.benefit.map((benefit, index) => (
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
                  <Gift className="w-5 h-5 text-black"/>
                </div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full bg-gradient-to-b cursor-pointer py-1 from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black text-lg rounded-xl transform hover:scale-105 transition-all duration-300 shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] active:shadow-[0_0_0_rgb(202,138,4)] active:translate-y-1" 
            onClick={() => handleBuyPet(pet)}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                PROCESSING...
              </>
            ) : currentUser && currentUser.balance < pet.price ? (
              `DEPOSIT ${pet.price - currentUser.balance} PI TO UNLOCK`
            ) : (
              `${pet.price} PI - UNLOCK NOW`
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
