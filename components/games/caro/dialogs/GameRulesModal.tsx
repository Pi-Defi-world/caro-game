"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { List } from "lucide-react"
import type React from "react"

interface GameRulesModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CaroGameRulesModal: React.FC<GameRulesModalProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-[380px] rounded-[24px] border-4 border-[#8B3A3A] bg-[#FFF3D4] p-0 shadow-[0_0_20px_rgba(0,0,0,0.3)] max-h-[500px] flex flex-col z-50">
        <DialogHeader className="bg-[#8B3A3A] p-3 sm:rounded-t-[17px]">
          <DialogTitle className="text-center flex justify-center items-center text-2l font-bold text-[#FFF3D4] font-game">
            <List className="w-5 h-5 mr-2"/>
            Game Rules
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 p-2 overflow-y-auto flex-grow">
          <div className="grid gap-2">
            <h3 className="font-bold text-[#4A1D1D]">How to Play</h3>
            <p className="text-[#4A1D1D] text-xs md:text-sm">
              In Caro, your goal is to be the first to connect 5 of your marks in a row - horizontally, vertically, or
              diagonally. But winning isn't just about placing pieces:
            </p>
            <ul className="text-[#4A1D1D] text-xs md:text-sm list-disc list-inside space-y-1">
              <li>Strategize your moves: Plan several steps ahead to outsmart your opponent.</li>
              <li>Create multiple threats: Force your opponent to defend, opening up opportunities for you.</li>
              <li>
                Use deception: Set up traps by creating seemingly harmless patterns that can quickly turn into winning
                moves.
              </li>
              <li>Block wisely: Don't just react - block in ways that also advance your own position.</li>
              <li>Control the center: Dominating the middle of the board often leads to more winning opportunities.</li>
            </ul>
            <p className="text-[#4A1D1D] text-xs md:text-sm mt-2"><mark>
              Remember, in Caro, every move counts. A single misplaced piece could be the difference between victory and
              defeat. Stay alert, think creatively, and may the best strategist win! </mark>
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="font-bold text-[#B71C1C]">⚠️ Warning!</h3>
            <ul className="text-[#4A1D1D] list-disc list-inside space-y-1 text-xs md:text-sm">
              <li>You must be <strong>18 years or older</strong> to play GameFi.</li>
              <li>
                You are responsible for your own financial profits and risks, and must comply with and accept our platform's <strong>Terms of Service</strong>.
              </li>
              <li>
                <strong>Any cheating</strong> in the game may result in your account and assets being <span className="text-[#C0392B] font-bold">permanently frozen</span>.
              </li>
            </ul>
          </div>
          {/* <div className="grid gap-1">
            <h3 className="font-bold text-[#4A1D1D]">Pet Advantages</h3>
            <ul className="text-[#4A1D1D] list-disc list-inside space-y-1 text-xs md:text-sm">
              <li>Buy and activate a pet to **increase playtime & double rewards**</li>
              <li>Normal playtime: 15 seconds per turn</li>
              <li>With activated pet: 30 seconds per turn</li>
              <li>Win with activated pet: Double GFP points</li>
              <li>GFP points are based on the room fee (5% of the bet)</li>
              <li>If a user has an activated pet, they earn double GFP points</li>
            </ul>
            <p className="text-[#4A1D1D] text-xs md:text-sm mt-1">
              Example: If the room bet is 100 Pi, the room fee is 5 Pi, meaning the GFP reward is 5 GFP.  
              With an activated pet, the winner earns **double** (10 GFP).  
              The more you bet, the more GFP points you can earn.
            </p>
          </div>
   */}


          <div className="grid gap-1">
            <h3 className="font-bold text-[#4A1D1D]">Room Etiquette</h3>
            <p className="text-[#4A1D1D] text-xs md:text-sm">
              Players can freely join or leave the room before the game starts. Once the host starts the match, leaving
              will count as a forfeit.
            </p>
          </div>
          <div className="grid gap-1 mt-4">
            <h3 className="font-bold text-[#4A1D1D]">Disclaimer</h3>
            <p className="text-[#4A1D1D] text-xs md:text-sm">
              <strong>Pi Games</strong> is a peer-to-peer gaming platform that facilitates fair play.  
              While **in-game transactions and Pi handling** are managed by **Pi Games**,  
              all gameplay decisions, strategies, and outcomes are **solely between players**.  
              GAMEFI does not interfere with matches, bets, or winnings.  
              Play responsibly and enjoy the game! 🎮✨
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-2 p-2 bg-[#FFF3D4] rounded-b-[24px]">
          <Button
            size="sm"
            onClick={() => setOpen(false)}
            variant="secondary"
            className="flex-1 bg-[#E74C3C] hover:bg-[#C0392B] text-white text-sm font-bold py-1 rounded-xl shadow-[0_4px_0_#922B21] hover:shadow-[0_2px_0_#922B21] hover:translate-y-[2px] transition-all"
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setOpen(false)
              localStorage.setItem("hasAccepted","true")
            }
            }
            className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white text-sm font-bold py-1 rounded-xl shadow-[0_4px_0_#196F3D] hover:shadow-[0_2px_0_#196F3D] hover:translate-y-[2px] transition-all"
          >
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CaroGameRulesModal

