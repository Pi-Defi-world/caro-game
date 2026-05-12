"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface IBoard {
  boardState: Record<string, string>
  handleMove: (row: number, col: number) => void
  viewport: { startRow: number; startCol: number; rows: number; cols: number }
  isDisabled?: boolean
  className?: string
}

const Board: React.FC<IBoard> = ({ boardState, handleMove, viewport, isDisabled = false, className }) => {
  const boardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const columns = viewport.cols
  const rows = viewport.rows
  const cells = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: columns }, (_, j) => {
      const r = viewport.startRow + i
      const c = viewport.startCol + j
      return `${r}:${c}`
    }),
  )

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const update = () => setContainerWidth(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (boardRef.current) {
      gsap.from(boardRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
    }
  }, [])

  const handleCellClick = (cell: string, event: React.MouseEvent<HTMLDivElement>) => {
    // Don't allow moves when disabled (paused)
    if (isDisabled) return

    const target = event.currentTarget

    // Only animate if the cell is empty
    if ((boardState[cell] ?? " ") === " ") {
      // Ripple effect
      gsap.to(target, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })

      const [rowStr, colStr] = cell.split(":")
      handleMove(Number(rowStr), Number(colStr))
    } else {
      // Cell is occupied, show feedback
      gsap.to(target, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      })
    }
  }

  const renderSymbol = (symbol: string) => {
    if (symbol === " ") return null

    if (symbol === "X") {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-red-500 font-bold text-2xl lg:text-3xl">✕</div>
        </div>
      )
    }

    if (symbol === "O") {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-3 border-blue-500"></div>
        </div>
      )
    }

    return null
  }

  const getCellSize = () => {
    const width = containerWidth || (typeof window === "undefined" ? 480 : (isMobile ? 320 : (window.innerWidth < 1024 ? 400 : 672)))
    const size = Math.floor(width / columns)
    return Math.max(14, Math.min(size, 48))
  }

  return (
    <div ref={containerRef} className="flex items-center justify-center p-2 lg:p-4 w-full max-w-2xl z-[9999]">
      <div className="relative z-[9998] w-full">
        <div ref={boardRef} className="relative p-0 z-[9999] w-full">
          <div
            className={cn("relative grid w-full z-[10000]")}
            style={{ gridTemplateColumns: `repeat(${columns}, ${getCellSize()}px)`, gap: 0 }}
          >
            {cells.flat().map((cell) => {
              const symbol = boardState[cell] ?? " "
              const isEmpty = symbol === " "

              return (
                <div
                  key={cell}
                  className={cn(
                    "relative flex items-center justify-center transition-all duration-200 z-[10001]",
                    isEmpty
                      ? isDisabled
                        ? "bg-white border border-gray-200 cursor-pointer"
                        : "bg-white border border-gray-200 cursor-pointer"
                      : "bg-gray-50 border border-gray-300",
                  )}
                  onClick={isDisabled ? undefined : (e) => handleCellClick(cell, e)}
                  style={{ width: `${getCellSize()}px`, height: `${getCellSize()}px` }}
                >
                  {/* Symbol container */}
                  <div className="relative z-[10002] w-full h-full">{renderSymbol(symbol)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board
