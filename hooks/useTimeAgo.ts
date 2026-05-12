"use client"

import { useState, useEffect } from "react"

export function useTimeCounter(createdAt: Date | string | undefined) {
  const [timeDisplay, setTimeDisplay] = useState<string>("")

  useEffect(() => {
    if (!createdAt) {
      setTimeDisplay("")
      return
    }

    const created = new Date(createdAt)

    // Update the time every second
    const intervalId = setInterval(() => {
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)

      if (diffInSeconds < 60) {
        setTimeDisplay(`${diffInSeconds}s ago`)
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        setTimeDisplay(`${minutes}m ago`)
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        setTimeDisplay(`${hours}h ago`)
      } else {
        const days = Math.floor(diffInSeconds / 86400)
        setTimeDisplay(`${days}d ago`)
      }
    }, 1000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [createdAt])

  return timeDisplay
}

