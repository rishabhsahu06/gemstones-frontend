import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function JewelleryBanner() {
    return (
        <div className="relative w-full md:h-[400px] h-[150px] mt-24  overflow-hidden">
            {/* Background banner image */}
            <Image
                src="/banner.png"
                alt="jewellery-banner"
                fill
                className="object-cover"
                priority
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>

            {/* Text content */}
            <div className="absolute z-20 top-1/2 transform -translate-y-1/2 w-full px-4 
                text-center md:text-right md:right-16 md:w-auto md:px-0 md:left-auto 
                left-1/2 md:translate-x-0 -translate-x-1/2">

                <h1 className="md:text-[30px] text-[22px] font-light text-white  tracking-wider">
                    Gemstone Jewellery
                </h1>

                {/* CTA Button */}

                <Button asChild className="mt-4 px-8 py-3 bg-[#BA8E49] text-white font-medium tracking-wider rounded-sm 
        transition-all duration-300 shadow-lg 
        hover:shadow-xl transform hover:scale-105">
                    <Link href="/gemstones-jewellery">
                        EXPLORE
                    </Link>
                </Button>

            </div>
        </div>
    )
}

export default JewelleryBanner
