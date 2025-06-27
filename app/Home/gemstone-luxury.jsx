"use client"

import { useState } from "react";
import Image from "next/image";

// Individual Jewelry Item Component with loading state
function JewelryItem({ item, className }) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={`rounded-2xl overflow-hidden shadow-2xl ${className}`}>
            <div className="relative">
                {/* Skeleton */}
                {isLoading && (
                    <div className={`bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 animate-pulse ${item.isLarge ? 'h-96' : 'h-44'
                        }`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                )}

                {/* Actual Image */}
                <div className={`relative transition-opacity duration-500 ${isLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'
                    } ${item.isLarge ? 'h-96' : 'h-44'}`}>
                    <Image
                        src={hasError ? "/placeholder.svg" : item.image}
                        alt={item.title}
                        fill
                        className={`object-cover hover:scale-105 transition-transform duration-500 ${item.position === 'left' || item.position === 'right' ? 'rounded-xl' : ''
                            }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        priority={item.isLarge} // Prioritize large images
                    />
                </div>
            </div>

            {/* Title with skeleton */}
            <div className="p-4 text-center bg-white">
                {isLoading ? (
                    <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
                ) : (
                    <h2 className="text-xl font-medium transition-opacity duration-300">
                        {item.title}
                    </h2>
                )}
            </div>
        </div>
    );
}

export default function LuxuryGemstones() {
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    // Images with their labels and paths
    const jewelryItems = [
        {
            id: "pendants",
            title: "Gemstone Pendants",
            image: "/pendant.png",
            isLarge: true,
            position: "left"
        },
        {
            id: "bracelet",
            title: "Gemstone Bracelet",
            image: "/bracelet.png",
            isLarge: false,
            position: "middle-top"
        },
        {
            id: "earrings",
            title: "Earrings",
            image: "/earring.png",
            isLarge: false,
            position: "middle-bottom"
        },
        {
            id: "rings",
            title: "Emerald Rings",
            image: "/ring.png",
            isLarge: true,
            position: "right"
        }
    ];

    return (
        <div className="container mx-auto px-4 mb-4">
            {/* Header Section */}
            <div className="text-center mb-10 mt-12">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-16">
                    The Art of Gemstone Luxury
                </h1>
                <p className="text-[16px] md:text-[20px] font-helvatica text-center text-[#4F4F4F] mb-10">
                    Elevate your style with the unmatched allure of fine gemstones.
                </p>
            </div>

            {/* Jewelry Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Pendants */}
                <JewelryItem
                    item={jewelryItems[0]}
                    className="p-2"
                />

                {/* Middle Column - Bracelet & Earrings */}
                <div className="flex flex-col space-y-6">
                    {/* Bracelet */}
                    <JewelryItem
                        item={jewelryItems[1]}
                        className="shadow-sm"
                    />

                    {/* Earrings */}
                    <JewelryItem
                        item={jewelryItems[2]}
                        className=""
                    />
                </div>

                {/* Right Column - Rings */}
                <JewelryItem
                    item={jewelryItems[3]}
                    className="p-2"
                />
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-shimmer {
                    position: relative;
                    overflow: hidden;
                }

                .animate-shimmer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.4),
                        transparent
                    );
                    transform: translateX(-100%);
                    animation: shimmer 2s infinite;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}