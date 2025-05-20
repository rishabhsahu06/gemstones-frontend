"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

function Authenticity() {
    return (
        <div className="container mx-auto mt-16 mt-12 ">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center">
                {/* Left Image - Made smaller to match design */}
                <div className="rounded-lg overflow-hidden mx-auto md:mx-0 max-w-lg">
                    <Image
                        src="/left-ring.png"
                        alt="Gemstone Jewelry"
                        width={500}
                        height={345}
                        className="h-auto object-cover rounded-lg"
                    /></div>

                {/* Right Content */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                        Authenticity You Can Trust
                    </h1>
                    <h2 className="text-xl md:text-2xl font-semibold text-center mb-4">
                        Natural, Certified & Ethically Sourced Gemstone
                    </h2>

                    <p className="text-gray-700 text-center mb-6">
                        Our gemstones are 100% natural, lab-certified, and ethically sourced. Each stone is
                        energized by expert astrologers and customized to your birth chart.
                    </p>

                    {/* Three Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t">
                        <div className="p-4 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r">
                            <h3 className="font-semibold text-center mb-4">Guarantee of Purity</h3>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/purity.png"
                                    alt="Guarantee of Purity"
                                    height={64}
                                    width={64}
                                    className="text-primary"
                                />
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r">
                            <h3 className="font-semibold text-center mb-4">100% Natural & Certified</h3>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/certified.png"
                                    alt="100% Natural & Certified"
                                    height={64}
                                    width={64}
                                    className="text-primary"
                                />
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-start">
                            <h3 className="font-semibold text-center mb-4">Ethically Sourced</h3>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/ethically.png"
                                    alt="Ethically Sourced"
                                    height={64}
                                    width={64}
                                    className="text-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Card */}
                <div className="bg-[#3D2A26] text-white rounded-lg p-6 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        Book Your Gemstone & Consultation
                    </h2>
                    <p className="text-center mb-8">
                        Connect with expert astrologers to find the perfect gemstone based on your birth chart.
                        Accurate, personalized, and 100% certified guidance.
                    </p>
                    <Button className="bg-white text-[#3D2A26] hover:bg-gray-100 w-full">
                        BOOK NOW
                    </Button>
                </div>

                {/* Middle Image */}
                <div className="flex items-center justify-center">
                    <div className="relative w-full h-[300px]">
                        <Image
                            src="/right-ring.png"
                            alt="Gemstone Pendant"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>

                {/* Right Card */}
                <div className="bg-[#A88B7D] text-white rounded-lg p-6 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        Secure Your Astrological Gem – 100% Natural & Verified
                    </h2>
                    <p className="text-center mb-4">
                        Handpicked by expert astrologers, each gemstone is lab-certified, ethically sourced,
                        and aligned to your unique birth chart.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Authenticity;