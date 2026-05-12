"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchFriends, IFriend } from "@/redux/slices/friends"
import { User, UserPlus, Gamepad2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ChallengeModal } from "./ChallengModal"
import FriendItem from "./FriendItem"

export function FriendList() {

    const [myfriends, setMyFriends] = useState<any[]>([])
    const dispatch = useAppDispatch()
    const {friends} = useAppSelector(state => state.friends)
    const {onlinePlayers} = useAppSelector(state => state.rooms)

    useEffect(() => {
        dispatch(fetchFriends())
    }, [dispatch])

    useEffect(() => {
        if (friends && onlinePlayers) {
            const uniqueFriends = friends.reduce((acc: IFriend[], current: IFriend) => {
                const isDuplicate = acc.some(friend => friend._id === current._id)
                if (!isDuplicate) {
                    acc.push(current)
                }
                return acc
            }, [])

            const updatedFriends = uniqueFriends.map(player => {
                const isOnline = onlinePlayers.some(
                    onlinePlayer => onlinePlayer.username === player.username
                )
                return {
                    ...player,
                    status: isOnline ? "online" : "offline"
                }
            })
            setMyFriends(updatedFriends)
        }
    }, [friends, onlinePlayers])

  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <User className="mr-2" /> Friends
      </h2>
      <div className="space-y-2">
        {myfriends.length === 0 ? (
          <p className="text-gray-400 text-center py-2">No friends yet</p>
        ) : (
          myfriends.map((friend,index) => (
            <FriendItem key={index} friend={friend} />
          ))
        )}
      </div>
    </div>
  )
}


