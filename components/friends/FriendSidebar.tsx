import { Check, X } from "lucide-react";
import Image from "next/image";
import { FriendList } from "./FriendList";
import { IChallenge, IFriendRequest } from "@/redux/slices/friends";
import FriendRequestItem from "./FriendRequestItem";
import { useAppDispatch } from "@/redux/hooks";
import FriendsChallenges from "./FriendsChallenges";

interface FriendSidebarProps {
    friendRequests: Array<IFriendRequest>
    challenges: Array<IChallenge>
  }
  

const  FriendSidebar =({ friendRequests }: FriendSidebarProps)=> {
    // Remove duplicate friend requests based on _id
    const uniqueFriendRequests = friendRequests.reduce((acc: IFriendRequest[], current: IFriendRequest) => {
        const isDuplicate = acc.some(request => request._id === current._id)
        if (!isDuplicate) {
            acc.push(current)
        }
        return acc
    }, [])

    return (
      <div className="bg-zinc-800 p-2 rounded-lg shadow-lg space-y-6">
          <FriendList />
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Friend Requests</h2>
          {uniqueFriendRequests.length > 0 ? (
            uniqueFriendRequests.map((request) => (
              <FriendRequestItem
                key={request?._id}
                username={request?.sender?.username}
                id={request._id}
              />
            ))
          ) : (
            <p className="text-gray-400">No friend requests</p>
          )}
        </div>
  
        <FriendsChallenges/>
  
      </div>
    )
  }

  

  export  default FriendSidebar