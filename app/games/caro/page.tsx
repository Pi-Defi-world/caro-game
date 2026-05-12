"use client";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMyGames, getRooms } from "@/redux/slices/room";
import RoomList from "@/components/RoomList";
import FriendItem from "@/components/friends/FriendItem";
import { Button } from "@/components/ui/button";
import { Eye, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "room", label: "Room" },
  { id: "online", label: "Online" },
  // { id: "my-games", label: "My Games" },
];


const CaroLobby = () => {
  const [activeTab, setActiveTab] = useState("room");
  const [onlineUsersPage, setOnlineUsersPage] = useState(1);
  const dispatch = useAppDispatch();
  const { currentUser, isLoading } = useAppSelector((state) => state.auth);
  const { onlinePlayers } = useAppSelector((state) => state.rooms);
  
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(getRooms()).unwrap();
    dispatch(getMyGames()).unwrap();
  }, [dispatch]);

  const uniquePlayers = onlinePlayers.filter(
    (player, idx, arr) => idx === arr.findIndex((p) => p._id === player._id)
  );

  // Online users pagination
  const totalOnlineUsers = uniquePlayers.length;
  const totalOnlinePages = Math.ceil(totalOnlineUsers / itemsPerPage);
  const onlineStartIndex = (onlineUsersPage - 1) * itemsPerPage;
  const onlineEndIndex = onlineStartIndex + itemsPerPage;
  const paginatedOnlineUsers = uniquePlayers.slice(onlineStartIndex, onlineEndIndex);

  // Reset online users page when switching tabs or players change
  useMemo(() => {
    setOnlineUsersPage(1);
  }, [activeTab, uniquePlayers.length]);

  const handleOnlinePageChange = (page: number) => {
    if (page >= 1 && page <= totalOnlinePages) {
      setOnlineUsersPage(page);
    }
  };

  const getOnlineVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, onlineUsersPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalOnlinePages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative mb-3">
      <div className="flex my-3 rounded-full bg-gray-800/50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-1 rounded-full text-white transition-all relative flex-1 text-sm",
              activeTab === tab.id
                ? "bg-purple-600 shadow-purple-sm"
                : "bg-transparent hover:bg-gray-700/50"
            )}
          >
            <div className="flex items-center gap-2 relative justify-center">
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {activeTab === "online" && (
        <div className="w-full space-y-4">
          {/* Online Users List */}
          <div className="space-y-1">
            {paginatedOnlineUsers.length > 0 ? (
              paginatedOnlineUsers.map((player) => (
                <FriendItem key={player._id} friend={player} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No players online</div>
            )}
          </div>

          {/* Online Users Pagination */}
          {totalOnlinePages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              {/* Previous Button */}
              <button
                onClick={() => handleOnlinePageChange(onlineUsersPage - 1)}
                disabled={onlineUsersPage === 1}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${onlineUsersPage === 1 
                    ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-purple-500/20 text-white hover:from-gray-700/80 hover:to-gray-800/80 hover:border-purple-400/30 hover:scale-105'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getOnlineVisiblePages().map((page) => (
                <button
                  key={page}
                  onClick={() => handleOnlinePageChange(page)}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${page === onlineUsersPage
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
                onClick={() => handleOnlinePageChange(onlineUsersPage + 1)}
                disabled={onlineUsersPage === totalOnlinePages}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${onlineUsersPage === totalOnlinePages 
                    ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-b from-gray-800/80 to-gray-900/80 border border-purple-500/20 text-white hover:from-gray-700/80 hover:to-gray-800/80 hover:border-purple-400/30 hover:scale-105'
                  }
                `}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Page Info */}
              <div className="ml-4 text-sm text-gray-400">
                <span className="text-yellow-400 font-medium">{onlineStartIndex + 1}-{Math.min(onlineEndIndex, totalOnlineUsers)}</span>
                <span className="mx-1">of</span>
                <span className="text-purple-400 font-medium">{totalOnlineUsers}</span>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === "room" && <RoomList />}
      {activeTab === "my-games" && <RoomList  type="my-games"/>}
    </div>
  );
};

export default CaroLobby;
