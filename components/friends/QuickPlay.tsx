"use client"

import { useState } from "react"
import { Gamepad } from "lucide-react"
import { ChallengeModal } from "./ChallengModal"

export default function QuickPlay() {
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)

  const handleAcceptChallenge = (id: number) => {
    // setChallenges(challenges.filter((challenge) => challenge.id !== id))
  }

  return (
    <div className="mt-6 bg-zinc-800 rounded-lg shadow-lg p-2">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Gamepad className="mr-2" /> Quick Play
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {["1v1 Duel", "Team Battle", "Capture the Flag"].map((mode) => (
          <button
            key={mode}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            onClick={() => setIsChallengeModalOpen(true)}
          >
            {mode}
          </button>
        ))}
      </div>
     
    </div>
  )
}