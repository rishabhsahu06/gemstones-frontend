import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

function Hero() {
    return (
        <div className='container mx-auto '>
            <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden mt-6 rounded-4xl">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/hero.png"
                        alt="Astrology workspace with gemstones"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight max-w-4xl mb-6">
                        Harness the Power of the Stars with Authentic Gemstones
                    </h1>

                    <p className="text-lg md:text-xl text-white max-w-2xl mb-10">
                        Authentic, astrologer-recommended gemstones to attract balance, success, and positive energy—aligned with your
                        stars.
                    </p>

                    <button className="bg-white text-gray-800 hover:bg-gray-100 transition-colors px-8 py-3 rounded-full flex items-center gap-2 font-medium">
                        Contact Us
                        <ChevronDown className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>

    );
}

export default Hero;
