"use client"

import Image from "next/image"
import { Clock, Eye, Loader2, Trophy, UserCheck, UserPlus, UserX } from "lucide-react"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchFriendRequests, fethcLeaderBoardUsers, ILeaderBoard, sendFriendRequest } from "@/redux/slices/friends"
import { useSocket } from "@/hooks/useSocket"


const Leaderboard = () => {
    const {lastJsonMessage} = useSocket()
    const dispatch = useAppDispatch()
    const {leaderBoards,friends} = useAppSelector(state => state.friends)
    const {onlinePlayers} = useAppSelector(state => state.rooms)
    const {currentUser} = useAppSelector(state => state.auth)
    const [topLeaders, setTopLeaders] = useState<ILeaderBoard[]>([])
    const [loading,setLoading] = useState(false)
    const [leaderboardLoading, setLeaderboardLoading] = useState(true)
    const [trackId,setTrackId] = useState("")


    useEffect(() => {
        const fetchData = async () => {
          if(leaderBoards.length > 0) return
            setLeaderboardLoading(true)
            try {
                await dispatch(fethcLeaderBoardUsers())
                await dispatch(fetchFriendRequests())
            } finally {
                setLeaderboardLoading(false)
            }
        }
        fetchData()
    }, [dispatch])

    useEffect(() => {
        //@ts-ignore
        if (lastJsonMessage && lastJsonMessage.type === "rank-push") {
            //@ts-ignore
            const {userId} = lastJsonMessage.payload
            const rank = leaderBoards.find(leader => leader._id === userId)?.rank
            if(rank) {
            setTopLeaders(prevLeaders => 
                prevLeaders.map(leader => 
                    leader._id === userId 
                        ? {...leader, rank:rank}
                            : leader
                    )
                )
            }
        }
    }, [lastJsonMessage])

    useEffect(() => {
        if (leaderBoards && onlinePlayers) {
            const updatedLeaders = leaderBoards.map(player => {
                const isOnline = onlinePlayers.some(
                    onlinePlayer => onlinePlayer.username === player.username
                )
                return {
                    ...player,
                    status: isOnline ? "online" : "offline"
                }
            })
            setTopLeaders(updatedLeaders)
        }
    }, [leaderBoards, onlinePlayers,friends])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "#4CAF50"
      case "In Battle":
        return "#E91E63"
      default:
        return "#9E9E9E"
    }
  }

  const getBgColor = (status: string) => (status === "online" ? "#FF9800" : "#2196F3")

  const gettatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-500";
      case "in-game":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  }

  const handleRequestFriendship = async(friendId:string)=>{
    try {
        setTrackId(friendId)
        setLoading(true);
        await dispatch(sendFriendRequest(friendId));

        setTopLeaders(prevLeaders => 
            prevLeaders.map(leader => 
                leader._id === friendId
                    ? {...leader, friendshipStatus: "pending"}
                    : leader
            )
        );
    } catch (error) {
        setTrackId("")
        console.error("Failed to send friend request:", error);
    } finally {
        setTrackId("")
        setLoading(false);
    }
  }

  const isMe = (username: string): boolean => {
    return username.toLowerCase() === currentUser?.username?.toLowerCase();
  }


  return (
    <div>
      {leaderboardLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      ) : (
        topLeaders.sort((a,b)=>b.rank - a.rank).slice(0,10).map((player,index) => (
          <div key={player._id} className="relative h-[40px] md:h-[60px] mb-1 last:mb-0">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: `linear-gradient(to bottom, ${getBgColor(player.status)}22, ${getBgColor(player.status)}11)`,
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center h-full px-1 md:px-3">
                <div className="w-8 text-xl font-bold text-white">{index+1}</div>
                <div
                  className="w-10 h-10 rounded-md overflow-hidden mr-1 md:mr-3 relative"
                  // style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }}
                >
                  <Image
                    src="/pet.png"
                    alt={player.username}
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${gettatusColor(player.status)} rounded-full border-2 border-zinc-800`} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm md:text-lg">{isMe(player.username) ?  "You" : player.username  }</div>
                  <div style={{ color: getStatusColor(player.status) }} className="text-sm">
                    {player.status}
                  </div>
                </div>
                {player.status === "In Battle" && (
                  <button className="p-2 rounded-lg mr-2" style={{ background: "rgba(233, 30, 99, 0.2)" }}>
                    <Eye className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                  </button>
                )}
                <div className="flex items-center mr-2">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 mr-1" />
                  <span className="font-bold text-white">{player?.rank}</span>
                </div>
                {!isMe(player.username) && (
                  player.isFriend ? (
                    <UserCheck className="w-5 h-5 text-green-400" />
                  ) : player.friendshipStatus === "pending" ? (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  ) : player.friendshipStatus === "rejected" ? (
                    <UserX className="w-5 h-5 text-red-400" />
                  ) : loading && trackId === player._id ? (
                    <div className="p-1 rounded-full bg-blue-500">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleRequestFriendship(player._id)}
                      className="p-1 rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                      <UserPlus className="w-4 h-4 text-white" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Leaderboard