"use client"

import { useSocket } from "@/hooks/useSocket"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchPriviledges } from "@/redux/slices/auth"
import { fetchMyCharactersNFTs } from "@/redux/slices/characters"
import { applyForModerator, type IChat } from "@/redux/slices/message"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ApplyModeratorProps {
  chat: IChat
}

export default function ApplyModerator({ chat }: ApplyModeratorProps) {
  const { sendJsonMessage } = useSocket()
  const [loading,setLoading] = useState(false)
  const {myNfts} = useAppSelector(state => state.characters)
  const dispatch = useAppDispatch()

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchMyCharactersNFTs()).unwrap();
      } catch (err) {
      }
    })();
  }, [dispatch]);

  const isEligible = myNfts.length > 0

  const handleApply = async () => {
    if (!chat || loading) return;
    setLoading(true);
    try {
      await dispatch(applyForModerator(chat._id)).unwrap();
      await dispatch(fetchPriviledges()).unwrap();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="text-center text-white/80">
        <p className="text-lg font-semibold mb-2">This chat room has no moderator</p>
        <p className="text-sm text-white/60 mb-4">
          Help the community by becoming a moderator for {chat.name}
        </p>
        <button
            disabled={!isEligible}
          onClick={handleApply}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {loading
            ? <Loader2 className="inline-block animate-spin mr-2 h-4 w-4" />
            : isEligible
              ? "Apply to Become Moderator"
              : "You need at least 1 Character NFT to apply"
          }
        </button>
        <div className="mt-6 bg-slate-900/80 rounded-lg p-4 text-left text-white/80 space-y-4">
          <div>
            <p className="font-semibold mb-2">Requirements</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Own at least <b>1 character</b> in the Shop.</li>
              <li>Each character = <b>1 DAO</b> </li>
              {/* <li>Total DAO supply: <b>6,280</b> (distributed to the community).</li> */}
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Benefits</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Eligible to become a chat Moderator (DAO role).</li>
              <li>Receive <b>20% of all service fees</b> (from Caro table fees) divided among all DAO holders.</li>
              <li>DAO holders can vote on important decisions.</li>
              <li>Receiver free Pet used durng the game </li>
            </ul>
            {/* <div className="mt-2 text-xs text-white/60">
              <b>Example:</b> If Caro table fees generate <b>1,000 Pi</b> in a month,<br />
              DAO receives 20% = <b>200 Pi</b>, divided equally among all DAO holders.
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
} 