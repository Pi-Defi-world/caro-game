"use client"
import { useState } from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { INFT } from '@/redux/slices/characters'
import { Send, Sparkles } from 'lucide-react'

interface NftCardProps {
  nft: INFT
}

export function NftCard({ nft }: NftCardProps) {
  const dispatch = useAppDispatch()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[230px] w-full">
        <Image
          src={nft.character.image}
          alt={nft.name}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-300 filter hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100 glow-effect" />

        <div className="absolute bottom-0 left-0 right-0 p-1 flex items-center justify-between">
          <h3 className="text-white text-xl font-bold mb-0 text-shadow">{nft.name}</h3>
          <button 
  className={`p-2 rounded-full bg-red-500 text-gray-900 transition-all duration-300 transform 
    shadow-[0_4px_8px_rgba(0,0,0,0.2)] 
    hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)] 
    ${isHovered ? 'scale-110 rotate-12' : 'scale-100'} 
    hover:bg-yellow-400`}
>
  <Send size={15} className="text-white" />
</button>

        </div>
      </div>
      
  

      <style jsx>{`
        .glow-effect {
          box-shadow: 0 0 15px 2px rgba(255, 215, 0, 0.5);
        }
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  )
}

