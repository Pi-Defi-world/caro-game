"use client"

import Menu from "@/components/me/Menu";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfilePage from "@/components/me/UserPrivacy";
import { LoginDrawer } from "@/components/drawers/LoginDrawer";
import { UserProfileCard } from "@/components/me/Profile";

export default function HomePage() {
    const [open, setOpen] = useState(false);
    const { currentUser } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!currentUser) {
            setOpen(true);
        }
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Button
                    className="px-6 py-3 text-lg"
                    onClick={() => setOpen(true)}
                >
                    Get started
                </Button>
                <LoginDrawer
                    isDrawerOpen={open}
                    setIsDrawerOpen={setOpen}
                />
            </div>
        );
    }

    return (
        <div className="py-4">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <UserProfileCard user={currentUser} />
              <Menu />
            </div>
            <ProfilePage />
          </div>
        </div>
    );
}
