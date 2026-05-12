"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTimeCounter } from "@/hooks/useTimeAgo"

interface Game {
  _id: string
  username: string
  createdAt: Date | string
  wager: number
  payout: number
  isPositive: boolean
}

export function GameRow({ game }: { game: Game }) {

  const timeAgo = useTimeCounter(game.createdAt)

  return (
    <tr className="group hover:bg-purple-900/20 transition-colors">
      <td className="py-1 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">CARO</span>
        </div>
      </td>
      <td className="py-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{game.username}</span>
        </div>
      </td>
      <td className="py-1 md:table-cell">
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-4 h-4" />
          {timeAgo}
        </div>
      </td>
      <td className="py-1 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30">
            <span className="font-mono font-medium text-yellow-400">{game.wager.toFixed(2)}</span>
            <span className="text-yellow-400">π</span>
          </div>
        </div>
      </td>
      <td className="py-1 text-right">
        <div
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-md border bg-green-500/10 text-green-400 border-green-500/30",
          )}
        >
          <span className="font-mono font-medium">+{game.payout.toFixed(2)}</span>
          <span>π</span>
        </div>
      </td>
    </tr>
  )
}

