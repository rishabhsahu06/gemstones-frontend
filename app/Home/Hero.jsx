"use client";

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

function Hero() {
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        {
            src: "/hero.png",
            alt: "Astrology workspace with gemstones"
        },
        {
            src: "/hero2.png",
            alt: "Astrology workspace with gemstones"
        },
        {
            src: "/hero3.png",
            alt: "Astrology workspace with gemstones"
        }
    ];

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='container mx-auto'>
            <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden mt-6 rounded-2xl">
                {/* Background Images with Animation */}
                <div className="absolute inset-0">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={index === 0}
                                className="object-cover transform transition-transform duration-[7000ms] ease-out hover:scale-105"
                            />
                        </div>
                    ))}
                </div>

                {/* Enhanced Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>

                {/* Content Container with subtle animations */}
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-8 lg:px-16">
                    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl font-serif text-white leading-tight max-w-4xl mb-6 animate-fade-in-up">
                        Harness the Power of the Stars with Authentic Gemstones
                    </h1>

                    <p className="text-lg font-bold md:text-xl text-white max-w-2xl mb-10 animate-fade-in-up animation-delay-200">
                        Authentic, astrologer-recommended gemstones to attract balance, success, and positive energy—aligned with your
                        stars.
                    </p>

                    <button className="bg-white  text-gray-800 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 px-8 py-3 rounded-full flex items-center gap-2 font-medium animate-fade-in-up animation-delay-400 hover:-translate-y-1">
                        Contact Us
                        <ChevronDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
                    </button>
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImage
                                ? 'bg-white shadow-lg'
                                : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Navigation Arrows (Optional) */}
                <button
                    onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                    aria-label="Previous image"
                >
                    <ChevronDown className="h-6 w-6 text-white rotate-90" />
                </button>

                <button
                    onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                    aria-label="Next image"
                >
                    <ChevronDown className="h-6 w-6 text-white -rotate-90" />
                </button>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }

                .group:hover .group-hover\\:opacity-100 {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

export default Hero;