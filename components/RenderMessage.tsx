import { useAppSelector } from "@/redux/hooks"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import { Crown, Sparkles, DogIcon as Pet } from 'lucide-react'
import { useRef, useEffect, useState } from "react"

const RenderMessage = ({ message, gfp,prize }: { message: "win" | "loss" | "draw" | null; gfp: number,prize:number }) => {
    const expRef = useRef<HTMLParagraphElement>(null)
    const piRef = useRef<HTMLParagraphElement>(null)
    const { currentRoom } = useAppSelector(state => state.rooms)
    const { myPets } = useAppSelector(state => state.pets)
    const [showDoubledGfp, setShowDoubledGfp] = useState(false)
    const [isActive,setIsActive] = useState(false)

    const finalGfp = isActive ? gfp * 2 : gfp

    const gfpCount = useMotionValue(gfp)
    const roundedGfp = useTransform(gfpCount, latest => Math.round(latest * 100) / 100)

    useEffect(() => {
        const activePet = myPets.find((p) => p.mode === "active")
        setIsActive(!!activePet)
      }, [myPets])

    useEffect(() => {
        if (message === "win" && isActive) {
            setTimeout(() => {
                setShowDoubledGfp(true)
                animate(gfpCount, finalGfp, {
                    duration: 2,
                    ease: "easeOut",
                })
            }, 2000)
        }
    }, [message, isActive, gfp, finalGfp])

    const petBoostAnimation = {
        hidden: { opacity: 0, scale: 0 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                type: "spring",
                stiffness: 260,
                damping: 20,
            }
        }
    }

    switch (message) {
        case "win":
            return (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="reward-item text-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        <motion.p
                            className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: 1,
                                repeatDelay: 1
                            }}
                        >
                            Spectacular!
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="reward-item relative"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                    >
                        <p
                            ref={piRef} 
                            className="text-center text-3xl font-bold text-primary"
                        >
                            +{prize.toFixed(2)} Pi
                        </p>
                        <motion.span
                            className="absolute -right-4 -top-2"
                            animate={{
                                y: [-10, 0, -10],
                                rotate: [0, 10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles className="text-yellow-400" />
                        </motion.span>
                    </motion.div>

                    {/* <motion.div
                        className="reward-item"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                    >
                        <motion.div
                            ref={expRef}
                            className="text-center flex justify-center items-center gap-0 text-2xl font-semibold text-success"
                        >
                            +<motion.span>{roundedGfp}</motion.span> 
                            <img src="/coin.png" className="w-[50px] h-[50px] -translate-x-5"/> 
                            <span className="-translatec-x-4 ml-1"> GFP Token</span> 
                        </motion.div>
                    </motion.div> */}

                    {/* <AnimatePresence>
                        {isActive && showDoubledGfp && (
                            <motion.div
                                className="pet-boost text-center"
                                variants={petBoostAnimation}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <motion.p
                                    className="text-xl font-semibold text-purple-500"
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [1, 0.7, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Pet className="inline-block mr-2" />
                                    Pet Boost: 2x GFP!
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence> */}
                </motion.div>
            )
        case "loss":
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                >
                    <p className="text-center text-red-500 text-2xl font-bold mb-4">
                        Game Over
                    </p>
                    <motion.p
                        className="text-center text-muted-foreground"
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 1, repeat: Infinity, }} > Try Again!
                    </motion.p>
                    {/* <AnimatePresence>
                        {!isActive && (
                            <motion.div
                                className="pet-encouragement"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.p
                                    className="text-center text-purple-500 font-semibold"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Pet className="inline-block mr-2" />
                                    Activate your pet to increase your chances of winning!
                                </motion.p>
                                <motion.p
                                    className="text-center text-green-500 font-semibold mt-2"
                                    animate={{
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    Double your GFP rewards when you win!
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence> */}
                </motion.div>
            )
        case "draw":
            return (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <motion.p
                        className="text-center text-muted-foreground text-2xl font-bold"
                    >
                        Game Over. It was a Draw!
                    </motion.p>
                    {!isActive && (
                        <motion.p
                            className="text-center text-purple-500 font-semibold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Pet className="inline-block mr-2" />
                            Activate your pet for better odds next time!
                        </motion.p>
                    )}
                </motion.div>
            )
        default:
            return null
    }
}

export default RenderMessage

