import { Trophy } from 'lucide-react'

export default function Achievements() {
  return (
    <div className="rounded-lg bg-gray-800 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Best Achievements</h3>
        <span className="text-blue-400">9</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-purple-900 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <div className="text-white font-medium">Master's Glory</div>
            <div className="text-sm text-gray-400">500 XP</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-red-900 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <div className="text-white font-medium">Pathfinder's Pride</div>
            <div className="text-sm text-gray-400">1,900 XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}

