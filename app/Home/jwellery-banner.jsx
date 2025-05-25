import Image from 'next/image'
import React from 'react'

function JwelleryBanner() {
    return (
        <div className="mt-12 relative w-full">
            <Image
                src="/banner.png"
                alt="Jewellery Banner"
                layout="responsive"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
            />
        </div>
    )
}

export default JwelleryBanner
