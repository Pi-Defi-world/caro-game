"use client"

import { useMemo, useState } from "react"
import { useAppSelector } from "@/redux/hooks"
import { CaroRoomCard } from "./games/caro/cards/CaroRoomCard"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  type?: "my-games" | "all"
}

export default function RoomList({ type }: Props) {
  const { rooms, myGames } = useAppSelector((state) => state.rooms)
  const { currentUser } = useAppSelector((state) => state.auth)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const uniqueFilteredRooms = useMemo(() => {
    if (type === "my-games") {
      const uniqueMap = new Map()
      myGames.forEach((room) => {
        if (!uniqueMap.has(room._id)) uniqueMap.set(room._id, room)
      })
      return myGames
    }
    const uniqueRoomsMap = new Map()
    rooms.forEach((room) => {
      if (
        room.betAmount <= (currentUser?.balance ?? 0) &&
        room.status === "open" &&
        !uniqueRoomsMap.has(room._id)
      ) {
        uniqueRoomsMap.set(room._id, room)
      }
    })
    return Array.from(uniqueRoomsMap.values())
  }, [rooms, myGames, currentUser?.balance, type])

  // Pagination calculations
  const totalItems = uniqueFilteredRooms.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRooms = uniqueFilteredRooms.slice(startIndex, endIndex)

  // Reset to page 1 when rooms change
  useMemo(() => {
    setCurrentPage(1)
  }, [uniqueFilteredRooms.length])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getVisiblePages = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  return (
    <div className="w-full space-y-4">
      {/* Rooms Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 md:gap-3">
        {paginatedRooms.length > 0 ? (
          paginatedRooms.map((room) => <CaroRoomCard key={room._id} room={room} />)
        ) : (
          <p className="text-white col-span-full text-center py-8">No room available yet</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
              ${currentPage === 1 
                ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-purple-500/20 text-white hover:from-gray-700/80 hover:to-gray-800/80 hover:border-purple-400/30 hover:scale-105'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`
                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                ${page === currentPage
                  ? 'bg-gradient-to-b from-purple-600 to-purple-700 border border-purple-400/50 text-white scale-110 shadow-lg shadow-purple-500/25'
                  : 'bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-purple-500/20 text-white hover:from-gray-700/80 hover:to-gray-800/80 hover:border-purple-400/30 hover:scale-105'
                }
              `}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
              ${currentPage === totalPages 
                ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-purple-500/20 text-white hover:from-gray-700/80 hover:to-gray-800/80 hover:border-purple-400/30 hover:scale-105'
              }
            `}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Page Info */}
          <div className="ml-4 text-sm text-gray-400">
            <span className="text-yellow-400 font-medium">{startIndex + 1}-{Math.min(endIndex, totalItems)}</span>
            <span className="mx-1">of</span>
            <span className="text-purple-400 font-medium">{totalItems}</span>
          </div>
        </div>
      )}
    </div>
  )
}
