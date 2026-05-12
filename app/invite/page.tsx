"use client"
import { LoginDrawer } from "@/components/drawers/LoginDrawer";
import Invitation from "@/components/referral/Invitation";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import ShopBanner from "../shop/ShopBanner";

export default function InvitePage() {
 const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
 const { currentUser } = useAppSelector(state => state.auth);
 
 useEffect(() => {
  if (!currentUser) {
   setIsLoginDrawerOpen(true);
  }
 }, [currentUser]);

 if (!currentUser) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-[#0F1226]">
    <Button
     className="px-6 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
     onClick={() => setIsLoginDrawerOpen(true)}
    >
     Get Started
    </Button>
    <LoginDrawer
     isDrawerOpen={isLoginDrawerOpen}
     setIsDrawerOpen={setIsLoginDrawerOpen}
    />
   </div>
  );
 }

 return (
  <div className="bg-[#0F1226] min-h-screen">
   <ShopBanner title="Invitations" redirect="/me" />
   <Invitation />
  </div>
 );
}
