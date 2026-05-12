"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItemProps {
  href: string
  icon: LucideIcon
  label: string
  style?: React.CSSProperties
}

export const MenuItem: React.FC<MenuItemProps> = ({ href, icon: Icon, label, style }) => {
  const pathname = usePathname()
  const isActive = pathname === href || (href.includes("?") && pathname === href.split("?")[0])

  return (
    <Link href={href} className="group" style={style}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            "w-14 h-14 flex items-center justify-center rounded-2xl p-2 transition-all duration-300",
            "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50",
            "shadow-[2px_2px_1px_rgba(234,179,8,0.5)]",
            "group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]",
            "group-hover:border-yellow-500/30 group-hover:-translate-y-1",
            isActive ? "ring-2 ring-yellow-500/30 border-yellow-500/40 shadow-[0_0_10px_rgba(234,179,8,0.2)]" : "",
          )}
        >
          <div
            className={cn(
              "w-full h-full rounded-xl flex items-center justify-center",
              "bg-gray-800/50 backdrop-blur-sm transition-transform duration-300",
              "group-hover:bg-gray-800/80",
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-yellow-400" : "text-yellow-500/80 group-hover:text-yellow-400",
              )}
            />
          </div>
        </div>

        <span
          className={cn(
            "text-sm font-medium transition-all duration-300",
            isActive ? "text-yellow-400" : "text-gray-300 group-hover:text-yellow-400",
          )}
        >
          {label}
        </span>

        {/* Active indicator dot */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
        )}
      </div>
    </Link>
  )
}
