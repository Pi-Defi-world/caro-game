"use client"

import { useAppSelector } from "@/redux/hooks"
import { GameRow } from "../game-categories/game-row"
import { useMemo } from "react"

interface Game {
  _id: string
  username: string
  createdAt: Date | string
  wager: number
  payout: number
  isPositive: boolean
  game: string
}

export default function LiveGameHistory() {
  const { gameHistories } = useAppSelector((state) => state.gameHistories)

  // Use useMemo to create a unique, sorted list of game histories
  const uniqueSortedGames = useMemo(() => {
    // Create a Map to track unique games by ID
    const uniqueGamesMap = new Map<string, Game>()

    // Process games in reverse order (newest first)
    // This ensures that if there are duplicates, we keep the newest one
    const reversedGames = [...gameHistories]

    // Add each game to the Map (which ensures uniqueness by ID)
    reversedGames.forEach((game) => {
      if (!uniqueGamesMap.has(game._id)) {
        uniqueGamesMap.set(game._id, game)
      }
    })

    // Convert Map values to array and take the first 100
    return Array.from(uniqueGamesMap.values()).slice(0, 10)
  }, [gameHistories])

  return (
    <div className="w-full rounded-xl border border-purple-500/20 bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,41,170,0.1),transparent_60%)]"></div>

        <div className="relative z-10 w-full overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="pb-4 text-left text-sm font-medium text-gray-400 hidden md:table-cell">GAME</th>
                <th className="pb-4 text-left text-sm font-medium text-gray-400">PLAYER</th>
                <th className="pb-4 text-left text-sm font-medium text-gray-400 md:table-cell">TIME</th>
                <th className="pb-4 text-left text-sm font-medium text-gray-400 hidden md:table-cell">WAGER</th>
                <th className="pb-4 text-right text-sm font-medium text-gray-400">PAYOUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {uniqueSortedGames.map((game) => (
                <GameRow key={game._id} game={game} />
              ))}
            </tbody>
          </table>

          {uniqueSortedGames.length === 0 && <div className="text-center py-8 text-gray-400">No games played yet</div>}
        </div>
      </div>
    </div>
  )
}
