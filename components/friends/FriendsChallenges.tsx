import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { acceptChallenge, fetchChallenges, rejectChallenge } from "@/redux/slices/friends"
import { Check, X, Play, Loader2, Clock } from "lucide-react"
import { useEffect, useState } from "react"

const FriendsChallenges = () => {
    const [trackId, setTrackId] = useState("")
    const [act, setAct] = useState<"a"|"r">("a")
    const [loading, setLoading] = useState(false)
    const { challenges } = useAppSelector((state) => state.friends)
    const { currentUser } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchChallenges())
    }, [dispatch])

    const onAccept = async (challengeId: string) => {
        setTrackId(challengeId)
        setLoading(true)
        setAct("a")

        try {
            await dispatch(acceptChallenge(challengeId)).unwrap()
        } catch (error) {
            console.error("Error accepting challenge:", error)
            setTrackId("")
        } finally {
            setLoading(false)
            setTrackId("")
        }
    }

    const onReject = async (challengeId: string) => {
        setTrackId(challengeId)
        setAct("r")
        setLoading(true)

        try {
            await dispatch(rejectChallenge(challengeId)).unwrap()
        } catch (error) {
            console.error("Error rejecting challenge:", error)
            setTrackId("")
        } finally {
            setLoading(false)
            setTrackId("")
        }
    }

    const onStartGame = (challengeId: string) => {
        console.log("Starting game for challenge:", challengeId)
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">Challenges</h2>
            {challenges.length > 0 ? (
                challenges.map((challenge) => (
                    <div
                        key={challenge._id}
                        className="flex items-center justify-between friend-offline px-2 py-1 rounded-lg mb-2"
                    >
                        <div className="flex flex-col justify-start">
                            <span className="text-white text-sm">
                                {
                                    currentUser?._id === challenge.challenger._id ? `You challenged ${challenge.opponent.username}` : `${challenge.challenger.username} challenged you`
                                }
                            </span>
                            <span className="text-yellow-500 capitalize text-sm font-luckyGuy">{challenge.betAmount} PI</span>
                        </div>
                        <div className="flex justify-center items-center gap-1">
                            {challenge.challenger._id === currentUser?._id && challenge.status ==="pending" ? (
                                <button
                                    onClick={() => onStartGame(challenge._id)}
                                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                >
                                    <Clock className="w-3 h-3 inline-block mr-1" />
                                    Waiting
                                </button>
                            ) : (
                                <>
                                    {challenge.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => onAccept(challenge._id)}
                                                disabled={loading && trackId === challenge._id}
                                                className={`p-1 rounded-full bg-green-500 hover:bg-green-600 mr-2 ${
                                                    loading && trackId === challenge._id ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                            >
                                                {loading && trackId === challenge._id && act === "a" ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                ) : (
                                                    <Check className="w-4 h-4 text-white" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => onReject(challenge._id)}
                                                disabled={loading && trackId === challenge._id}
                                                className={`p-1 rounded-full bg-red-500 hover:bg-red-600 ${
                                                    loading && trackId === challenge._id ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                            >
                                                {loading && trackId === challenge._id && act === "r" ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                ) : (
                                                    <X className="w-4 h-4 text-white" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                    {challenge.status === "accepted" && (
                                        <button
                                            onClick={() => onStartGame(challenge._id)}
                                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                                        >
                                            <Play className="w-3 h-3 inline-block mr-1" />
                                            Start Game
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400">No pending challenges</p>
            )}
        </div>
    )
}

export default FriendsChallenges
