"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { completeTask, fetchTasks, ITask } from "@/redux/slices/tasks";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Loader2, Trophy, Star } from 'lucide-react';
import { updateBalance, updateGFPBalance } from "@/redux/slices/auth";

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleClick = (task: ITask) => {
    if (task.type === "link") {
      window.open(task.link, "_blank");
      dispatch(completeTask(task._id)).unwrap().then(() => {
        dispatch(updateGFPBalance(task.reward))
      })
    }
  };

  const handleCheckStatus = (task: ITask) => {
    dispatch(completeTask(task._id)).unwrap().then(() => {
      dispatch(updateGFPBalance(task.reward))
    })
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-gray-200">Daily Tasks</h3>
        </div>
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-gray-200">Daily Tasks</h3>
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-400">No tasks available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-gray-200">Daily Tasks</h3>
      </div>
      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              relative overflow-hidden
              bg-gray-800/50 
              border border-gray-700/50
              rounded-xl
              p-3
              ${task.users.some(user => user === currentUser?.username) 
                ? 'bg-green-900/20 border-green-500/20' 
                : 'hover:bg-gray-700/50'
              }
              transition-all duration-300
            `}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {/* <Star className={`w-4 h-4 ${task.users.some(user => user === currentUser?.username) ? 'text-green-400' : 'text-yellow-400'}`} /> */}
                  <p className="text-gray-200 font-medium">{task.description}</p>
                </div>
                
                {task.type === "deposit" && !task.users.some(user => user === currentUser?.username) && (
                  <button
                    onClick={() => handleCheckStatus(task)}
                    className="
                      mt-2
                      text-sm
                      bg-blue-500/20
                      text-blue-400
                      px-3
                      py-1
                      rounded-lg
                      hover:bg-blue-500/30
                      transition-colors
                      duration-300
                      border border-blue-500/20
                    "
                  >
                    Check Status
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="
                  flex items-center
                  bg-yellow-400/10
                  border border-yellow-400/20
                  rounded-lg
                  px-3
                  py-1.5
                ">
                  <p className="text-yellow-400 font-bold">{task.reward}</p>
                  <span className="text-yellow-400/80 text-sm ml-1">GFP</span>
                </div>

                {task.type === "link" && !task.users.some(user => user === currentUser?.username) && (
                  <button
                    onClick={() => handleClick(task)}
                    className="
                      p-2
                      bg-blue-500/20
                      text-blue-400
                      rounded-lg
                      hover:bg-blue-500/30
                      transition-colors
                      duration-300
                      border border-blue-500/20
                    "
                  >
                    <ExternalLink size={18} />
                  </button>
                )}
                
                {task.users.some(user => user === currentUser?.username) && (
                  <div className="
                    p-2
                    bg-green-500/20
                    text-green-400
                    rounded-lg
                    border border-green-500/20
                  ">
                    <CheckCircle size={18} />
                  </div>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

