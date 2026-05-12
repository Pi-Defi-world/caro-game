import React from 'react'

const LoaderBundle = () => {
  return (
    <div className="grid gap-8 ">
      <div className="bg-gray-900/500 backdrop-blur-sm rounded-xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-gray-800 animate-pulse"/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoaderBundle