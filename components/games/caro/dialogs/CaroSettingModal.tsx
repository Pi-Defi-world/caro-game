"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Facebook, MessageCircle, Music, PaintBucket, RotateCcw, Volume2, X } from "lucide-react"
import Link from "next/link"
import type React from "react"
import type { SetStateAction } from "react"

interface ISettingDialogProps {
  open: boolean
  setOpen: React.Dispatch<SetStateAction<boolean>>
}

const CaroSettingDialog: React.FC<ISettingDialogProps> = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] bg-[#FFF3E0] border-4 border-[#8B4513] rounded-2xl p-0 shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-visible">
        <div className="relative">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-[calc(100%+1rem)] z-10">
            <div className="relative h-12 bg-[#5D3A22] rounded-full flex items-center justify-between px-1">
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-56">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#DEB887] rounded-full transform scale-y-75" />
                  <h2 className="relative text-2xl font-semibold text-[#8B4513] text-center py-1">Settings</h2>
                </div>
              </div>

              <div className="float-right ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[#DEB887] border-2 border-[#8B4513] hover:bg-[#D2691E]"
                  onClick={handleClose}
                >
                  <X className="h-6 w-6 text-[#8B4513]" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 pt-8">
            <div className="flex items-center gap-4 p-3 bg-[#FFE4C4] rounded-lg">
              <div className="h-12 w-12 bg-[#DEB887] rounded-lg flex items-center justify-center">
                <svg className="h-8 w-8 text-[#8B4513]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg font-medium text-[#8B4513]">Soleil</div>
              </div>
              <Button size="icon" variant="default" className="bg-green-600 hover:bg-green-700">
                <PaintBucket className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-[#8B4513]" />
                  <span className="text-[#8B4513]">Music</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-[#8B4513]" />
                  <span className="text-[#8B4513]">Sound Effects</span>
                </div>
                <Switch className="data-[state=checked]:bg-green-600" />
              </div>
            </div>

            <div className="space-y-4">
              <Link href="#facebook" className="flex items-center justify-between p-2 hover:bg-[#FFE4C4] rounded-lg">
                <div className="flex items-center gap-2 text-[#8B4513]">
                  <Facebook className="h-5 w-5" />
                  <span>Join Facebook Group</span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#8B4513]" />
              </Link>
              <Link href="#telegram" className="flex items-center justify-between p-2 hover:bg-[#FFE4C4] rounded-lg">
                <div className="flex items-center gap-2 text-[#8B4513]">
                  <MessageCircle className="h-5 w-5" />
                  <span>Join Telegram Group</span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#8B4513]" />
              </Link>
            </div>

            <div className="flex justify-end">
              <Button className="bg-green-600 hover:bg-green-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CaroSettingDialog

