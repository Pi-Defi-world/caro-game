    "use client";
    import React, { useState } from "react";
    import Link from "next/link";
    import { ChevronLeft, Menu } from 'lucide-react';
    import { Button } from "@/components/ui/button";
    import { useAppSelector } from "@/redux/hooks";
import { LoginDrawer } from "@/components/drawers/LoginDrawer";
import { UserProfile } from "@/components/common/UserProfile";
import { UserBalance } from "@/components/common/UserBalance";
    // import { HeaderSlider } from "../reusable/HeaderSlider";

    interface HeaderProps {
     isSidebarOpen: boolean;
     setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }

    export default function CaroHeader({ setIsSidebarOpen }: HeaderProps) {
     const { currentUser } = useAppSelector((state) => state.auth);
     const [isLogin, setIsLogin] = useState(false);

     return (
        <>
       <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-white/10 bg-slate-950 px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4">
         <Button
          variant="ghost"
          size="icon"
          className="text-white/70 md:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
         >
          <Menu className="h-5 w-5" />
         </Button>
         <Button
          variant="ghost"
          size="icon"
          className="hidden text-white/70 md:inline-flex"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
         >
          <ChevronLeft className="h-5 w-5" />
         </Button>
         <Link href="/" className="flex items-center gap-2">
          <span className="hidden md:block text-sm sm:text-xl font-bold text-[#F7931A]">
           GAMEFI
          </span>
         </Link>
        </div>
        {currentUser ? (
         <>
          {/* <HeaderSlider/> */}
          <div className="flex">
           
          </div>
          <UserBalance/>
          <UserProfile/> 
         </>
        ) : (
         <Button
          variant="outline"
          aria-hidden="false"
          className="rounded-md bg-[#090C1D] text-[#E41E3F] text-xs sm:text-sm"
          onClick={() => setIsLogin(true)}
         >
          Get Started
         </Button>
        )}
       </header>

       <LoginDrawer
        isDrawerOpen={isLogin}
        setIsDrawerOpen={setIsLogin}
       />
      </>
     );
    }
