"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Play, Home, Plus, Trophy } from "lucide-react"
import { Chat } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { ChatDrawer } from "@/components/chat/ChatDrawer"
import CaroCreateRoomDialog from "@/components/games/caro/dialogs/CaroCreateRoomDialog"

export default function CaroBottomNavigation() {
  const pathname = usePathname()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChatClick = () => {
    setIsChatOpen((p) => !p)
  }

  const handleCreateRoomClick = () => {
    setIsCreateRoomOpen((prev) => !prev)
  }

  const isActive = (path: string) => {
    return pathname === path && !isChatOpen
  }

  if (!mounted) return null

  return (
    <>
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <CaroCreateRoomDialog open={isCreateRoomOpen} setOpen={setIsCreateRoomOpen} />

      <div className="fixed bottom-1 left-0 right-0 z-50 flex justify-center items-center md:hidden px-3">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative w-full max-w-md"
        >
          {/* Main navigation bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-full h-13 flex items-center justify-between px-6 shadow-lg border border-white/10">
            {/* Lobby (renamed from My Rooms) */}
            <NavItem
              href="/games/caro"
              icon={<Trophy className="h-5 w-5" />}
              label="Lobby"
              isActive={isActive("/games/caro")}
              onClick={() => setIsChatOpen(false)}
            />

            {/* Playing */}
            <NavItem
              href="/games/caro/playing"
              icon={<Play className="h-5 w-5" />}
              label="Playing"
              isActive={isActive("/games/caro/playing")}
              onClick={() => setIsChatOpen(false)}
            />

            {/* Center placeholder for the floating button */}
            <div className="w-11 h-4"></div>

            {/* Online */}
            <NavItem
              href="/games/caro/online"
              icon={<Users className="h-5 w-5" />}
              label="Online"
              isActive={isActive("/games/caro/online")}
              onClick={() => setIsChatOpen(false)}
            />

            {/* Chat */}
            <button onClick={handleChatClick} className="flex flex-col items-center justify-center relative">
              <div
                className={`flex items-center justify-center transition-colors duration-300 ${
                  isChatOpen ? "text-yellow-400" : "text-white/70 hover:text-white"
                }`}
              >
                <Chat className="h-5 w-5" />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-300 ${
                  isChatOpen ? "text-yellow-400" : "text-white/70"
                }`}
              >
                Chat
              </span>
              {isChatOpen && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-yellow-400"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          </div>

          {/* Floating center button - Create Room */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCreateRoomClick}
            className="absolute left-1/2 -translate-x-1/2 -top-5 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-slate-950 cursor-pointer"
          >
            <Plus className="h-7 w-7 text-white" />
          </motion.button>
        </motion.nav>
      </div>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link href={href} onClick={onClick} className="flex flex-col items-center justify-center relative">
      <div
        className={`flex items-center justify-center transition-colors duration-300 ${
          isActive ? "text-yellow-400" : "text-white/70 hover:text-white"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-[10px] font-medium transition-colors duration-300 ${
          isActive ? "text-yellow-400" : "text-white/70"
        }`}
      >
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-yellow-400"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
    </Link>
  )
}
