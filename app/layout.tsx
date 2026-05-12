"use client"
 import "./globals.css";
 import { useEffect, useState } from "react";
 import { usePathname } from "next/navigation";
 import { Provider } from "react-redux";
 import store from "@/redux/store";
 import { AppWrapper } from "@/components/hoc/AppWrapper";
 import Sidebar from "@/components/common/Sidebar";
 import { cn } from "@/lib/utils";
 import Footer from "@/components/common/Footer";
 import BottomNavigation from "@/components/common/BottomNavigation";
 import Header from "@/components/common/Header";



 export default function RootLayout({
  children,
 }: Readonly<{
  children: React.ReactNode;
 }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
   const handleResize = () => {
    setIsSidebarOpen(window.innerWidth >= 768);
   };

   handleResize();
   window.addEventListener("resize", handleResize);

   return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const pathname = usePathname();
  const showHeaderAndFooter = !(pathname.startsWith("/games/caro/") && pathname !== "/games/caro");
  const showFooter = pathname === "/";

  return (
   <html lang="en">
    <head>
     <meta charSet="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <meta name="title" content="Pi Games - Decentralized Multiplayer Gaming Platform" />
     <meta name="description" content="Pi Games is a decentralized multiplayer gaming platform built on the Pi Network blockchain. Play real-time games, compete in groups, and win Pi coin prizes. Join the gaming revolution today!" />
     
     <meta property="og:type" content="website" />
     <meta property="og:title" content="Pi Games - Decentralized Multiplayer Gaming Platform" />
     <meta property="og:description" content="Experience real-time multiplayer gaming on Pi Games, powered by the Pi Network blockchain. Bet Pi coins, play with friends, and win big prizes in a decentralized gaming ecosystem." />
     <meta property="og:image" content="https://pi-games.vercel.app/logo.png" />
     <meta property="og:url" content="https://pi-games.vercel.app" /> 
     <meta property="og:site_name" content="Pi Games" />


     <meta name="twitter:card" content="summary_large_image" />
     <meta name="twitter:title" content="Pi Games - Decentralized Multiplayer Gaming Platform" />
     <meta name="twitter:description" content="Discover Pi Games, the decentralized platform for real-time multiplayer gaming on the Pi Network blockchain. Play, compete, and win Pi coin prizes." />
     <meta name="twitter:image" content="/logo.png" /> 
     <meta name="twitter:site" content="@soleil005" /> 

     <link rel="icon" type="image/x-icon" href="/favicon.ico" />
     <link rel="image_src" href="/logo.png" /> 

     <meta name="robots" content="index, follow" />
     <link rel="canonical" href="https://pi-games.vercel.app/" /> 

    
     <meta name="keywords" content="Pi Games,GameFi, GFP, decentralized gaming, multiplayer games,PCM,Pichainmall, Pi Chain Mall, real-time gaming, Pi Network, blockchain gaming, win Pi coins, play to earn, gaming platform, decentralized multiplayer platform" />

     <meta name="author" content="PI Games" /> 

     <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
     <meta name="theme-color" content="#0F1226" /> 

     <title>Pi Games - Decentralized Multiplayer Gaming Platform</title>
     <meta httpEquiv="pragram" content="no-cache" />
     <meta
      httpEquiv="cache-control"
      content="no-cache, no-store, must-revalidate"
     />
     <script>
      {`var coverSupport = 'CSS' in window && typeof CSS.supports === 'function' && 
      (CSS.supports('top: env(a)') || CSS.supports('top: constant(a)'));
      document.write('<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' + 
      (coverSupport ? ', viewport-fit=cover' : '') + '" />');`}
     </script>
    
    </head>
    <body
     className={`antialiased min-h-screen bg-[#0F1226]`}
    >
     <Provider store={store}>
       <AppWrapper>
        {showHeaderAndFooter && (
         <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
         />
        )}

        {showHeaderAndFooter && (
         <Sidebar
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
         />
        )}

        <main
         className={cn(
          "min-h-screen max-w-[1600px] mx-auto transition-all duration-200",
          isSidebarOpen && showHeaderAndFooter ? "md:pl-64" : "pl-0",
          showHeaderAndFooter ? "pt-16" : "pt-0",
          "flex flex-col"
         )}
        >
         <div className="flex-1 px-4">
          {children}
         </div>
         {showFooter && <Footer />}
        </main>

        {showHeaderAndFooter && (
         <BottomNavigation setIsSidebarOpen={setIsSidebarOpen} />
        )}
        
       </AppWrapper>

      
     </Provider>
    </body>
   </html>
  );
 }
