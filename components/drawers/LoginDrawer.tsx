"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { authenticateUser, setToken } from "@/redux/slices/auth";

interface ILoginDrawerProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginDrawer: React.FC<ILoginDrawerProps> = ({
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const dispatch = useAppDispatch();

  const handlePiauth = async () => {
    try {
        const res = await dispatch(authenticateUser()).unwrap();
        localStorage.setItem("token", res.token);
        dispatch(setToken(res.token));
        setIsDrawerOpen(false);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent className="fixed top-0 left-0 h-full w-full bg-[#0F1226]">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle className="text-lg font-bold text-white">
            Action Required
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close login drawer"
            >
              ✕
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <DrawerDescription className="mt-2 text-sm text-gray-500 p-4">
          You must authenticate your Pi account with GameFi to continue.
        </DrawerDescription>
        <DrawerFooter className="flex justify-end mt-6">
          <Button 
            className="ml-2 bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200"
            onClick={handlePiauth}
            aria-label="Authenticate with Pi"
          >
            Authenticate
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
