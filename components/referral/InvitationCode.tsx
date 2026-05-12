import React from "react";
import { Copy, ArrowRight } from "lucide-react";

interface InvitationCodeProps {
  invitationCode: string;
  handleCopyCode: () => void;
  notification: string;
  setShowModal: (show: boolean) => void;
  hasRefer?: boolean;
}

const InvitationCode: React.FC<InvitationCodeProps> = ({
  invitationCode,
  handleCopyCode,
  notification,
  setShowModal,
  hasRefer,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-200">Invite Friends</h2>
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
              <p className="font-mono text-lg text-yellow-400 tracking-wider">{invitationCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="
                bg-yellow-400 
                hover:bg-yellow-500
                active:bg-yellow-600
                text-gray-900
                font-semibold
                px-4 
                py-3
                rounded-lg
                transition-all
                duration-200
                flex items-center gap-2
                min-w-[100px]
                justify-center
              "
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          {notification && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
              <p className="text-sm text-yellow-400 text-center">{notification}</p>
            </div>
          )}

          {!hasRefer && (
            <button
              onClick={() => setShowModal(true)}
              className="
                w-full
                bg-yellow-400
                hover:bg-yellow-500
                active:bg-yellow-600
                text-gray-900
                font-semibold
                px-6 
                py-3
                rounded-lg
                transition-all
                duration-200
                flex items-center justify-center gap-2
                group
              "
            >
              <span>Fill in the Invitation Code</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationCode;
