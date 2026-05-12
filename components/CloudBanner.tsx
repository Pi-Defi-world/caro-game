import React from 'react'

const CloudBanner = ({ message }: { message: "win" | "loss" | "draw" | null }) => (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-full max-w-[280px] z-10">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-yellow-300 to-yellow-600">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600" />
        </div>

        <div className="relative mt-8">

            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8">
                <div className="absolute inset-0 border-t-[3px] border-l-[3px] border-white rounded-tl-full shadow-lg transform -rotate-45" />
                <div className="absolute inset-0 border-t-[3px] border-l-[3px] border-white/50 rounded-tl-full blur-sm transform -rotate-45" />
            </div>

            <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8">
                <div className="absolute inset-0 border-t-[3px] border-r-[3px] border-white rounded-tr-full shadow-lg transform rotate-45" />
                <div className="absolute inset-0 border-t-[3px] border-r-[3px] border-white/50 rounded-tr-full blur-sm transform rotate-45" />
            </div>

            <div className="relative bg-gradient-to-b from-white to-white/95 px-8 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-white">
                <p
                    className="text-xl text-center font-bold text-blue-600 font-serif"
                    style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
                >
                    {
                        message === "win"
                            ? "You win"
                            : message === "loss"
                                ? "You lose"
                                : "It's a draw"
                    }
                </p>
            </div>
        </div>
    </div>
)

export default CloudBanner