import FAQ from '@/app/Home/faq'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BookCall() {
    return (
        <div className='container mx-auto  lg:py-16'>
            <div className='flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mt-12'>
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
                    <h2 className='text-xl md:text-2xl font-semibold text-black leading-tight'>
                        Book Consultation Online Call
                    </h2>

                    <p className='text-[#4F4F4F] text-base md:text-lg leading-relaxed'>
                        Gain valuable insights into your life, career, relationships, and more through a personalized one-on-one session with a trusted astrologer. During this consultation, you'll receive guidance tailored specifically to your birth chart, helping you navigate important decisions and better understand your path. Simply choose your preferred date and time, and take the first step toward clarity and self-discovery.
                    </p>

                    <div className='pt-4  flex justify-center md:justify-start'>
                        <Link href="/book-call/book-form" className='w-full md:w-auto'>
                        <Button
                            className='bg-primary cursor-pointer  text-white font-semibold text-base py-3 px-8 md:py-6 md:px-12 rounded-lg  duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform'
                            aria-label="Book consultation call"
                        >
                            BOOK CALL
                        </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <FAQ />
        </div>
    )
}

export default BookCall