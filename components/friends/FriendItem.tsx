"use client"

import { fetchFriendRequests, IFriend, sendFriendRequest } from "@/redux/slices/friends"
import Image from "next/image"
import { useState } from "react"
import { ChallengeModal } from "./ChallengModal"
import { Clock, Gamepad2, Loader2, UserCheck, UserPlus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

const FriendItem =({ friend }: { friend: IFriend }) =>{
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const statusColor = {
      online: "bg-green-500",
      offline: "bg-gray-500",
      "in-game": "bg-yellow-500",
    }[friend.status]
    const [loading,setLoading] = useState(false)
    const [trackId,setTrackId] = useState("")

    const {friends,friendRequests} = useAppSelector(state => state.friends)
    const {currentUser} = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
  
    const handleOpenModal = (id: string) => {
      setUserId(id) 
      setIsChallengeModalOpen(true) 
    }

    const handleRequestFriendship = async(friendId:string)=>{
      try {
          setTrackId(friendId)
          setLoading(true);
          await dispatch(sendFriendRequest(friendId));
          await dispatch(fetchFriendRequests());

      } catch (error) {
          setTrackId("")
          console.error("Failed to send friend request:", error);
      } finally {
          setTrackId("")
          setLoading(false);
      }
    }

    const isFriend = friends.some(f => f._id === friend._id)
    const isMe = friend.username.toLowerCase() === currentUser?.username?.toLowerCase()
    const hasPendingRequest = friendRequests.some(
      req => req.recipient === friend._id && req.status === "pending"
    )

    return (
      <div className={`flex items-center h-[40px] md:h-[60px] justify-between bg-zinc-700 p-1 md:p-2 rounded-lg ${friend.status === "online" ? "friend-online" : "friend-offline"}`}>
        <div className="flex items-center">
          <div className="relative">
            <Image
              src={"/pet.png"}
              alt={`${friend.username}` || "friend image"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-zinc-800`} />
          </div>
          <span className="ml-2 text-white font-semibold">{isMe ? "You" : friend.username}</span>
        </div>

        {!isMe && !hasPendingRequest && (
          isFriend ? (
            <button onClick={() => handleOpenModal(friend._id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-full text-sm flex items-center">
              <Gamepad2 className="mr-1 w-4 h-4" /> Challenge
            </button>
          ) : loading && trackId === friend._id ? (
            <div className="p-1 rounded-full bg-blue-500">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          ) : (
            <button 
              onClick={() => handleRequestFriendship(friend._id)}
              className="p-1 rounded-full bg-blue-500 hover:bg-blue-600"
            >
              <UserPlus className="w-4 h-4 text-white" />
            </button>
          )
        )}

        {isChallengeModalOpen && userId && (
          <ChallengeModal
            isOpen={isChallengeModalOpen}
            onClose={() => setIsChallengeModalOpen(false)}
            game="1v1 Duel"
            userId={userId} 
          />
        )}
      </div>
    )
  }

  export default FriendItem