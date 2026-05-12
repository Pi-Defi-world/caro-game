"use client"

import { useSocket } from "@/hooks/useSocket"
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react"
import Board from "./Board"
import { WinnerModal } from "./WinnerModal"
import FightIntro from "./Intro"
import PlayerAvatar from "./PlayerAvatar"
import WaitingRoom from "./WaitingRoom"
import { GameEvent } from "@/enum"
import { useAppDispatch } from "@/redux/hooks"
import { type IUser, updateUserBalance } from "@/redux/slices/auth"
import { handleGameOver, leaveRoom, removePlayerFromRoom, type IRoom } from "@/redux/slices/room"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Clock, Trophy, Users, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import GamePaused from "./game-paused"
import Rematch from "./Rematch"
import { useRouter } from "next/navigation"

type GameStage = "intro" | "waiting" | "playing" | "ended" | "paused"

interface IGame {
    currentUser: IUser
    isHost: boolean
    currentRoom: IRoom
    messages: any
    onReady: () => void,
    isInRoom: boolean
}

const Game: React.FC<IGame> = ({ currentUser, isHost, currentRoom, messages, onReady, isInRoom }) => {
    // Game state
    const [myTurn, setMyTurn] = useState(false)
    const [isOver, setIsOver] = useState(false)
    const [symbol, setSymbol] = useState("")
    const [gameMessage, setGameMessage] = useState("Waiting for another player to join...")
    const [gameStage, setGameStage] = useState<GameStage>("intro")
    const [gameResult, setGameResult] = useState<"win" | "loss" | "draw" | null>(null)
    const [isOpponentReady, setIsOpponentReady] = useState(false)
    const [moveCount, setMoveCount] = useState(0)
    const [lastMoveTime, setLastMoveTime] = useState<Date | null>(null)
    const [isRoomPaused, setIsRoomPaused] = useState(false)
    const [reasonForPause, setReasonForPause] = useState<string | null>("")
    // Rematch state
    const [hasRequestedRematch, setHasRequestedRematch] = useState(false)
    const [opponentRequestedRematch, setOpponentRequestedRematch] = useState(false)
    const [hasKickedOut,sethasKickedOut]=useState(false)

  const BACKING_ROWS = 20 // max rows
  const BACKING_COLS = 13 // max cols
    const [boardState, setBoardState] = useState<Record<string, string>>({})
    const [viewport, setViewport] = useState<{ startRow: number; startCol: number; rows: number; cols: number }>(() => ({
        // start exactly at the original 14x10, with hidden margins for expansion
        // 17 - 14 = 3 -> startRow 1 leaves 1 above and 2 below; 13 - 10 = 3 -> startCol 1 leaves 1 left and 2 right
        startRow: 1,
        startCol: 1,
        rows: 14,
        cols: 10,
    }))

    const router = useRouter()

    // Refs for game control
    const alreadyCalledWinner = useRef(false)
    const lastMoveTimestamp = useRef<number>(0)
    const moveCooldown = useRef<number>(500)
    const gameStartTime = useRef<number>(0)

    const hostPlayer = currentRoom.players.find((player) => player._id === currentRoom.host._id.toString())
    const guestPlayer = currentRoom.players.find((player) => player._id !== currentRoom.host._id.toString())
    const isMeHost = hostPlayer?._id === currentUser._id

    // Hooks
    const { sendJsonMessage, lastJsonMessage } = useSocket()
    const dispatch = useAppDispatch()

    // Memoized values
    const gameDuration = useMemo(() => {
        if (gameStartTime.current === 0) return 0
        return Math.floor((Date.now() - gameStartTime.current) / 1000)
    }, [gameStage])

    const isGameActive = useMemo(() => gameStage === "playing" && !isOver && !isRoomPaused, [gameStage, isOver, isRoomPaused])

    // Check if current user is in the room
    // useEffect(() => {
    //   if (
    //     currentRoom &&
    //     Array.isArray(currentRoom.players) &&
    //     currentUser &&
    //     currentUser._id
    //   ) {
    //     const found = currentRoom.players.some(
    //       (player: any) =>
    //         player &&
    //         (player._id === currentUser._id ||
    //           player._id?.toString() === currentUser._id?.toString())
    //     )
    //     setIsInRoom(found)
    //   } else {
    //     setIsInRoom(false)
    //   }
    // }, [currentRoom, currentUser])

    // Game logic functions
    const countDir = useCallback((r: number, c: number, dr: number, dc: number, sym: string, state: Record<string, string>) => {
        let count = 0
        let row = r + dr
        let col = c + dc
        while (row >= 0 && row < BACKING_ROWS && col >= 0 && col < BACKING_COLS && (state[`${row}:${col}`] ?? " ") === sym) {
            count++
            row += dr
            col += dc
        }
        return count
    }, [])

    const isGameOver = useCallback((r: number, c: number, sym: string, state: Record<string, string>) => {
        const dirs = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1],
        ] as const
        for (const [dr, dc] of dirs) {
            const total = 1 + countDir(r, c, dr, dc, sym, state) + countDir(r, c, -dr, -dc, sym, state)
            if (total >= 5) return true
        }
        return false
    }, [countDir])

    const isGameDraw = useCallback((moves: number) => {
        return moves >= BACKING_ROWS * BACKING_COLS
    }, [])

    const handleMove = useCallback((row: number, col: number) => {
        // Don't allow moves when room is paused
        const key = `${row}:${col}`
        if (isRoomPaused || !myTurn || (boardState[key] ?? " ") !== " " || gameStage !== "playing") return

        const now = Date.now()
        if (now - lastMoveTimestamp.current < moveCooldown.current) {
            console.log("Move too fast! Please wait before making another move.")
            return
        }

        lastMoveTimestamp.current = now
        setMoveCount(prev => prev + 1)
        setLastMoveTime(new Date())

        setBoardState((prevState) => ({
            ...prevState,
            [key]: symbol,
        }))

        sendJsonMessage({
            type: "makeMove",
            payload: {
                symbol: symbol,
                position: `${String.fromCharCode(97 + row)}${col}`,
                userId: currentUser._id,
                roomId: currentRoom._id,
            },
        })
        maybeExpandViewport(row, col)
    }, [isRoomPaused, myTurn, boardState, gameStage, symbol, sendJsonMessage, currentUser._id, currentRoom._id])

    const maybeExpandViewport = useCallback((r: number, c: number) => {
        const expandThreshold = 0
        const expandStep = 1
        let { startRow, startCol, rows, cols } = viewport
        const nearNorth = r <= startRow + expandThreshold
        const nearSouth = r >= startRow + rows - 1 - expandThreshold
        const nearWest = c <= startCol + expandThreshold
        const nearEast = c >= startCol + cols - 1 - expandThreshold

        if (nearNorth && startRow > 0) {
            const step = Math.min(expandStep, startRow)
            startRow -= step
            rows += step
        }
        if (nearSouth && startRow + rows < BACKING_ROWS) {
            const step = Math.min(expandStep, BACKING_ROWS - (startRow + rows))
            rows += step
        }
        if (nearWest && startCol > 0) {
            const step = Math.min(expandStep, startCol)
            startCol -= step
            cols += step
        }
        if (nearEast && startCol + cols < BACKING_COLS) {
            const step = Math.min(expandStep, BACKING_COLS - (startCol + cols))
            cols += step
        }
        setViewport({ startRow, startCol, rows, cols })
    }, [viewport])

    const handleWinner = useCallback(
        (message: "win" | "draw") => {
            if (isOver || alreadyCalledWinner.current) return

            alreadyCalledWinner.current = true
            setGameStage("ended")
            setIsOver(true)

            if (message === "win" && myTurn) {
                setGameResult("win")
                dispatch(
                    handleGameOver({
                        winner: currentUser._id,
                        roomId: currentRoom?._id,
                        isDraw: false,
                    }),
                )
            } else if (message === "draw" && myTurn) {
                setGameResult("draw")
                dispatch(
                    handleGameOver({
                        winner: "",
                        roomId: currentRoom?._id,
                        isDraw: true,
                    }),
                )
            } else {
                setGameResult("loss")
            }
        },
        [currentUser?._id, currentRoom?._id, dispatch, isOver, myTurn],
    )

    const handleMissedTurn = useCallback(() => {
        if (isRoomPaused || currentRoom.status !== "closed" && gameStage === "playing" && myTurn) {
            sendJsonMessage({
                type: "missedTurn",
                payload: {
                    userId: currentUser._id,
                    roomId: currentRoom._id,
                },
            })
            setMyTurn(false)
            setGameMessage("You missed your turn. Opponent's turn...")
        }
    }, [isRoomPaused, currentUser?._id, currentRoom?._id, currentRoom?.status, gameStage, myTurn, sendJsonMessage])

    const handleStartGame = useCallback(() => {
        sendJsonMessage({
            type: "startGame",
            payload: {
                roomId: currentRoom._id,
            },
        })
    }, [sendJsonMessage, currentRoom._id])

    // Rematch handlers (client-side no-op if server doesn't support yet)
    const onRequestRematch = () => {
        setHasRequestedRematch(true)
        try {
            if (guestPlayer && guestPlayer._id) {
                sendJsonMessage({ type: "requestRematch", payload: { roomId: currentRoom._id, userId: currentUser._id } })
            }
        } catch {}
    }

    const onAcceptRematch = useCallback(() => {
        try {
            sendJsonMessage({ type: "acceptRematch", payload: { roomId: currentRoom._id, userId: currentUser._id } })
            setGameStage("waiting")
        } catch {}
    }, [sendJsonMessage, currentRoom._id, currentUser._id])

    const onRemovePlayerInRoom = useCallback(() => {
        try {
            // Send the opponent's userId, not the current user's
            const opponentId = guestPlayer?._id === currentUser._id ? hostPlayer?._id : guestPlayer?._id
            sendJsonMessage({ type: "kickPlayer", payload: { roomId: currentRoom._id, userId: opponentId } })
            // setGameStage("waiting")
            
        } catch {}
    }, [sendJsonMessage, currentRoom._id, currentUser._id])

    const onTransferRoomOwnership = useCallback(() => {
        try {
            sendJsonMessage({ type: "transferOwnership", payload: { roomId: currentRoom._id, userId:guestPlayer?._id } })
            setGameStage("waiting")
        } catch {}
    }, [sendJsonMessage, currentRoom._id, currentUser._id])

    const onRejectRematch = useCallback(() => {
        try {
            sendJsonMessage({ type: "rejectRematch", payload: { roomId: currentRoom._id, userId: currentUser._id } })
        } catch {}
    }, [sendJsonMessage, currentRoom._id, currentUser._id])

    const onLeaveRoom = useCallback(async () => {
        try {
            sendJsonMessage({ type: "user-leave", payload: { roomId: currentRoom._id, userId: currentUser._id } })
        } catch (err) {
            // Handle error if needed
        }
    }, [dispatch, currentRoom._id])

    // Effects
    useEffect(() => {
        if (currentRoom.stage === "playing") {
            setGameStage("playing")
        } else if (currentRoom.stage === "ended") {
            setGameStage("ended")

        } else if (currentRoom.stage === "paused") {
            setGameStage("paused")
            setReasonForPause("Game is paused because of your opponent was disconnected")
            setIsRoomPaused(true)
        } else if (currentRoom.stage === "waiting") {
            setGameStage("intro")
            const timer = setTimeout(() => {
                setGameStage("waiting")
            }, 12000)
            return () => clearTimeout(timer)
        } else {
            setGameStage("intro")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoom.stage])

    useEffect(() => {
        if (!isOver) {
            alreadyCalledWinner.current = false
        }
    }, [isOver])

    useEffect(() => {
        if (!lastJsonMessage) return

        const { type, payload } = lastJsonMessage as { type: string; payload: any }

        switch (type) {
            case "gameBegin":
                setSymbol(isHost ? "X" : "O")
                setMyTurn(isHost)
                setGameMessage(isHost ? "Your turn..." : "Opponent's turn...")
                setGameStage("playing")
                gameStartTime.current = Date.now()
                break

            case "moveMade": {
                const pos: string = payload.position
                const row = pos.charCodeAt(0) - 97
                const col = Number(pos.slice(1))
                setBoardState((prevState) => {
                    const key = `${row}:${col}`
                    const updatedState = {
                        ...prevState,
                        [key]: payload.symbol,
                    }

                    const newTurn = payload.symbol !== symbol
                    setMyTurn(newTurn)

                    if (newTurn) {
                        lastMoveTimestamp.current = 0
                    }

                    if (isGameOver(row, col, payload.symbol, updatedState)) {
                        if (!isOver) {
                            handleWinner("win")
                            setGameMessage(newTurn ? "Game over. You won!" : "Game over. You lost!")
                            setIsOver(true)
                        }
                    } else if (isGameDraw(moveCount + 1)) {
                        if (!isOver) {
                            handleWinner("draw")
                            setIsOver(true)
                            setGameMessage("Game Over. It was a draw!")
                        }
                    } else {
                        setGameMessage(newTurn ? "Your turn..." : "Opponent's turn...")
                    }

                    maybeExpandViewport(row, col)

                    return updatedState
                })
                break
            }

            case "missedTurn":
                if (payload.userId !== currentUser._id) {
                    setMyTurn(true)
                    setGameMessage("Opponent missed their turn. Your turn...")
                } else {
                    setMyTurn(false)
                    setGameMessage("You missed your turn. Opponent's turn...")
                }
                break

            case GameEvent.READY:
                setIsOpponentReady(true)
                break

            case "opponent.left":
                setGameMessage("Your opponent left the game.")
                break

            case "room-paused":
                setIsRoomPaused(true)
                setGameMessage("Game is paused by the host...")
                setReasonForPause(payload.message)
                break

            case "room-resumed":
                setIsRoomPaused(false)
                setGameMessage("Game resumed! Your turn...")
                break
            case "requestRematch":
                if (payload?.userId && payload.userId !== currentUser._id) {
                    setOpponentRequestedRematch(true)
                }
                console.log("requestRematch", payload)
            
                break
            case "resetRematch":
                setHasRequestedRematch(false)
                setOpponentRequestedRematch(false)
                break
            case "acceptRematch": {
                // Server acknowledges rematch acceptance
                setHasRequestedRematch(false)
                setOpponentRequestedRematch(false)
                setGameStage("waiting")
                setGameMessage("Rematch accepted. Preparing new game...")
                setBoardState({})
                setMyTurn(isHost)
                setIsOpponentReady(false)
                setGameStage("waiting")
                setIsOver(false)
                setMoveCount(0)
                break
            }
            case "rejectRematch": {
                // Server notifies rematch rejection
                setHasRequestedRematch(false)
                setOpponentRequestedRematch(false)
                setGameMessage("Rematch rejected.")
                break
            }
            case "insufficient-balance": {
                alert("balnce")
                setHasRequestedRematch(false)
                setOpponentRequestedRematch(false)
                setGameMessage("Opponent doesn't have enough balance")
                break
            }
            case "user-leave": {
                if (payload?.userId && payload.userId === currentRoom.host._id.toString()) {
                    // Host left - redirect to lobby
                    router.push("/")
                    return
                }
                // If guest is leaving, remove them from room
                onRemovePlayerInRoom()
                break
            }
            case "kicked-out": {
                if (
                    payload?.roomId &&
                    payload?.userId &&
                    payload.userId !== currentUser._id
                ) {
                    dispatch(removePlayerFromRoom({ roomId: currentRoom._id, playerId: payload.userId }));
                }
                if (payload?.userId && payload.userId === currentUser._id) {
                    sethasKickedOut(true)
                    setGameMessage("You've been kicked out of the room");

                    setTimeout(() => {
                        setGameMessage("Redirecting to Lobby");
                        router.push("/");
                    }, 2000);
                }
                break;
            }
        }
    }, [lastJsonMessage, symbol, isHost, currentUser?._id, handleWinner, isOver, isGameOver])

    // Render logic
    if (gameStage === "intro") {
        return <FightIntro currentRoom={currentRoom} />
    }

    

    return (
        <div className="flex px-2 w-full h-screen fixed inset-0 flex-col justify-between items-center overflow-hidden">
            <div className="flex justify-between items-center w-full">
                { <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 -z-10 rounded-full blur-md bg-gradient-to-r from-pink-500/40 to-purple-500/40" />
                            <p className="p-2 rounded-full bg-white/80 backdrop-blur text-gray-800 shadow border border-white/60 font-semibold text-sm sm:text-base">
                      
                                {gameResult === "win"
                                    ? " You won the match"
                                    : gameResult === "loss"
                                    ? " You lost the match"
                                    : gameResult === "draw"
                                    ? " It's a draw"
                                    : gameMessage}
                            </p>
                        </div>
                    </motion.div>
                </div>}
                <div>
                    {gameStage === "paused" && (
                        <GamePaused
                            reason={reasonForPause ?? undefined}
                            opponent={guestPlayer?.username ?? hostPlayer?.username}
                            opponentId={guestPlayer?._id ?? hostPlayer?._id}
                            roomId={currentRoom?._id}
                            isInRoom={isInRoom}
                        />
                    )}
                    {isMeHost && guestPlayer && (
                        <PlayerAvatar
                            hasStarted={gameStage === "playing"}
                            username={guestPlayer.username}
                            symbol="O"
                            isYourTurn={myTurn !== isHost && !isRoomPaused}
                            onTimerEnd={handleMissedTurn}
                            message={messages.player === guestPlayer.username ? messages.message : null}
                            className="mb-10"
                            isPaused={isRoomPaused}
                        />
                    )}

                    {!isMeHost && hostPlayer && (
                        <PlayerAvatar
                            hasStarted={gameStage === "playing"}
                            username={hostPlayer.username}
                            symbol="X"
                            isYourTurn={myTurn === isHost && !isRoomPaused}
                            onTimerEnd={handleMissedTurn}
                            message={messages.player === hostPlayer.username ? messages.message : null}
                            className="mb-10"
                            isPaused={isRoomPaused}
                        />
                    )}
                </div>

                <div>
                    {!isMeHost && guestPlayer && (
                        <PlayerAvatar
                            hasStarted={gameStage === "playing"}
                            username={guestPlayer.username}
                            symbol="O"
                            isYourTurn={myTurn !== isHost && !isRoomPaused}
                            onTimerEnd={handleMissedTurn}
                            message={messages.player === guestPlayer.username ? messages.message : null}
                            className="mb-10"
                            isPaused={isRoomPaused}
                        />
                    )}

                    {isMeHost && hostPlayer && (
                        <PlayerAvatar
                            hasStarted={gameStage === "playing"}
                            username={hostPlayer.username}
                            symbol="X"
                            isYourTurn={myTurn === isHost && !isRoomPaused}
                            onTimerEnd={handleMissedTurn}
                            message={messages.player === hostPlayer.username ? messages.message : null}
                            className="mb-10"
                            isPaused={isRoomPaused}
                        />
                    )}
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center w-full">
                {gameStage === "waiting" && (
                    <WaitingRoom
                        isHost={isHost}
                        onStartGame={handleStartGame}
                        onReady={onReady}
                        isOpponentReady={isOpponentReady}
                    />
                )}
                {gameStage === "playing" && (
                    <Board
                        boardState={boardState}
                        handleMove={handleMove}
                        viewport={viewport}
                        isDisabled={!myTurn || gameStage !== "playing" || isRoomPaused}
                        className="w-full"
                    />
                )}
                {gameStage === "ended" && (
                    <div className="w-full max-w-2xl mt-4">
                        <Rematch
                            isHost={isHost}
                            onLeaveRoom={onLeaveRoom}
                            hasKickedOut={hasKickedOut}
                            onRequestRematch={onRequestRematch}
                            onKickoutPlayer={onRemovePlayerInRoom}
                            onAcceptRematch={onAcceptRematch}
                            amount={currentRoom.betAmount || 0}
                            onRejectRematch={onRejectRematch}
                            hasRequestedRematch={hasRequestedRematch}
                            opponentRequestedRematch={opponentRequestedRematch}
                        />
                    </div>
                )}
            </div>

            {/* Winner Modal */}
            <AnimatePresence>
                {isOver && (
                    <WinnerModal
                        message={gameResult}
                        roomId={currentRoom?._id}
                    />
                )}
            </AnimatePresence>

            

        </div>
    )
}

export default Game