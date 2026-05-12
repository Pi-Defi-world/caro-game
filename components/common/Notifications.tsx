"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { INotification, readNotifications } from "@/redux/slices/notifcations"
import { HandWithdraw } from "@phosphor-icons/react"
import { Flag, Gamepad2, Trophy, UserCheck, UserPlus, UserX } from "lucide-react"
import { useEffect, useMemo } from "react"


const Notifications = () => {
  const { notifications } = useAppSelector((state) => state.notifications)
  const dispatch = useAppDispatch()

  // Use useMemo to create a unique, sorted list of notifications
  const uniqueSortedNotifications = useMemo(() => {
    // Create a Map to track unique notifications by ID
    const uniqueNotificationsMap = new Map<string, INotification>()

    // Add each notification to the Map (which ensures uniqueness by ID)
    notifications.forEach((notification) => {
      if (!uniqueNotificationsMap.has(notification._id)) {
        uniqueNotificationsMap.set(notification._id, notification)
      }
    })

    // Convert Map values to array, sort by creation date (newest first), and take the first 5
    return Array.from(uniqueNotificationsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [notifications])

  useEffect(() => {
    const unreadNotificationIds = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification._id)

    if (unreadNotificationIds.length > 0) {
      try {
        dispatch(readNotifications(unreadNotificationIds))
      } catch (error) {
        console.error("Error marking notifications as read:", error)
      }
    }
  }, [dispatch, notifications])

  const getTimeAgo = (date: Date | string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + "y ago"

    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + "mo ago"

    interval = seconds / 604800
    if (interval > 1) return Math.floor(interval) + "w ago"

    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + "d ago"

    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + "h ago"

    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + "m ago"

    return Math.floor(seconds) + "s ago"
  }

  return (
    <div className="flex flex-col gap-1 bg-[#0F1226]">
      {uniqueSortedNotifications.length === 0 ? (
        <div className="text-sm text-zinc-400 text-center py-4">No notifications</div>
      ) : (
        uniqueSortedNotifications.map((n) => (
          <div
            key={n._id}
            className={`flex items-center gap-2 p-1 hover:bg-zinc-700 dark:hover:bg-zinc-800 rounded-lg cursor-pointer ${
              n?.message?.toLowerCase().includes("rejected") ? " dark:bg-red-900/30" : ""
            }`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                n?.message?.toLowerCase().includes("accepted")
                  ? "bg-green-600"
                  : n?.message?.toLowerCase().includes("rejected") || n.type === "flag"
                    ? "bg-red-400"
                    : "bg-yellow-600"
              }`}
            >
              {n?.type === "flag" ? (
                <Flag className="h-4 w-4 text-white" />
              ) : n?.message?.toLowerCase().includes("accepted") ? (
                <UserCheck className="h-4 w-4 text-white" />
              ) : n?.message?.toLowerCase().includes("sent you") ? (
                <UserPlus className="h-4 w-4 text-white" />
              ) : n?.message?.toLowerCase().includes("rejected") ? (
                <UserX className="h-4 w-4 text-white" />
              ) : n?.type === "game" ? (
                <Gamepad2 className="h-4 w-4 text-white" />
              ) : 
              n?.type === "payment" ? (
                <HandWithdraw className="h-4 w-4 text-white" />
              ) : (
                <Trophy className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs md:text-sm font-medium text-white">
                {n?.type === "game"
                  ? "Game Challenge"
                  : n?.type === "user"
                  ? "Friend Request"
                  : n?.type === "flag"
                  ? "Flagged Content"
                  : n?.type ==="payment"
                  ? "Withdraw"
                  :"Achievement Unlocked!"
                  }
              </p>
              <p className="text-xs text-zinc-400">{n?.message}</p>
            </div>
            <div className="text-xs text-zinc-400">{getTimeAgo(n?.createdAt)}</div>
          </div>
        ))
      )}
    </div>
  )
}

export default Notifications
