"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Settings,
  HelpCircle,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { cn } from "@/lib/utils"
import SettingsPage from "@/app/me/settings/page"

type TabType = "settings" | "help" | "privacy" | "terms" 

const tabData: Record<TabType, { icon: React.ReactNode; title: string; link: string }> = {
  settings: {
    icon: <Settings className="w-5 h-5" />,
    title: "Settings",
    link: "/me/settings",
  },
  help: {
    icon: <HelpCircle className="w-5 h-5" />,
    title: "Help Center",
    link: "/me/help",
  },
  privacy: {
    icon: <Shield className="w-5 h-5" />,
    title: "Privacy",
    link: "/me/privacy",
  },
  terms: {
    icon: <FileText className="w-5 h-5" />,
    title: "Terms",
    link: "/me/terms",
  },
}

const legalContent: Record<"help" | "privacy" | "terms", string> = {
  help: "Welcome to our Help Center. Here you can find answers to common questions and learn how to make the most of our gaming platform.",
  privacy: "Our Privacy Policy outlines how we collect, use, and protect your personal information when you use our gaming services.",
  terms: "By using our gaming platform, you agree to abide by our Terms & Conditions. Please read them carefully to understand your rights and responsibilities as a player.",
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("settings")
  const [isLoaded, setIsLoaded] = useState(false)
  const { currentUser } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={cn("text-white mb-[100px] transition-all duration-500", isLoaded ? "opacity-100" : "opacity-0")}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="md:w-64">
          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-col space-y-2">
            {(Object.keys(tabData) as TabType[]).map((tab, index) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3",
                  "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/80",
                  activeTab === tab && "bg-gray-800 border-gray-600"
                )}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900/50">
                  {tabData[tab].icon}
                </div>
                <span>{tabData[tab].title}</span>
                {activeTab === tab && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    layoutId="activeTabIndicator"
                  />
                )}
              </motion.button>
            ))}

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-4 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3
                bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900/50">
                <LogOut className="w-5 h-5" />
              </div>
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex flex-col space-y-2">
            {(Object.keys(tabData) as TabType[]).map((tab, index) => (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={tabData[tab].link}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-between
                    bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/80"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900/50">
                      {tabData[tab].icon}
                    </div>
                    <span>{tabData[tab].title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </motion.div>
            ))}

           
          </div>
        </div>

        {/* Main Content Area */}
        <div className="hidden md:flex flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 w-full border border-gray-700/50 min-h-[500px]"
            >
              {activeTab === "settings" && <SettingsPage/>}

              {(activeTab === "help" || activeTab === "privacy" || activeTab === "terms") && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-900/50">
                      {tabData[activeTab].icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {tabData[activeTab].title}
                    </h2>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg leading-relaxed mb-6 text-gray-300"
                  >
                    {legalContent[activeTab as "help" | "privacy" | "terms"]}
                  </motion.p>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="h-4 bg-gray-700/50 rounded-lg w-3/4"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="h-4 bg-gray-700/50 rounded-lg w-5/6"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="h-4 bg-gray-700/50 rounded-lg w-2/3"
                    ></motion.div>
                  </div>

                  {activeTab === "help" && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-all duration-200 flex items-center gap-2"
                    >
                      <HelpCircle className="w-5 h-5" />
                      Contact Support
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
