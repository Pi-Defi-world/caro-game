"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getUserInfo, authenticateUser, fetchPriviledges, updateUserBalance } from "@/redux/slices/auth"
import { fetchGameHistories } from "@/redux/slices/gameHistory"
import { fetchNotifications } from "@/redux/slices/notifcations"
import { fetchChats } from "@/redux/slices/message"
import { joinRoom, setCurrentRoom } from "@/redux/slices/room"
import { Loader2 } from "lucide-react"
import { SocketProvider } from "@/context/SocketContext"
import { useSocket } from "@/hooks/useSocket"
import Image from "next/image"
import TeamInvite from "../poke-opponent"
import { logger } from "@/lib/logger"
import FriendInvite from "../friend-invite"
import Network from "../Network"

const loadingMessages = [
  "Initializing app data...",
  "Fetching game history...",
  "Retrieving user information...",
  "Loading notifications...",
  "Preparing your game experience...",
]

export function AppWrapper({ children }: { children: React.ReactNode }) {

  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [show, setShow] = useState(false)
  const [showFriendInvite, setShowFriendInvite] = useState(false)
  const [isJoiningRoom, setIsJoiningRoom] = useState(false)
  const { lastJsonMessage, sendJsonMessage } = useSocket()
  const [isOpen,setIsOpen] = useState(true)


  const loadPiSdk = (): Promise<typeof window.Pi> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      script.onload = () => resolve(window.Pi);
      script.onerror = () => reject(new Error('Failed to load Pi SDK'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => { 
    try {
      const seen = localStorage.getItem("pi-network-ack");
      if (seen === "1") {
        setIsOpen(false)
      }
    } catch {}
    loadPiSdk()
      .then(async (Pi) => {
        if (Pi && typeof Pi.init === 'function') {
          Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });
          logger("Pi SDK initialized");
          const nativeFeaturesList = await Pi.nativeFeaturesList();
          const adNetworkSupported = nativeFeaturesList.includes("ad_network");
          logger("-------->1 ",nativeFeaturesList)
          logger("-------->2 ",adNetworkSupported)
          
          return Pi.nativeFeaturesList();
        }
        throw new Error('Pi SDK not properly initialized');
      })
      .then(features => {
        logger("-------->3 ",features)
      })
      .catch(err => console.log(err));
  }, []);

  // --- Effects: App Data Initialization ---
  const initializeAppData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchGameHistories()).unwrap(),
        dispatch(getUserInfo()).unwrap(),
        dispatch(fetchNotifications()).unwrap(),
        dispatch(fetchChats()).unwrap(),
        dispatch(fetchPriviledges()).unwrap()
      ])
    } catch (error) {
      console.log("Failed to initialize app data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    initializeAppData()
  }, [initializeAppData])

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isLoading) {
      intervalId = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      }, 500);
    } else {
      setCurrentMessageIndex(0);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

  useEffect(() => {
    // @ts-ignore
    if (lastJsonMessage && lastJsonMessage.type === "poke") {
      setShow(true)
    }
    // @ts-ignore
    if (lastJsonMessage && lastJsonMessage.type === "invite-friend") {
      setShowFriendInvite(true)
    }
  }, [lastJsonMessage])

  const handleUserAuth = async () => {
    try {
      setIsLoading(true)
      const res = await dispatch(authenticateUser()).unwrap()
      localStorage.setItem("token", res.token)
    } catch (error) {
      console.error("Authentication failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFriendInviteAccept = async () => {
    if (!currentUser || isJoiningRoom) return
    
    setIsJoiningRoom(true)
    setShowFriendInvite(false)
    
    try {
      // @ts-ignore
      const roomId = lastJsonMessage?.payload?.roomId
      // @ts-ignore
      const betAmount = lastJsonMessage?.payload?.betAmount || 0
      
      if (roomId) {
        const res = await dispatch(joinRoom(roomId)).unwrap()
        
        dispatch(updateUserBalance(-betAmount))
        
        dispatch(setCurrentRoom(res))
        
        window.location.href = `/games/caro/${roomId}`
      }
    } catch (error) {
      console.error("Failed to join room:", error)
      alert("Failed to join room. Please try again.")
    } finally {
      setIsJoiningRoom(false)
    }
  }
  
  const handleFriendInviteDecline = () => {
    sendJsonMessage({
      type: "friend-invite-decline", 
      payload: {
        // @ts-ignore
        roomId: lastJsonMessage?.payload?.roomId,
        // @ts-ignore
        userId: lastJsonMessage?.payload?.userId,
        // @ts-ignore
        inviterId: lastJsonMessage?.payload?.inviterId || lastJsonMessage?.payload?.userId
      }
    })
    
    setShowFriendInvite(false)
  }
  
  const handleFriendInviteExpire = () => {
    setShowFriendInvite(false)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50">
        <div className="flex items-center justify-center flex-col gap-4">
          {/* Roobet-like spinner */}
          <div className="relative w-20 h-20">
            {/* Outer segmented ring - using conic gradient for segments */}
            <div 
              className="absolute inset-0 rounded-full animate-spin"
              style={{ 
                background: 'conic-gradient(#ffcc00 0% 10%, transparent 10% 20%, #ffcc00 20% 30%, transparent 30% 40%, #ffcc00 40% 50%, transparent 50% 60%, #ffcc00 60% 70%, transparent 70% 80%, #ffcc00 80% 90%, transparent 90% 100%)',
                WebkitMask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
                mask: 'radial-gradient(circle at center, transparent 60%, black 60%)',
              }}
            ></div>
            {/* Logo in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/logo.png" alt="App Logo" width={60} height={60} />
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-muted-foreground animate-pulse">{loadingMessages[currentMessageIndex]}</span>
          </div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="relative flex flex-col w-full min-h-screen justify-center items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/mob.png" 
            alt="background"
            fill
            className="object-cover blur-sm"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center backdrop-blur-md w-screen h-screen">
          <div className="flex flex-col items-center justify-center h-full">
            <Image src="/logo.png" width={180} height={100} alt="logo" className="drop-shadow-lg mb-6" />
            <button
              onClick={handleUserAuth}
              disabled={isLoading}
              className="flex friend-offline items-center justify-center px-6 py-2 text-lg font-semibold text-white rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Authenticate"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SocketProvider>
      {children}
      <Network 
        network="testnet" 
        isOpen={isOpen} 
        onClose={()=>setIsOpen(false)}
        onAcknowledge={() => {
          try { localStorage.setItem("pi-network-ack", "1"); } catch {}
          setIsOpen(false)
        }}
        blurBehind={true}
      />

      {showFriendInvite && (
        <FriendInvite
          // @ts-ignore
          inviterName={lastJsonMessage?.payload?.hostUsername || "Friend"}
          // @ts-ignore
          roomId={lastJsonMessage?.payload?.roomId}
          // @ts-ignore
          userId={lastJsonMessage?.payload?.userId}
          inviterAvatarUrl="https://i.pravatar.cc/120?img=12"
          // @ts-ignore
          roomName={lastJsonMessage?.payload?.roomName || "Game Room"}
          // @ts-ignore
          betAmount={lastJsonMessage?.payload?.betAmount || 0}
          expiresInSec={15}
          accentHex="#F59E0B"
          onAccept={handleFriendInviteAccept}
          onDecline={handleFriendInviteDecline}
          onExpire={handleFriendInviteExpire}
          isJoining={isJoiningRoom}
          blurBehind
        />
      )}
    </SocketProvider>
  )
}
