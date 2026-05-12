"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gamepad2, User, Home, ShoppingBag, Plus } from "lucide-react"
import { Chat } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { ChatDrawer } from "../chat/ChatDrawer"
import CaroCreateRoomDialog from "../games/caro/dialogs/CaroCreateRoomDialog"

interface BottomNavigationProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BottomNavigation({ setIsSidebarOpen }: BottomNavigationProps) {
  const pathname = usePathname()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false)

  const isCaroGame = true
  // const isCaroGame = pathname.startsWith("/games/caro") || pathname.startsWith("/games/caro/");

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChatClick = () => {
    setIsChatOpen((p) => !p)
    setIsSidebarOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path && !isChatOpen
  }

  const handleGameClick = () => {
    setIsSidebarOpen(false)
    setIsChatOpen(false)
  }

  if (!mounted) return null

  const handleCreateRoomClick = () => {
    setIsCreateRoomOpen((prev) => !prev)
  }

  return (
    <>
      {
        isChatOpen && <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      }
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
            {/* Home */}
            <NavItem
              href="/"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              isActive={isActive("/")}
              onClick={() => {
                setIsSidebarOpen(false)
                setIsChatOpen(false)
              }}
            />

            {/* Shop */}
            <NavItem
              href="/shop"
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Shop"
              isActive={isActive("/shop")}
              onClick={() => {
                setIsSidebarOpen(false)
                setIsChatOpen(false)
              }}
            />

            {/* Center placeholder for the floating button */}
            <div className="w-11 h-4"></div>

            {/* Chat - Moved from center */}
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

            {/* Profile */}
            <NavItem
              href="/me"
              icon={<User className="h-5 w-5" />}
              label="Me"
              isActive={isActive("/me")}
              onClick={() => {
                setIsSidebarOpen(false)
                setIsChatOpen(false)
              }}
            />
          </div>

          {/* Floating center button - Now Games */}
          {isCaroGame ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCreateRoomClick}
              className="absolute left-1/2 -translate-x-1/2 -top-5 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-slate-950 cursor-pointer"
            >
              <Plus className="h-7 w-7 text-white" />
            </motion.button>
          ) : (
            <Link href="/games" passHref>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleGameClick}
                className="absolute left-1/2 -translate-x-1/2 -top-3 w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-slate-950"
              >
                <Gamepad2 className="h-7 w-7 text-white" />
              </motion.button>
            </Link>
          )}
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
  const isShop = label.toLowerCase() === "shop"
  const [showTooltip, setShowTooltip] = useState(false)
  
  if (isShop) {
    const handleShopClick = () => {
      setShowTooltip(true)
      setTimeout(() => {
        setShowTooltip(false)
      }, 5000)
    }

    return (
      <div className="flex flex-col items-center justify-center relative group">
        {showTooltip && (
          <motion.div 
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-medium shadow-lg z-10"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              Coming Soon
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-red-500"></div>
            </div>
          </motion.div>
        )}
        
        <div className="relative">
          <div
            className={`flex items-center justify-center transition-colors duration-300 cursor-pointer ${
              "text-gray-500"
            }`}
            onClick={handleShopClick}
          >
            {icon}
          </div>
          <motion.div 
            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </div>
        
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${
            "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
    )
  }

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
