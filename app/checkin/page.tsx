"use client"
import dynamic from "next/dynamic";
const DynamicCheckin = dynamic(() => import("@/components/me/Checkin"), { ssr: false });

export default function CheckinPage() {
  return (
    <DynamicCheckin />
  );
}
