"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NetworkType = "mainnet" | "testnet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: () => void; // Called when user presses "Got it"
  network?: NetworkType; // Optional override; auto-detected if not provided
  blurBehind?: boolean;
  className?: string;
};

// Best-effort detection with sensible defaults for DX
function detectNetwork(): NetworkType {
  // Prefer explicit env if provided
  const envValue = process.env.NEXT_PUBLIC_PI_NETWORK?.toLowerCase();
  if (envValue === "mainnet" || envValue === "testnet") return envValue;

  // Fallback: Treat production as mainnet, others as testnet
  if (process.env.NODE_ENV === "production") return "mainnet";
  return "testnet";
}

export default function Network({ isOpen, onClose, onAcknowledge, network, blurBehind = true, className = "" }: Props) {
  const resolvedNetwork: NetworkType = useMemo(() => network ?? detectNetwork(), [network]);

  const isTestnet = resolvedNetwork === "testnet";
  const accentHex = isTestnet ? "#60A5FA" /* blue-400 */ : "#22C55E" /* green-500 */;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={[
            "fixed inset-0 z-50 flex items-center justify-center px-4",
            blurBehind ? "backdrop-blur-xl bg-black/40" : "bg-black/60",
          ].join(" ")}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={[
              "relative w-full max-w-md overflow-hidden rounded-2xl border",
              "border-zinc-700/60 text-zinc-100 shadow-2xl",
              blurBehind ? "backdrop-blur-xl" : "",
              className,
            ].join(" ")}
            style={{ backgroundColor: "#1e1f3a" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Network information"
          >
            {/* Top accent line */}
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${accentHex}, transparent 70%)` }}
            />

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <div
                  className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl border"
                  style={{
                    borderColor: `${accentHex}55`,
                    background: isTestnet
                      ? "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,51,234,0.12))"
                      : "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.12))",
                  }}
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke={accentHex} strokeWidth="2" />
                    <path d="M12 6v12M6 12h12" stroke={accentHex} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">
                    {isTestnet ? "You are on Testnet" : "You are on Mainnet"}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-300">
                    {isTestnet
                      ? (
                        <>
                          This environment uses test π (Pi) for development and QA. Transactions here are not
                          real and have no monetary value.
                        </>
                      )
                      : (
                        <>This environment uses mainnet π (Pi). Transactions and balances are real.</>
                      )}
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="mb-4 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: `${accentHex}55`, color: accentHex }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentHex }} />
                  {isTestnet ? "Testnet (Test π)" : "Mainnet (Real π)"}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-zinc-500/50"
                >
                  Dismiss
                </button>
                <button
                  onClick={onAcknowledge ?? onClose}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-zinc-900 shadow-lg transition active:scale-[.98] focus:outline-none focus:ring-2"
                  style={{ backgroundColor: accentHex }}
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
