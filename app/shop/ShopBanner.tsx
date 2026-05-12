import { ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface ShopBannerProps {
  title: string;
  redirect?: string;
}

const ShopBanner = ({ title, redirect = "/shop" }: ShopBannerProps) => {
  return (
    <div className="relative flex justify-center my-3">
      <Link href={redirect} className="absolute flex justify-center items-center text-center left-0 w-[30%] h-9 bg-yellow-500 -skew-x-[20deg] transform -translate-y-1/4">
          
          <div className='flex items-center justify-center skew-x-[20deg] -translate-x-3'>
            <ArrowLeft className='w-5 h-5'/>
            <span>Back</span>
          </div>
      </Link>
      <div className="z-10 bg-yellow-400 px-5 text-center py-1.5 w-[50%] rounded-lg shadow-lg">
        <h1 className="text-x font-bold text-black tracking-wider uppercase">{title}</h1>
      </div>
      <div className="absolute right-0 w-[30%] h-9 bg-yellow-500 skew-x-[20deg] transform -translate-y-1/4"></div>

      {/* Close button */}
      {/* <button className="absolute left-0 top-0 bg-blue-300 p-2 rounded-lg">
        <ArrowLeft className="w-5 h-5 -top-1 text-blue-100" />
      </button> */}
    </div>
  )
}

export default ShopBanner;