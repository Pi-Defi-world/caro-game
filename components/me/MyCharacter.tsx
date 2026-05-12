import React, { useEffect, useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useAppDispatch } from '@/redux/hooks'
import { fetchMyCharactersNFTs } from '@/redux/slices/characters'
import LoaderBundle from '../skeleton/LoaderBundle'
import { NftCard } from '../cards/NftCard'

const RenderMyCharacter = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const { myNfts } = useAppSelector(state => state.characters)
    
    useEffect(() => {
        setLoading(true)
        dispatch(fetchMyCharactersNFTs()).unwrap()
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [dispatch])

    return (
        <>
            {loading ? (
                <LoaderBundle />
            ) : myNfts.length === 0 ? (
                <div className="text-center text-gray-500">
                    You don&apos;t have any NFT yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-col-4 xl:grid-col-5 gap-2">
                    {myNfts.map(nft => (
                        <NftCard key={nft._id} nft={nft} />
                    ))}
                </div>
            )}
        </>
    )
}

export default RenderMyCharacter
