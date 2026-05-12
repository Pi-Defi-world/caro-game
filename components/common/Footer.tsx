"use client";

import Link from "next/link";
import { Instagram, Twitch, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F1226] text-white/70 py-6 px-4">
      <div className="max-w-full mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Explore</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/games" className="hover:text-white transition-colors">
                Games
              </Link>
            </li>
            <li>
              <Link href="/games/caro" className="hover:text-white transition-colors">
                Multiplayer
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Community
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Leaderboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Support</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Policies</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Responsible Play
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Connect</h3>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-white">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="hover:text-white">
              <Twitch className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-white/10 pt-4">
        <p className="text-xs text-white/50">
          © 2025 PiGame. Built on the Pi Blockchain. Play responsibly. <span className="font-medium">18+ only.</span>
        </p>
      </div>
    </footer>
  );
}
