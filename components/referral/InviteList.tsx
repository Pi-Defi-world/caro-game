import { IReferal } from "@/redux/slices/auth";
import React from "react";
import { motion } from "framer-motion";
import { Users, Star } from "lucide-react";


const InviteesList = ({ referrals }: { referrals: IReferal[]}) => {
  const allUsers = [...(referrals || [])];

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-3 mb-[70px]">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-bold text-gray-200">Invited Friends</h3>
      </div>

      {allUsers.length > 0 ? (
        <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {allUsers.map((user, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="
                bg-gray-700/30 
                border border-gray-600/30
                rounded-lg 
                p-3
                hover:bg-gray-700/50
                transition-all
                duration-200
              "
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="font-medium text-gray-200">{user.username}</p>
                </div>
                <div className="
                  flex items-center
                  bg-yellow-400/10
                  border border-yellow-400/20
                  rounded-lg
                  px-2.5
                  py-1
                ">
                  <p className="text-yellow-400 font-bold">+{user.points}</p>
                  <span className="text-yellow-400/80 text-sm ml-1">GFP</span>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="
          flex flex-col items-center justify-center 
          py-8 px-4 
          text-center
          bg-gray-700/30 
          rounded-lg 
          border border-gray-600/30
        ">
          <Users className="w-8 h-8 text-gray-500 mb-2" />
          <p className="text-gray-400">You haven't invited anyone yet.</p>
          <p className="text-gray-500 text-sm mt-1">Invite friends to earn GFP!</p>
        </div>
      )}
    </div>
  );
};

export default InviteesList;

