"use client"

import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchCharacters, ICharacter } from '@/redux/slices/characters'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { CharacterDialog } from './character-dialog'
import LoaderBundle from './LoaderBundle'
import ShopBanner from '../ShopBanner'
import PetCharacterCard from '../pet-charcter-card'

export default function CharacterComponent() {
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isSmallScreen, setIsSmallScreen] = useState(false)

  const dispatch = useAppDispatch()
  const { isLoading, characters } = useAppSelector(state => state.characters)

  useEffect(() => {
    dispatch(fetchCharacters())
  }, [dispatch])

  useEffect(() => {
    const checkScreenSize = () => {
      // setIsSmallScreen(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleCharacterClick = (character: ICharacter) => {
    setSelectedCharacter(character)
    setIsModalOpen(true)
  }

  const handleNextCharacter = () => {
    const currentIndex = characters.findIndex(c => c._id === selectedCharacter?._id)
    const nextIndex = (currentIndex + 1) % characters.length
    setSelectedCharacter(characters[nextIndex])
  }


  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-2">
        <ShopBanner title='Character Shop'/>
        {isLoading ? (
          <LoaderBundle/>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[3fr,1fr]">
            <div className="bg-gray-900/500 backdrop-blur-sm rounded-xl">
              <ScrollArea className="">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {
                    characters.map(pet => <PetCharacterCard pet={pet} key={pet._id} handleClick={handleCharacterClick} />)
                  }
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
       
      </main>

      {selectedCharacter && <CharacterDialog
        character={selectedCharacter}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNext={handleNextCharacter}
      />}
    </div>
  )
}
