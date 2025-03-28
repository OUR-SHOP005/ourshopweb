'use client'

import Image from 'next/image'

export function Logo() {
  return (
    <div className="relative w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-white">
      <Image
        src="/logo.png"
        alt="OurShop Logo"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>
  )
} 