"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

function Authenticity() {
    return (
        <div className="container mx-auto px-4">
            {/* Top Section */}
            <div className="flex flex-col mt-4 lg:flex-row gap-6 mb-8 items-center xl:mt-[50px]">
                {/* Left Image */}
                <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden">
                    <Image
                        src="/left-ring.png"
                        alt="Gemstone Jewelry"
                        width={500}
                        height={345}
                        className="w-full h-[250px] md:h-[350px] object-cover rounded-2xl"
                    />
                </div>

                {/* Right Content */}
                <div className="w-full lg:w-1/2 bg-white rounded-2xl p-6 shadow-sm border">
                    <h1 className="text-xl md:text-2xl font-bold text-center mb-2">
                        Authenticity You Can Trust
                    </h1>
                    <h2 className="text-lg md:text-xl font-bold text-center mb-4">
                        Natural, Certified & Ethically Sourced Gemstone
                    </h2>

                    <p className="text-gray-700 text-center mb-6 text-sm md:text-base">
                        Our gemstones are 100% natural, lab-certified, and ethically sourced. Each stone is
                        energized by expert astrologers and customized to your birth chart.
                    </p>

                    {/* Three Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t">
                        <div className="p-4 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r">
                            <h3 className="font-semibold text-center mb-4 text-sm">Guarantee of Purity</h3>
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/purity.png"
                                    alt="Guarantee of Purity"
                                    height={48}
                                    width={48}
                                    className="text-primary"
                                />
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r">
                            <h3 className="font-semibold text-center mb-4 text-sm">100% Natural & Certified</h3>
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/certified.png"
                                    alt="100% Natural & Certified"
                                    height={48}
                                    width={48}
                                    className="text-primary"
                                />
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-start">
                            <h3 className="font-semibold text-center mb-4 text-sm">Ethically Sourced</h3>
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center">
                                <Image
                                    src="/ethically.png"
                                    alt="Ethically Sourced"
                                    height={48}
                                    width={48}
                                    className="text-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Card */}
                <div className="w-full lg:w-1/3 bg-[#3D2A26] text-white rounded-2xl p-6 flex flex-col items-center order-1 lg:order-1">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
                        Book Your Gemstone & Consultation
                    </h2>
                    <p className="text-center mb-6 md:mb-8 text-sm md:text-base">
                        Connect with expert astrologers to find the perfect gemstone based on your birth chart.
                        Accurate, personalized, and 100% certified guidance.
                    </p>
                    <Button className="bg-white text-[#3D2A26] hover:bg-gray-100 w-full">
                        BOOK NOW
                    </Button>
                </div>

                {/* Middle Image */}
                <div className="w-full lg:w-1/3 flex items-center justify-center order-2 lg:order-2">
                    <div className="relative w-full h-[200px] md:h-[300px]">
                        <Image
                            src="/right-ring.png"
                            alt="Gemstone Pendant"
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                </div>

                {/* Right Card */}
                <div className="w-full lg:w-1/3 bg-[#A88B7D] text-white rounded-2xl p-6 flex flex-col items-center order-3 lg:order-3">
                    <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
                        Secure Your Astrological Gem – 100% Natural & Verified
                    </h2>
                    <p className="text-center text-sm md:text-base">
                        Handpicked by expert astrologers, each gemstone is lab-certified, ethically sourced,
                        and aligned to your unique birth chart.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Authenticity;