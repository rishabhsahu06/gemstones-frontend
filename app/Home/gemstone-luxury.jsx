"use client"

import { useState } from "react";

export default function LuxuryGemstones() {
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
        <div className="container mx-auto ">
            {/* Header Section */}
            <div className="text-center mb-10 mt-12">
                <h1 className="text-4xl font-bold mb-2">The Art of Gemstone Luxury</h1>
                <p className="text-gray-600">Elevate your style with the unmatched allure of fine gemstones.</p>
            </div>

            {/* Jewelry Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Pendants */}
                <div className="rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-96">
                        <img
                            src={jewelryItems[0].image}
                            alt={jewelryItems[0].title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4 text-center bg-white">
                        <h2 className="text-xl font-medium">{jewelryItems[0].title}</h2>
                    </div>
                </div>

                {/* Middle Column - Bracelet & Earrings */}
                <div className="flex flex-col space-y-6">
                    {/* Bracelet */}
                    <div className="rounded-lg overflow-hidden shadow-sm">
                        <div className="relative h-44">
                            <img
                                src={jewelryItems[1].image}
                                alt={jewelryItems[1].title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 text-center bg-white">
                            <h2 className="text-xl font-medium">{jewelryItems[1].title}</h2>
                        </div>
                    </div>

                    {/* Earrings */}
                    <div className="rounded-lg overflow-hidden shadow-sm">
                        <div className="relative h-44">
                            <img
                                src={jewelryItems[2].image}
                                alt={jewelryItems[2].title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 text-center bg-white">
                            <h2 className="text-xl font-medium">{jewelryItems[2].title}</h2>
                        </div>
                    </div>
                </div>

                {/* Right Column - Rings */}
                <div className="rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-96">
                        <img
                            src={jewelryItems[3].image}
                            alt={jewelryItems[3].title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4 text-center bg-white">
                        <h2 className="text-xl font-medium">{jewelryItems[3].title}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}