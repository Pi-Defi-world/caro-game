"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import InvitationCode from "./InvitationCode";
import TaskList from "./TaskList";
import InviteesList from "./InviteList";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchReferrals, setupReferralCode } from "@/redux/slices/auth";

const Invitation: React.FC = () => {
  const [invitationCode, setInvitationCode] = useState("soleil00");
  const [showModal, setShowModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const [notification, setNotification] = useState("");

  const dispatch = useAppDispatch();
  const { currentUser, referrals, isSubmittingReferralCode } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (currentUser) {
      setInvitationCode(currentUser.username);
      dispatch(fetchReferrals());
    }
  }, [currentUser, dispatch]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(invitationCode).then(() => {
      setNotification("Code copied to clipboard!");
      setTimeout(() => setNotification(""), 2000);
    });
  };

  const handleSubmitCode = () => {
    if (!isSubmittingReferralCode) {
      currentUser &&
        setEnteredCode("")
        dispatch(setupReferralCode(enteredCode)).finally(() => {
          setShowModal(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-zin0 rounded-md">
      <div className="">
        <div className="md:flex gap-3">
          <div className="md:w-2/3">
            <div className="flex justify-between mb-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <div className="flex flex-col items-start space-y-2">
                <p className="text-sm font-semibold text-gray-300 tracking-wide">
                  Points Earned
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-extrabold text-yellow-400">
                    {referrals?.length * 0.25}
                  </p>
                  <p className="text-lg font-semibold text-yellow-400/80 bg-yellow-400/10 px-2 py-0.5 rounded-md">GFP</p>
                </div>
              </div>
              <div className="flex flex-col items-start space-y-2">
                <p className="text-sm font-semibold text-gray-300 tracking-wide">
                  Number of Invitees
                </p>
                <p className="text-3xl font-extrabold text-yellow-400">
                  {referrals?.length}
                </p>
              </div>
            </div>

            <InvitationCode
              invitationCode={invitationCode}
              handleCopyCode={handleCopyCode}
              notification={notification}
              setShowModal={setShowModal}
              hasRefer={currentUser?.referr !== null}
            />

            <TaskList />
          </div>

          <div className="md:w-1/3">
            <div className="sticky top-0">
              <h3 className="text-xl font-bold text-gray-300 my-4">
                Invitation List
              </h3>
              <InviteesList referrals={referrals} />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmittingReferralCode) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="bg-gray-800/90 border border-gray-700/50 p-4 rounded-xl shadow-lg max-w-sm w-[90%] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-200">
              Enter Invitation Code
            </h3>

            <input
              type="text"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-700/50 text-gray-200 border border-gray-600/50 focus:border-yellow-400/50 focus:outline-none transition-colors placeholder:text-gray-400"
              placeholder="Enter your friend's code"
            />

            <div className="flex justify-between mt-8 gap-4">
              <button
                onClick={() => !isSubmittingReferralCode && setShowModal(false)}
                className={`
                  flex-1 bg-gray-700/50 text-gray-200 px-6 py-2 rounded-xl font-medium
                  transition-all duration-200 
                  hover:bg-gray-700
                  active:bg-gray-600
                  ${isSubmittingReferralCode ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={isSubmittingReferralCode}
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isSubmittingReferralCode || !enteredCode}
                className={`
                  flex-1 bg-yellow-400 px-6 py-2 rounded-xl font-medium text-gray-900
                  transition-all duration-200
                  hover:bg-yellow-500
                  active:bg-yellow-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isSubmittingReferralCode ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitation;
