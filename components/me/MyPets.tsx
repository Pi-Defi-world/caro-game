import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchMyPetsNFTs } from '@/redux/slices/pets'
import React, { useEffect, useState } from 'react'
import LoaderBundle from '../skeleton/LoaderBundle'
import { PetCard } from '../cards/PetCard'
import { PetCarousel } from '../crousels/PetCrousel'

const RenderMyPets = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const { myPets } = useAppSelector(state => state.pets)
    
    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true)
            try {
                await dispatch(fetchMyPetsNFTs()).unwrap()
            } catch (error) {
                console.error('Failed to fetch pets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPets()
    }, [dispatch])

    if (loading) {
        return (
            <LoaderBundle/>
        )
    }

    if (myPets.length === 0) {
        return <div className="text-center text-gray-500">You don&apos;t have any pets yet.</div>
    }

    return (
        <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2">
                {myPets.map(pet => (
                    <PetCard key={pet._id} pet={pet} />
                ))}
            </div>
        </div>
    )
}

export default RenderMyPets
