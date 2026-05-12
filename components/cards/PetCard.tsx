import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { activatePetNFTs, deactivatePetNft, IPetNFT } from '@/redux/slices/pets'
import { Crown, Droplet, Loader, Timer } from 'lucide-react'

// Types
interface PetCardProps {
  pet: IPetNFT
}

interface CountdownTimerProps {
  activationTime: string
  duration: number
  petId: string
}

// Constants
const ACTIVATION_DURATION = 3600000 // 1 hour in milliseconds

// Components
const CountdownTimer = ({ activationTime, duration, petId }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const calculateTimeLeft = () => {
      const activationDate = new Date(activationTime).getTime()
      const now = new Date().getTime()
      const endTime = activationDate + duration
      const difference = endTime - now
      return Math.max(0, difference)
    }

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (newTimeLeft === 0) {
        dispatch(deactivatePetNft(petId))
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [activationTime, duration, petId, dispatch])

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return (
    <span className="text-[10px]">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  )
}

export function PetCard({ pet }: PetCardProps) {
  const dispatch = useAppDispatch()
  const { myPets } = useAppSelector(state => state.pets)
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [trackId, setTrackId] = useState("")

  useEffect(() => {
    const activePet = myPets.find(p => p.mode === "active")
    setIsActive(!!activePet)
  }, [myPets])

  const handleTogglePetStatus = async (petId: string) => {
    setIsLoading(true)
    setTrackId(petId)
    try {
      await dispatch(activatePetNFTs(petId)).unwrap()
      setIsActive(true)
    } catch (error) {
      console.error('Failed to activate pet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonStyles = () => {
    if (pet.mode === "active") {
      return "bg-gray-300 text-gray-800 shadow-[0_4px_0_rgb(156,163,175)] hover:shadow-[0_2px_0_rgb(156,163,175)]"
    }
    if (isActive) {
      return "bg-gray-400 text-white shadow-[0_4px_0_rgb(107,114,128)] hover:shadow-[0_2px_0_rgb(107,114,128)]"
    }
    return "bg-yellow-400 text-white shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)]"
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      {/* Pet Image Section */}
      <div className="relative h-[150px] w-full">
        <Image
          src={pet.pet.image}
          alt={pet.name}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute top-1 right-1">
          <div className="flex items-center gap-1">
            <div className="bg-red-600 px-3 py-0.5 rounded-md">
              <span className="text-white text-xs font-bold">Lvl {pet.level}</span>
            </div>
            <div className="flex items-center gap-0 justify-center">
              <Droplet className="text-red-500" />
              <p className="text-white">{pet.activationCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pet Info Section */}
      <div className="p-2 flex-grow flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-0">{pet.name.split(" ")[1]}</h3>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={() => handleTogglePetStatus(pet._id)}
            className={`w-1/2 px-1 py-0.5 text-sm rounded-lg transition-all duration-150 ${getButtonStyles()} active:shadow-none active:translate-y-1 truncate`}
            disabled={pet.mode === "active" || isLoading || isActive}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 items-center justify-center animate-spin" />
            ) : pet.mode === "active" ? (
              <span className="flex items-center gap-1 justify-center">
                <Timer size={15} className="text-[10px]" />
                <CountdownTimer
                  activationTime={pet.activationTime!}
                  duration={ACTIVATION_DURATION}
                  petId={pet._id}
                />
              </span>
            ) : (
              <span className="flex items-center gap-1 justify-center truncate">
                Activate
              </span>
            )}
          </button>

          <button 
            className="
              w-1/2
              px-1 
              py-0.5 
              text-sm
              bg-orange-500 
              hover:bg-orange-600 
              text-white 
              font-semibold 
              rounded-lg 
              shadow-[0_4px_0_rgb(234,88,12)] 
              hover:shadow-[0_2px_0_rgb(234,88,12)]
              active:shadow-none
              active:translate-y-1
              transition-all 
              duration-150
              flex justify-center items-center
              relative
              truncate
            "
          >
            <span>Upgrade</span>
          </button>
        </div>
      </div>
    </div>
  )
}


