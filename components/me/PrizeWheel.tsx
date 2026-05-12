"use client";

import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

  const data = [
    {
      option: "PET",
      style: { backgroundColor: "blue", textColor: "white" },
      // image: { 
      //   uri: "https://www.cryptotimes.io/wp-content/uploads/2024/08/Pi-Network-Unveils-Infographics-at-August-Art-Festival.jpg",
      //   offsetY:60
      //  },
    },
    {
      option: "Option 2",
      style: { backgroundColor: "yellow", textColor: "#000000" },
      // image: { uri: "https://i.seadn.io/s/raw/files/8b7d32580c14815c61ce1218f51a2fe8.png?auto=format&dpr=1&w=1000" },
    },
    {
      option: "Option 3",
      style: { backgroundColor: "yellow", textColor: "#000" },
      // image: { uri: "https://preview.redd.it/this-is-a-pi-nft-v0-0uz2qrog8ao81.jpg?width=640&crop=smart&auto=webp&s=638ca1e7c5c2b639830377c181b99a0ca917132c" },
    },
    {
      option: "Option 3",
      style: { backgroundColor: "yellow", textColor: "#000" },
      // image: { uri: "https://preview.redd.it/this-is-a-pi-nft-v0-0uz2qrog8ao81.jpg?width=640&crop=smart&auto=webp&s=638ca1e7c5c2b639830377c181b99a0ca917132c" },
    },
    {
      option: "Option 5",
      style: { backgroundColor: "yellow", textColor: "#000" },
      // image: { uri: "https://preview.redd.it/this-is-a-pi-nft-v0-0uz2qrog8ao81.jpg?width=640&crop=smart&auto=webp&s=638ca1e7c5c2b639830377c181b99a0ca917132c" },
    },
    {
      option: "Option 6",
      style: { backgroundColor: "yellow", textColor: "#000" },
      // image: { uri: "https://preview.redd.it/this-is-a-pi-nft-v0-0uz2qrog8ao81.jpg?width=640&crop=smart&auto=webp&s=638ca1e7c5c2b639830377c181b99a0ca917132c" },
    },
    {
      option: "Option 7",
      style: { backgroundColor: "yellow", textColor: "#000" },
      // image: { uri: "https://preview.redd.it/this-is-a-pi-nft-v0-0uz2qrog8ao81.jpg?width=640&crop=smart&auto=webp&s=638ca1e7c5c2b639830377c181b99a0ca917132c" },
    },
  ];

export default function RouletteWheel() {
  const [prizeNumber, setPrizeNumber] = useState(1); 
  const [mustSpin, setMustSpin] = useState(false);

  const handleSpinClick = () => {
    const randomPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(randomPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={["yellow"]}
        textColors={['#ffffff']}
        onStopSpinning={() => {
          setMustSpin(false)
          // alert(`You won: ${data[prizeNumber].option}`)
        }} 
      />
      <button
        onClick={handleSpinClick}
        // disabled={mustSpin}
        className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mustSpin ? 'Spinning...' : 'Spin the Wheel'}
      </button> 
    </div>
  );
}










