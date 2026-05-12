"use client"
import Image from "next/image";
import { Check, Loader2, X } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { acceptFriendRequest, rejectFriendRequest } from "@/redux/slices/friends";
import { useState } from "react";

interface FriendRequestItemProps {
    username: string,
    id: string
}

const FriendRequestItem = ({ username, id }: FriendRequestItemProps) => {
    const [loading, setLoading] = useState(false);
    const [act, setAct] = useState<"a" |"r" | null>(null);
    const dispatch = useAppDispatch();

    const onAccept = async (friendId: string) => {
        setAct("a")
        setLoading(true);
        try {
            await dispatch(acceptFriendRequest(friendId));
        } catch (error) {
            console.error("Failed to accept friend request:", error);
            setAct(null)
        } finally {
            setAct(null)
            setLoading(false);
        }
    }
    
    const onReject = async (friendId: string) => {
        setAct("r")
        setLoading(true);
        try {
            await dispatch(rejectFriendRequest(friendId));
        } catch (error) {
            setAct(null)
            console.error("Failed to reject friend request:", error);
        } finally {
            setAct(null)
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-between friend-offline p-1 md:p-2 rounded-lg mb-2">
            <div className="flex items-center">
                <Image
                    src={"/pet.png"}
                    alt={username}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                />
                <span className="text-white">{username}</span>
            </div>
            <div>
                <button
                    onClick={() => onAccept(id)}
                    disabled={loading}
                    className="p-1 rounded-full bg-green-500 hover:bg-green-600 mr-2"
                >
                    {loading && act ==="a" ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                        <Check className="w-4 h-4 text-white" />
                    )}
                </button>
                <button
                    onClick={() => onReject(id)}
                    disabled={loading}
                    className="p-1 rounded-full bg-red-500 hover:bg-red-600"
                >
                    {loading && act ==="r" ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                        <X className="w-4 h-4 text-white" />
                    )}
                    
                </button>
            </div>
        </div>
    );
}

export default FriendRequestItem;