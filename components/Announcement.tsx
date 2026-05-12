"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Info, Trophy, Clock, Users, Zap } from "lucide-react"

interface AnnouncementProps {
  type: "info" | "status" | "winner" | "turn" | "waiting"
  message: string
  subtitle?: string
  className?: string
}

const Announcement = ({ type, message, subtitle, className }: AnnouncementProps) => {
  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "status":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "winner":
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case "turn":
        return <Zap className="w-5 h-5 text-green-500" />
      case "waiting":
        return <Users className="w-5 h-5 text-purple-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200"
      case "status":
        return "bg-yellow-50 border-yellow-200"
      case "winner":
        return "bg-yellow-50 border-yellow-200"
      case "turn":
        return "bg-green-50 border-green-200"
      case "waiting":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getTextColor = () => {
    switch (type) {
      case "info":
        return "text-blue-700"
      case "status":
        return "text-yellow-700"
      case "winner":
        return "text-yellow-700"
      case "turn":
        return "text-green-700"
      case "waiting":
        return "text-purple-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex items-center justify-center p-4 rounded-lg border-2 shadow-sm max-w-md w-full",
        getBgColor(),
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="text-center">
          <h3 className={cn("font-semibold text-sm", getTextColor())}>
            {message}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Announcement
