"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  inviterName: string;
  inviterAvatarUrl?: string;
  roomName: string;
  betAmount: number; // in Pi
  expiresInSec?: number;
  accentHex?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onExpire?: () => void;
  blurBehind?: boolean;
  className?: string;
  roomId?: string;
  userId?: string;
  isJoining?: boolean;
};

export default function FriendInvite({
  inviterName,
  inviterAvatarUrl,
  roomName,
  betAmount,
  expiresInSec = 15,
  accentHex = "#F59E0B",
  onAccept,
  onDecline,
  onExpire,
  blurBehind = true,
  className = "",
  roomId,
  userId,
  isJoining = false,
}: Props) {
  const [left, setLeft] = useState(expiresInSec);
  const raf = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const step = (t: number) => {
      if (startedAt.current == null) startedAt.current = t;
      const elapsed = (t - startedAt.current) / 1000;
      const remain = Math.max(expiresInSec - elapsed, 0);
      setLeft(remain);
      if (remain > 0) raf.current = requestAnimationFrame(step);
      else onExpire?.();
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [expiresInSec, onExpire]);

  const pct = useMemo(() => (left / expiresInSec) * 100, [left, expiresInSec]);
  const ringStyle = useMemo(
    () => ({
      background: `conic-gradient(${accentHex} ${pct}%, rgba(255,255,255,0.08) 0)`,
    }),
    [pct, accentHex]
  );
  const seconds = Math.ceil(left);

  const handleAccept = () => {
    onAccept?.();
    if (roomId) router.push(`/games/caro/${roomId}`);
  };

  const handleDecline = () => {
    onDecline?.();
  };

  return (
    <div
      role="dialog"
      aria-label="Friend room invitation"
      aria-live="assertive"
      className={[
        "fixed inset-x-0 top-4 z-50 mx-auto w-[92%] sm:w-[540px]",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden rounded-2xl border",
          "border-zinc-700/60 bg-zinc-900/80 text-zinc-100 shadow-2xl",
          blurBehind ? "backdrop-blur-xl" : "",
        ].join(" ")}
      >
        {/* Top accent line */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${accentHex}, transparent 70%)`,
          }}
        />

        <div className="flex items-center gap-3 p-3 sm:p-4">
          {/* Avatar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-700">
            {inviterAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={inviterAvatarUrl}
                alt={`${inviterName} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-lg font-semibold">
                {inviterName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span
              className="absolute -right-1 -top-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: accentHex, color: "#0B0D12" }}
            >
              INVITE
            </span>
          </div>

          {/* Info block */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-0.5">
              <span className="truncate text-base font-semibold sm:text-lg">
               Your friend {inviterName} invited you to join
              </span>
              <span className="truncate text-sm text-zinc-300 font-medium">
                Room: <span className="font-semibold text-white">{roomName}</span>
              </span>
              <span className="truncate text-sm text-zinc-300 font-medium">
                Bet: <span className="font-semibold text-[#FFD700]">{betAmount} π</span>
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="relative">
            <div
              className="grid h-14 w-14 place-items-center rounded-full p-1"
              style={ringStyle}
              aria-hidden="true"
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-zinc-900">
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: accentHex }}
                  aria-label={`Expires in ${seconds} seconds`}
                >
                  {seconds}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 border-t border-zinc-800 p-3 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-4">
          <button
            onClick={handleDecline}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={isJoining}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-zinc-900 shadow-lg transition active:scale-[.98] focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentHex }}
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mr-2" />
                Joining...
              </>
            ) : (
              "Join Room"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
