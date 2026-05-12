"use client"

import { useEffect, useState } from "react"
import { Bell, Mail, Trophy, CheckCircle, Send, ArrowRight, Link } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { bindEmail, subscribeToNewsletter, verifyBindEmailOtp } from "@/redux/slices/auth"
import ShopBanner from "@/app/shop/ShopBanner"
import { usePathname } from "next/navigation"

export default function SettingsPage() {
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [animate, setAnimate] = useState(false)
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.auth)

  const pathname = usePathname()

  const noHeader = pathname === "/me"

  useEffect(() => {
    if (currentUser?.email) {
      setIsVerified(true)
      setEmail(currentUser.email)
    }
  }, [currentUser?.email])

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [animate])

  const sendVerificationCode = async () => {
    if (!email || !email.includes("@")) return

    setIsSending(true)
    try {
      await dispatch(bindEmail(email)).unwrap()
      setEmailSent(true)
      setIsVerifying(true)
    } catch (error) {
      console.error("Failed to send verification code:", error)
    } finally {
      setIsSending(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode) return

    setIsChecking(true)
    try {
      await dispatch(verifyBindEmailOtp(verificationCode)).unwrap()
      setIsVerified(true)
      setAnimate(true)
    } catch (error) {
      console.error("Failed to verify code:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubscribeToNewsletter = async () => {
    try {
      await dispatch(subscribeToNewsletter()).unwrap()
    } catch (error) {
      console.error("Failed to subscribe:", error)
    }
  }

  return (
    <div className="min-h-screen text-white">
      {!noHeader && (
        <>
          {/* <BackNav link="/me" title="Settings" /> */}
          <ShopBanner title="Settings" redirect="/me" />
        </>
      )}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <div className="text-slate-300 text-md mb-3">
            {isVerified
              ? "Manage your email notification preferences"
              : "Verify your email address to manage notifications"}
          </div>
          {!isVerified ? (
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <Label htmlFor="email" className="text-white text-sm font-medium mb-1.5 block">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 bg-slate-800/80 text-white border-slate-700 h-12 pl-4 pr-10 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    disabled={isVerifying || isSending}
                  />
                  {emailSent && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
              </div>

              {!isVerifying ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={sendVerificationCode}
                    className={`
                      relative
                      w-full
                      bg-gradient-to-r from-yellow-500 to-yellow-600
                      text-white
                      font-semibold
                      px-6 
                      py-1
                      rounded-lg
                      overflow-hidden
                      transition-all
                      duration-300
                      shadow-[0_4px_0_rgb(202,138,4)]
                      hover:shadow-[0_2px_0_rgb(202,138,4)]
                      active:shadow-none
                      active:translate-y-1
                      before:absolute
                      before:inset-0
                      before:bg-gradient-to-r
                      before:from-yellow-400
                      before:to-yellow-500
                      before:opacity-0
                      before:transition-opacity
                      hover:before:opacity-100
                      before:duration-300
                      group
                    `}
                    disabled={!email || !email.includes("@") || isSending}
                  >
                    {isSending ? (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Code...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Verification Code
                      </span>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4 rounded-xl bg-slate-800/50 p-3 border border-slate-700"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className=" mb-2">
                    <p className="text-sm text-slate-300">We&apos;ve sent a verification code to</p>
                    <p className="text-yellow-400 font-medium">{email}</p>
                  </div>

                  <div>
                    <Label htmlFor="code" className="text-white text-sm font-medium mb-1.5 block">
                      Enter verification code you received on your email below
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      className="bg-slate-800/80 text-white border-slate-700 h-12  text-lg tracking-widest font-medium"
                      maxLength={6}
                      disabled={isChecking}
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={verifyCode}
                      className={`
                        relative
                        w-full
                        bg-gradient-to-r from-yellow-500 to-yellow-600
                        text-white
                        font-semibold
                        px-6 
                        py-1
                        rounded-lg
                        overflow-hidden
                        transition-all
                        duration-300
                        shadow-[0_4px_0_rgb(202,138,4)]
                        hover:shadow-[0_2px_0_rgb(202,138,4)]
                        active:shadow-none
                        active:translate-y-1
                        before:absolute
                        before:inset-0
                        before:bg-gradient-to-r
                        before:from-yellow-400
                        before:to-yellow-500
                        before:opacity-0
                        before:transition-opacity
                        hover:before:opacity-100
                        before:duration-300
                        group
                      `}
                      disabled={verificationCode.length !== 6 || isChecking}
                    >
                      {isChecking ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-5 w-5" />
                          Verify Code
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="">
                    <button
                      onClick={() => {
                        setIsVerifying(false)
                        setEmailSent(false)
                      }}
                      className="text-sm text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      Change email address
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {animate && (
                <div className="mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3"
                  >
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white">Email Binded successfully!</h3>
                  <p className="text-slate-400">{currentUser?.email || email}</p>
                </div>
              )}
            </motion.div>
          )}
          <div className="space-y-3">
            <motion.div
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <Label htmlFor="game-results" className="text-white font-medium">
                    Game Results
                  </Label>
                  <p className="text-sm text-slate-400">Get notified when you win or lose a game</p>
                </div>
              </div>
              <Switch id="game-results" className="data-[state=checked]:bg-yellow-600" />
            </motion.div>

            <motion.div
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <Label htmlFor="challenges" className="text-white font-medium">
                    Challenges
                  </Label>
                  <p className="text-sm text-slate-400">Receive notifications for new game challenges</p>
                </div>
              </div>
              <Switch id="challenges" className="data-[state=checked]:bg-yellow-600" />
            </motion.div>

            <motion.div
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <Label htmlFor="newsletter" className="text-white font-medium">
                    Newsletter
                  </Label>
                  <p className="text-sm text-slate-400">Stay updated with platform news and updates</p>
                </div>
              </div>
              <Switch
                id="newsletter"
                checked={currentUser?.newsletterSubscribed}
                onCheckedChange={handleSubscribeToNewsletter}
                className="data-[state=checked]:bg-yellow-600"
              />
            </motion.div>

            <motion.div
              className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Link className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <Label htmlFor="social" className="text-white font-medium">
                    Social Connections
                  </Label>
                  <p className="text-sm text-slate-400">Get notified about friend activities</p>
                </div>
              </div>
              <Switch id="social" className="data-[state=checked]:bg-yellow-600" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
