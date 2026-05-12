"use client"
import { useState } from "react"
import { X, Swords, Coins, Plus, Minus, Loader2, Loader } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { challengeFriend } from "@/redux/slices/friends"
import { updateUserBalance } from "@/redux/slices/auth"

interface ChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  userId:string
  game: string
}

const amountOptions = [0.5, 1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100]
const incrementOptions = [0.5, 1, 5, 10]

export function ChallengeModal({ isOpen, onClose,userId, game }: ChallengeModalProps) {
  const  [loading,setLoadng]= useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number>(1)
  const [incrementAmount, setIncrementAmount] = useState<number>(1)
  const {currentUser}  = useAppSelector(state =>  state.auth)
  const [error,setError] = useState<string | null>(null)

  const dispatch = useAppDispatch()

  if (!isOpen) return null

  const handleCreateChallenge = async() => {

    if(currentUser && currentUser?.balance < selectedAmount){
      setError("insuficient balnce")
      return
    }

    setLoadng(true)
    try {
      await dispatch(challengeFriend({
        betAmount:selectedAmount,
        userId:userId
      })).then(()=>dispatch(updateUserBalance(-selectedAmount)))
      onClose()
    } catch (error) {
      setLoadng(false)
    } finally {
      setLoadng(false)
    }
  }

  const handleIncrement = () => {
    setSelectedAmount((prev) => Math.round((prev + incrementAmount) * 100) / 100)
  }

  const handleDecrement = () => {
    setSelectedAmount((prev) => Math.max(0, Math.round((prev - incrementAmount) * 100) / 100))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-800 rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Feature in Development</h2>
          <p className="text-gray-300 mb-6">This feature is currently under development. Please check back tomorrow!</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  {/* Original challenge modal UI commented out
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-800 rounded-lg shadow-2xl max-w-md w-full">
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Challenge Friends</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors duration-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-zinc-800 p-1 rounded-lg">
              <p className="text-white text-lg mb-2 flex items-center">
                Game: <span className="font-bold ml-2 text-green-400">{game}</span>
              </p>
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg">
              <label className="block text-white text-lg mb-2 fle items-center">
                Challenge Amount (PI)
              </label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-1   rounded-lg text-white font-bold text-sm transition-all duration-200 ${
                      selectedAmount === amount ? "bg-blue-600 shadow-lg scale-105" : "friend-offline"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <div className="mt-4 friend-offline flex items-center justify-between bg-zinc-700 rounded-lg p-2">
                <button
                  onClick={handleDecrement}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-yellow-500 font-bold text-lg">{selectedAmount} PI</span>
                <button
                  onClick={handleIncrement}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2">
                <label className="block text-white text-sm mb-1">Increment by:</label>
                <div className="flex justify-between">
                  {incrementOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setIncrementAmount(amount)}
                      className={`py-1 px-3  rounded-lg text-white font-bold text-xs transition-all duration-200 ${
                        incrementAmount === amount
                          ? "bg-green-400 text-black shadow-lg scale-105"
                          : "friend-offline hover:bg-zinc-600"
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-1 friend-red  text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChallenge}
              className="px-4 py-1 friend-blue bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {
                loading ? <Loader className="w-3 h-3 animate-spin"/> : "Challenge"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  */}
}
