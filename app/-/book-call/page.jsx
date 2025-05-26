import Image from 'next/image'
import React from 'react'

function BookCall() {
    return (
        <div className='container mx-auto px-4 py-8 lg:py-16'>
            <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12'>
                {/* Left side - Image */}
                <div className='w-full lg:w-1/2'>
                    <div className='relative rounded-2xl overflow-hidden shadow-2xl'>
                        <Image
                            src="/book-call-img.png"
                            alt="Astrological consultation - Zodiac wheel with cosmic background"
                            width={600}
                            height={400}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Right side - Content */}
                <div className='w-full lg:w-1/2 space-y-6'>
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight'>
                        Book Consultation Online Call
                    </h2>

                    <p className='text-gray-600 text-base md:text-lg leading-relaxed'>
                        Gain valuable insights into your life, career, relationships, and more through a personalized one-on-one session with a trusted astrologer. During this consultation, you'll receive guidance tailored specifically to your birth chart, helping you navigate important decisions and better understand your path. Simply choose your preferred date and time, and take the first step toward clarity and self-discovery.
                    </p>

                    <div className='pt-4'>
                        <button
                            className='bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform'
                            aria-label="Book consultation call"
                        >
                            BOOK CALL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookCall