import { ICharacter } from '@/redux/slices/characters';
import { IPET } from '@/redux/slices/pets';
import React from 'react'

interface PetCharacterCardProps {
  pet:any,
  handleClick: (character: IPET) => void
}

const PetCharacterCard = ({ pet ,handleClick}: PetCharacterCardProps) => {
  return (
    <div className="bg-cyan-300 rounded-xl overflow-hidden shadow-lg relative min-h-[200px]">
      <div className='absolute top-1 left-1 rounded-md px-1 py-0.5 bg-gray-300 z-50'>
        <div className="text-[10px] text-black opacity-75 m-0 p-0">{pet?.remaining}/{pet?.quantity}</div>
      </div>
      
      {pet?.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${pet.image})` }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-smdd"></div>
        </div>
      )}

      <div className="relative px-2 py-1 flex flex-col items-center h-full">
        <div className="mt-auto w-full">
          { pet.multiplier && <div className="text-[10px] text-white opacity-75 m-0 p-0 z-50">{pet?.multiplier}x GPF points on win</div>}
          <button className="w-full bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg shadow-md border-b-4 border-yellow-700" onClick={()=>handleClick(pet)}>
            <div className="flex items-center text-black justify-center">
              <span className="text-xl font-extrabold">{pet?.price} π</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PetCharacterCard
