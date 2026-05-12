import { cn } from "@/lib/utils";
import React from "react";
import { Cat, Crown, Flame, Gamepad2, PlayIcon, Share2, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart } from "@phosphor-icons/react";

const casinoItems = [
  { name: "Favorites", icon: Star, target: "/games" },
  { name: "Popular", icon: Flame, target: "/games" },
  { name: "New Games", icon: Sparkles, target: "/games" },
] as const;

const shopItems = [
  { name: "Vip Shop", icon: Crown, target: "/shop/vips" },
  { name: "Character Shop", icon: PlayIcon, target: "/shop/characters" },
  { name: "Pet shop", icon: Cat, target: "/shop/pets" },
] as const;

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 overflow-y-scroll z-40 h-screen w-64 transform border-white/10 bg-slate-950 pt-16 transition-transform duration-200",
        !isSidebarOpen && "-translate-x-full"
      )}
    >
      <nav className="flex h-full flex-col p-4 gap-2">
        <Accordion type="multiple" defaultValue={["item-1"]} className="bg-[#0F1226] rounded-md">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="flex bg-[#0F1226] w-full items-center justify-between rounded-lg p-2 text-lg font-medium text-white hover:bg-white/5 [&[data-state=open]]:no-underline">
              <div className="flex items-center px-2">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Games
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {casinoItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.target}
                  onClick={handleLinkClick}
                  className="flex items-center rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* <Accordion type="multiple" defaultValue={["item-1"]} className="bg-[#0F1226] rounded-md">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="flex bg-[#0F1226] w-full items-center justify-between rounded-lg p-2 text-lg font-medium text-white hover:bg-white/5 [&[data-state=open]]:no-underline">
              <div className="flex items-center px-2">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shop
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {shopItems.map((item) => (
                <Link
                  key={item.name}
                  onClick={handleLinkClick}
                  href={item.target}
                  className="flex items-center rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}

        <div className="space-y-1">
          {[{ name: "Refer & Earn", icon: Share2, link: "/invite" }].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={handleLinkClick}
              className="flex items-center rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
