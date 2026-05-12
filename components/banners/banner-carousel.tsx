"use client"

import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import PlatformCategoriesBanner from "./PlatformCategoriesBanner"
import ChallengeFriendBanner from "./challenge-friend-banner"
import TournamentBanner from "./tournment-banner"

export default function AutoCarousel() {
  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  
  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    const interval = setInterval(() => {
      if (api) {
        api.scrollNext()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [api])

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index)
    }
  }

  return (
    <div className="w-full mt-2">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent className="h-[160px]">
          <CarouselItem className=" h-full">
            <PlatformCategoriesBanner />
          </CarouselItem>
          <CarouselItem className=" h-full">
            <ChallengeFriendBanner />
          </CarouselItem>
          <CarouselItem className=" h-full">
            <TournamentBanner />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300 ease-in-out",
              current === index ? "bg-primary scale-110 shadow-sm" : "bg-gray-200 hover:bg-gray-300",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
