"use client"
 import { Gift, Trophy, MessageCircle, Users, Lock, Badge, Crown, Loader2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
 import React, { useEffect, useRef, useState } from "react";
 import { useAppDispatch, useAppSelector } from "@/redux/hooks";
 import { fetchVips, IVIP, purchaseVip } from "@/redux/slices/vip";
 import { updateBalance, updateVipLevel } from "@/redux/slices/auth";
 import { deposit } from "@/redux/slices/payment";
 import { motion } from 'framer-motion'
 import Link from 'next/link';
 import ShopHeader from '../ShopHeader';
 import LoaderBundle from '../characters/LoaderBundle';
 import { LoginDrawer } from '@/components/drawers/LoginDrawer';
 import { Button } from '@/components/ui/button';
import ShopBanner from '../ShopBanner';


 const iconMap: { [key: string]: React.ElementType } = {
  gift: Gift,
  trophy: Trophy,
  messageCircle: MessageCircle,
  users: Users,
  lock: Lock,
  badge: Badge,
  crown: Crown,
 };

 const getIcon = (iconName: string): React.ReactNode => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
 };

 function VipsComponent() {
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch();
  const vips = useAppSelector((state) => state.vips.vips);
  const isLoading = useAppSelector((state) => state.vips.isLoading);
  const isPurchasing = useAppSelector((state) => state.vips.isPurchasing);
  const error = useAppSelector((state) => state.vips.error);
  const { currentUser } = useAppSelector(state => state.auth)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [trackId,setTrackId] = useState(null)

  const scroll = (direction: 'left' | 'right') => {
   if (scrollContainerRef.current) {
    const scrollAmount = 300 
    const currentScroll = scrollContainerRef.current.scrollLeft
    const targetScroll = direction === 'left' 
     ? currentScroll - scrollAmount 
     : currentScroll + scrollAmount

    scrollContainerRef.current.scrollTo({
     left: targetScroll,
     behavior: 'smooth'
    })
   }
  }

  useEffect(() => {
   dispatch(fetchVips());
  }, [dispatch]);

  const handlePurchaseVip = (vip: IVIP) => {
   //@ts-ignore
   setTrackId(vip._id)
   if(currentUser?.balance && currentUser?.balance >= vip.price) {
    dispatch(purchaseVip(vip._id)).unwrap().then(() => {
     dispatch(updateVipLevel(vip))
     dispatch(updateBalance(-vip.price))
    })
   } else {
    dispatch(deposit({amount: vip.price, memo: "Vip Purchase", paymentMetadata: {
     vipId:vip._id,
    }}))
   }
  };

  if (error) return <div>Error: {error}</div>;

   if (isLoading) {
   return (
    <div className="min-h-screen">
     <main className="container mx-auto py-2">
      <ShopBanner title='Vip Tiers'/>
      <LoaderBundle/>
     </main>
    </div>
   )
  }

  return (
   <div className="relative py-2">
    <ShopBanner title='Vip Tiers'/>
    <div className="md:hidden text-center text-sm text-gray-500 mb-2">
     Swipe to see more VIP tiers →
    </div>
    <motion.div 
     className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 md:hidden"
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.9 }}
     onClick={() => scroll('left')}
    >
     <ChevronLeft className="w-8 h-8 text-white opacity-50 hover:opacity-100 cursor-pointer" />
    </motion.div>
    <motion.div 
     className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 md:hidden"
     whileHover={{ scale: 1.1 }}
     whileTap={{ scale: 0.9 }}
     onClick={() => scroll('right')}
    >
     <ChevronRight className="w-8 h-8 text-white opacity-50 hover:opacity-100 cursor-pointer" />
    </motion.div>
    <div 
     ref={scrollContainerRef}
     className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 gap-4 p-3"
    >
     {vips.map((vip) => (
      <div
       key={vip._id}
       className="relative flex flex-col flex-shrink-0 w-[300px] md:w-full max-w-md min-h-[400px] bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-2xl p-3 text-white snap-center"
      >
       <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <Crown className="w-8 h-8 text-yellow-400" />
       </div>
    
       <div className="text-center text-yellow-500 mt-4">
        <span className="text-3xl font-bold">{vip.price}</span>
        <span className="text-muted-foreground"> PI</span>
       </div>
       <div className="space-y-3 mt-6">
        {vip.benefits.map((feature: string, index: number) => (
         <Feature
          key={index}
          icon={<Gift />} 
          text={feature}
         />
        ))}
       </div>
       <div className="mt-auto pt-4">
        <Button
         disabled={currentUser?.vipLevel?.level === vip.level || isPurchasing}
         className={`w-full ${
          currentUser?.vipLevel?.level === vip.level
           ? "bg-gray-500"
           : currentUser?.vipLevel === null
           ? "bg-yellow-500 hover:from-purple-600 hover:to-blue-600"
           : "bg-yellow-500 hover:from-purple-600 hover:to-blue-600"
         }`}
         onClick={() => {
          if (currentUser) {
           handlePurchaseVip(vip)
          } else setOpen(true)
         }}
        >
         {isPurchasing && trackId === vip._id ? (
          <>
           Purchasing <Loader2 className="w-4 h-4 animate-spin ml-2" />
          </>
         ) : currentUser?.vipLevel?.level === vip.level ? (
          "Equipped"
         ) : currentUser?.vipLevel === null ? (
          "Purchase"
         ) : (
          vip.buttonText
         )}
        </Button>
       </div>
      </div>
     ))}
    </div>
    <LoginDrawer
     isDrawerOpen={open}
     setIsDrawerOpen={setOpen}
    />
   </div>
  );
 }

 const Feature = ({
  icon,
  text,
 }: {
  icon: React.ReactNode;
  text: string;
 }) => (
  <div className="flex items-center gap-3">
   <div className="flex-shrink-0 w-5 h-5">{icon}</div>
   <span className="text-sm">{text}</span>
  </div>
 );

 export default VipsComponent;
