'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ShopSlider from '@/components/sliders/ShopSlider'

const shops = [
  {
    id: 1,
    name: "VIP SHOP",
    image: "/shop/vip.png",
    price: 10,
    benefit: "Access to win lucky VIP pet on wheel",
    route: "/shop/vips"
  },
  {
    id: 2,
    name: "PET SHOP",
    image: "/shop/pet.png",
    price: 20,
    benefit: "More GPF points when you win a match",
    route: "/shop/pets"
  },
  {
    id: 3,
    name: "CHARACTER",
    image: "/shop/character2.png",
    price: 30,
    benefit: "20% share of platform fee pool with all holders",
    route: "/shop/characters"
  }
];

export default function ShopsPage() {
  const [selectedShop, setSelectedShop] = useState(shops[0])
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleShopClick = (shop:any) => {
    setSelectedShop(shop)
    router.push(shop.route)
  }

  return (
    <div className="min-h-screen  text-white">
      <main className="container mx-auto">     
        <ShopSlider shops={shops} />
        
        <div className="mt-3">
          <h2 className="text-2xl font-semibold mb-4">Available Shops</h2>
          <ScrollArea className="">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 px-1">
              {shops.map((shop) => (
                <motion.button
                  key={shop.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShopClick(shop)}
                  className={cn(
                    "group relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
                    selectedShop.id === shop.id
                      ? "border-primary ring-primary ring-offset-2 ring-offset-gray-900"
                      : "border-gray-700 hover:border-gray-600"
                  )}
                >
                  <div className='absolute top-2 left-2 rounded-md px-2 py-1 bg-gray-800 bg-opacity-80'>
                  </div>
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-yellow-400">{shop.name}</h3>
                      <p className="mt-2 text-[11px]">{shop.benefit}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  )
}

