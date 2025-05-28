"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

const stoneCategories = [
    {
        name: "Yellow Sapphire",
        image: "/yellow-stone.png",
    },
    {
        name: "Blue Sapphire",
        image: "/blue-stone.png",
    },
    {
        name: "Emerald",
        image: "/green-stone.png",
    },
    {
        name: "Ruby",
        image: "/ruby-stone.png",
    },
    {
        name: "Opal",
        image: "/opal-stone.png",
    },
    {
        name: "Red Coral",
        image: "/red-stone.png",
    },
    {
        name: "Pearl",
        image: "/pearl-stone.png",
    },
    {
        name: "Hessonite",
        image: "/hesotine-stone.png",
    },
];

// Individual Stone Card Component with loading state
function StoneCard({ stone, index }) {
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
        <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square mb-4">
                {/* Skeleton */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 rounded-lg animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                )}

                {/* Actual Image */}
                <div className={`relative w-full h-full flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}>
                    <Image
                        src={hasError ? "/placeholder.svg" : stone.image}
                        alt={stone.name}
                        width={330}
                        height={330}
                        className="object-contain max-h-full hover:scale-105 transition-transform duration-300"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        priority={index < 4} // Prioritize first 4 images
                    />
                </div>
            </div>

            {/* Title with skeleton */}
            {isLoading ? (
                <div className="h-6 md:h-8 bg-gray-300 rounded w-24 md:w-32 animate-pulse"></div>
            ) : (
                <h3 className="text-[18px] md:text-[24px] font-semibold text-center transition-opacity duration-300">
                    {stone.name}
                </h3>
            )}
        </div>
    );
}

function PerfectStones() {
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    // Check if all images are loaded
    useEffect(() => {
        if (loadedCount === stoneCategories.length) {
            setAllImagesLoaded(true);
        }
    }, [loadedCount]);

    return (
        <div className="container mx-auto px-4 mt-12">
            {/* Header with skeleton */}
            <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-16">
                    Find your Perfect Stone
                </h1>
                <p className="text-[16px] md:text-[20px] font-helvatica text-center text-[#4F4F4F]">
                    Shop by Categories
                </p>
            </div>

            {/* Grid with skeleton items */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stoneCategories.map((stone, index) => (
                    <StoneCard
                        key={index}
                        stone={stone}
                        index={index}
                    />
                ))}
            </div>

            {/* Button with skeleton */}
            <div className="flex justify-center mt-8">



                <Button
                    className="bg-[#BA8E49] hover:bg-[#A67A3F] px-8 py-8 md:px-16 md:py-8 text-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                    View all
                </Button>

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
                        background-position: -468px 0;
                    }
                    100% {
                        background-position: 468px 0;
                    }
                }

                .animate-shimmer {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 400% 100%;
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
}

export default PerfectStones;