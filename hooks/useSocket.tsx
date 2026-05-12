"use client"
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameEvent } from "@/enum";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setInstantMessage } from "@/redux/slices/ads";
import { flagUser, updateUserBalance } from "@/redux/slices/auth";
import { addChallenge, addFriendRequest, updateChallenge, updateFriendRequest } from "@/redux/slices/friends";
import { addNewHistory } from "@/redux/slices/gameHistory";
import { addGame } from "@/redux/slices/games";
// import { addGame } from "@/redux/slices/game";
import {
  addNotification,
} from "@/redux/slices/notifcations";
import { addRecord, addRecordAndUpdateBalance } from "@/redux/slices/record";
import {
  addRoom,
  removeRoom,
  setCurrentRoom,
  setOnlinePlayers,
  setRoomCount,
  setRooms,
} from "@/redux/slices/room";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

export const useSocket = () => {
  const WS_URL = `${process.env.NEXT_PUBLIC_SOCKET_URL}`;
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.notifications);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Only establish connection if currentUser exists
  const shouldConnect = !!currentUser;

  // Reset connection state when user logs out
  useEffect(() => {
    if (!currentUser) {
      setIsConnected(false);
      setReconnectAttempts(0);
    }
  }, [currentUser]);

  // Calculate reconnect interval with exponential backoff
  const getReconnectInterval = () => {
    const baseInterval = 1000; // Start with 1 second
    const maxInterval = 30000; // Max 30 seconds
    const interval = Math.min(baseInterval * Math.pow(2, reconnectAttempts), maxInterval);
    return interval;
  };

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    shouldConnect ? WS_URL : null,
    {
      queryParams: { userId: currentUser?._id ?? "" },
      onOpen: () => {
        setIsConnected(true);
        setReconnectAttempts(0); // Reset attempts on successful connection
      },
      onClose: () => {
        setIsConnected(false);
        setReconnectAttempts(prev => prev + 1); // Increment attempts on close
      },
      share: true,
      shouldReconnect: (closeEvent) => {
        // Only reconnect if we have a current user, not connected, and haven't exceeded max attempts
        const maxAttempts = 10;
        return shouldConnect && !isConnected && reconnectAttempts < maxAttempts;
      },
      reconnectInterval: getReconnectInterval,
      retryOnError: true,
      onMessage: (message) => {
        const data = JSON.parse(message.data);
        const { type, payload } = data;
        switch (type) {
          case "friend-request-accepted":
            console.log("friend-request-accepted",data)
            dispatch(addNotification(payload.notifcation))
            dispatch(updateFriendRequest({requestId:payload.requestId,friend:payload.receiver,receiverId:payload.receiver._id}))
            break;
          case "friend-request":
            dispatch(addFriendRequest(payload.request))
            dispatch(addNotification(payload.notifcation))
            // alert("friend-request received")
            break;
          case "friend-request-rejected":
            dispatch(addNotification(payload.notifcation))
            break;
          case "challenge-accepted":
            dispatch(addNotification(payload.notification))
            dispatch(updateChallenge({challengeId:payload.challengeId,status:"accepted"}))
            // console.log
            // alert("challenge- accepted")
            break;
          case "challenge-rejected":
            dispatch(addNotification(payload.notifcation))
            dispatch(updateChallenge({challengeId:payload.challengeId,status:"rejected"}))
            // alert("challenge- rejected")
            break;
          case "challenge-created":
            // alert("someone want to challenge you")
            dispatch(addChallenge(payload.challenge))
            dispatch(addNotification(payload.notifcation))
            break;
          case "notification": {
            // Check if notification already exists to prevent duplicates
            const isAlreadyReceived = notifications.some(
              (n) => n._id === payload._id
            )

            if (!isAlreadyReceived) {
              if (payload.type === "flag") {
                dispatch(flagUser())
              }
              dispatch(addNotification(payload))
            }
            break
          }
          case GameEvent.ROOMS:
            dispatch(setRooms(payload));
            break;
          case GameEvent.PLAYER_JOINED:
          case GameEvent.ALREADY_IN_ROOM:
            dispatch(setCurrentRoom(data.payload));
            break;
          case GameEvent.ONLINE_USERS:
            dispatch(setOnlinePlayers(data.payload));
            break;
          case "roomCount":
            dispatch(setRoomCount(data.payload.count));
            break;
          case "createdRoom":
            router.push(`/games/caro/${data.payload._id}`)
            break;
          case "game":
            dispatch(addNewHistory(payload))
            break;
          case "TRANSACTION_COMPLETED":
            // dispatch(addRecord(payload));
            dispatch(addRecordAndUpdateBalance(payload))
            // alert("recepved deposit trx")

            break;
          case "remove-room":
            dispatch(removeRoom(payload));
            // alert("room closed")
            // alert(payload)

            break;
          case "new-room":
            dispatch(addRoom(payload));
            // alert("first room come")
            break;
          case "playerDisconnected":
            // dispatch(addRoom(payload));
            // alert(`${payload.username} disconnected`)
            break;
          case "playerReconnected":
            // dispatch(addRoom(payload));
            // alert(`${payload.username} reconnected`) 
            break;
          case "all":
            dispatch(
              setInstantMessage({
                message: payload.message,
                advertiser: payload.username,
              }),
            );
            break;
          default:
            break;
        }
      },
    }
  );

 

  return {
    isConnected,
    sendJsonMessage,
    lastJsonMessage,
  };
};
