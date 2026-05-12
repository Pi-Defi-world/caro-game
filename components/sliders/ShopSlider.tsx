'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ShopSlider = ({ shops}:{shops:any}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shops.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [shops.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shops.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + shops.length) % shops.length)
  }

  return (
    <div className="relative w-full h-[15rem] overflow-hidden rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
     <div
       className={`absolute right-5 w-[230px] animate-bounc h-[230px] bg-[url('/wheel.png')] bg-cover bg-no-repeat opacity-10`}
     ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center p-2 w-full h-full flex flex-col justify-end items-center">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-3 text-white text-shadow-glow"
            >
              {shops[currentIndex].name}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-md mb-4 text-cyan-300 text-shadow max-w-2xl"
            >
              {shops[currentIndex].benefit}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center bg-black bg-opacity-50 px-4 py-1 rounded-full shadow-neon"
            >
              <span className="text-xl text-gray-300 mr-3">Price:</span>
              <span className="text-2xl font-bold text-yellow-400 glow">{shops[currentIndex].price}</span>
              <span className="text-2xl text-yellow-400 ml-1">PI</span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={prevSlide}
        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-neon"
        aria-label="Previous shop"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-neon"
        aria-label="Next shop"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  )
}

export default ShopSlider

