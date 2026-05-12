'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchPets, IPET } from '@/redux/slices/pets'
import { PetModal } from './pet-dialog'
import ShopHeader from '../ShopHeader'
import LoaderBundle from '../characters/LoaderBundle'
import { X } from 'lucide-react'
import ShopBanner from '../ShopBanner'
import PetCharacterCard from '../pet-charcter-card'

export default function PetComponent() {
  const [selectedPet, setSelectedPet] = useState<IPET | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  
  const dispatch = useAppDispatch()
  const {pets, isLoading} = useAppSelector(state => state.pets)
  
  useEffect(()=>{
    dispatch(fetchPets())
  },[dispatch])

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0]);
    }
  }, [pets, selectedPet]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024) 
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleCharacterClick = (character:IPET) => {
    setSelectedPet(character)
    setIsModalOpen(true)
  }

  const handleNextCharacter = () => {
    if (selectedPet) {
      const currentIndex = pets.findIndex(c => c._id === selectedPet._id)
      const nextIndex = (currentIndex + 1) % pets.length
      setSelectedPet(pets[nextIndex])
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-2">
        <ShopBanner title='Pet Shop'/>
       
        {isLoading ? (
          <LoaderBundle/>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[3fr,1fr]">
            <div className="bg-gray-900/500 backdrop-blur-sm rounded-xl">
              <ScrollArea className="">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {
                    pets.map(pet => <PetCharacterCard pet={pet} key={pet._id} handleClick={handleCharacterClick} />)
                  }
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
       
      </main>

      {selectedPet && <PetModal
        pet={selectedPet}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={handleNextCharacter}
      />}
    </div>
  )
}
