"use client"

import { useState, useEffect } from "react"
import { CheckCheck, History,User, Cat, MailCheck, Wallet, User2, Group } from "lucide-react"
import { MenuItem } from "./MenuItem"
import { cn } from "@/lib/utils"
import { Person } from "@phosphor-icons/react"


const menuItems = [
  // {
  //   href: "/checkin",
  //   icon: CheckCheck,
  //   label: "Checkin",
  //   gradient: "from-green-900/30 to-green-800/20",
  //   borderColor: "border-green-700/30",
  //   iconColor: "text-green-400",
  //   hoverGlow: "group-hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]",
  // },
  // {
  //   href: "/me/history",
  //   icon: History,
  //   label: "History",
  //   gradient: "from-blue-900/30 to-blue-800/20",
  //   borderColor: "border-blue-700/30",
  //   iconColor: "text-blue-400",
  //   hoverGlow: "group-hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]",
  // },
  {
    href: "/me/wallet",
    icon: Wallet,
    label: "Wallet",
    gradient: "from-yellow-900/30 to-yellow-800/20",
    borderColor: "border-yellow-700/30",
    iconColor: "text-yellow-400",
    hoverGlow: "group-hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]",
  },
  // {
  //   href: "/me/pets?activeTab=Character",
  //   icon: User,
  //   label: "Characters",
  //   gradient: "from-purple-900/30 to-purple-800/20",
  //   borderColor: "border-purple-700/30",
  //   iconColor: "text-purple-400",
  //   hoverGlow: "group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
  // },
  // {
  //   href: "/me/pets?activeTab=Pets",
  //   icon: Cat,
  //   label: "Pets",
  //   gradient: "from-pink-900/30 to-pink-800/20",
  //   borderColor: "border-pink-700/30",
  //   iconColor: "text-pink-400",
  //   hoverGlow: "group-hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  // },
  {
    href: "/invite",
    icon: MailCheck,
    label: "Invite",
    gradient: "from-orange-900/30 to-orange-800/20",
    borderColor: "border-orange-700/30",
    iconColor: "text-orange-400",
    hoverGlow: "group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]",
  },
  {
    href: "/friends",
    icon: Group,
    label: "Friends",
    gradient: "from-orange-900/30 to-orange-800/20",
    borderColor: "border-orange-700/30",
    iconColor: "text-orange-400",
    hoverGlow: "group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]",
  }
]

export default function Menu() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <nav
      className={cn(
        "rounded-xl bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-4 border border-gray-700/50 shadow-lg transition-all duration-500",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            {...item}
          />
        ))}
      </div>
    </nav>
  )
}
