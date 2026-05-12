import { ArrowLeft, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface IBackNavProps {
  link: string,
  title: string
}

const BackNav: React.FC<IBackNavProps> = ({ link, title }) => {
  return (
      <Link  href={link} className="px- py-1 flex items-center mb-1">
        <button className="p-">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl text-white font-semibold">{title}</h1>
      </Link>
      
  )
}

export default BackNav
