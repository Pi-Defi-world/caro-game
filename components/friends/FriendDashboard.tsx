"use client"

import { useEffect } from "react"
import { Trophy} from "lucide-react"
import Leaderboard from "./LeaderBoard"
import FriendSidebar from "./FriendSidebar"
import QuickPlay from "./QuickPlay"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchFriendRequests } from "@/redux/slices/friends"



export default function FriendDashboard() {
  
  const {friendRequests,challenges} = useAppSelector(state => state.friends)

  const dispatch = useAppDispatch()

  useEffect(()=>{
    dispatch(fetchFriendRequests())
  },[dispatch])


  return (
    <div className="min-h-screen bg-zincdd-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
              <div
                className="text-center py-1 md:py-3 text-2xl font-bold text-white relative"
                style={{
                  background: "linear-gradient(to bottom, #424242, #212121)",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                <Trophy className="inline-block mr-2" /> Leaderboard
              </div>
              <div className="p-2">
                <Leaderboard/>
              </div>
            </div>
            {/* <QuickPlay/> */}
          </div>

          <div className="space-y-6">
            <FriendSidebar
              friendRequests={friendRequests}
              challenges={challenges}
            />
          </div>
        </div>
      </div>

      
    </div>
  )
}
