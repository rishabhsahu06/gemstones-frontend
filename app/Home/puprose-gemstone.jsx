import Image from "next/image"

function PurposefulGemstone() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-16">Purposeful Gemstones</h1>
                <p className="text-base md:text-xl font-helvetica text-center text-[#4F4F4F] mb-10">Let Every Stone Reflect Your Purpose and Strength</p>
            </div>

            {/* Mobile: 2x2 grid with last item centered */}
            <div className="block sm:hidden">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Health */}
                    <div className="flex flex-col items-center">
                        <div className="bg-[#dbc396] rounded-full w-32 h-32 flex items-center justify-center mb-3 overflow-hidden">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <Image src="/health.png" alt="Health" fill className="object-contain" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-center">Health</h3>
                    </div>

                    {/* Career */}
                    <div className="flex flex-col items-center">
                        <div className="bg-[#dbc396] rounded-full w-32 h-32 flex items-center justify-center mb-3 overflow-hidden">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <Image src="/career.png" alt="Career" fill className="object-contain" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-center">Career</h3>
                    </div>

                    {/* Education */}
                    <div className="flex flex-col items-center">
                        <div className="bg-[#dbc396] rounded-full w-32 h-32 flex items-center justify-center mb-3 overflow-hidden">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <Image src="/education.png" alt="Education" fill className="object-contain" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-center">Education</h3>
                    </div>

                    {/* Business */}
                    <div className="flex flex-col items-center">
                        <div className="bg-[#dbc396] rounded-full w-32 h-32 flex items-center justify-center mb-3 overflow-hidden">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <Image src="/business.png" alt="Business" fill className="object-contain" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-center">Business</h3>
                    </div>
                </div>

                {/* Last item centered */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-[#dbc396] rounded-full w-32 h-32 flex items-center justify-center mb-3 overflow-hidden">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <Image src="/relationship.png" alt="Relationship" fill className="object-contain" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-center">Relationship</h3>
                    </div>
                </div>
            </div>

            {/* Tablet and Desktop: Original grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4">
                {/* Health */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-40 h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-20 h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/health.png" alt="Health" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center">Health</h3>
                </div>

                {/* Career */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-40 h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-20 h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/career.png" alt="Career" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center">Career</h3>
                </div>

                {/* Education */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-40 h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-20 h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/education.png" alt="Education" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center">Education</h3>
                </div>

                {/* Business */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-40 h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-20 h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/business.png" alt="Business" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center">Business</h3>
                </div>

                {/* Relationship */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-40 h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-20 h-20 md:w-18 md:h-18 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/relationship.png" alt="Relationship" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center">Relationship</h3>
                </div>
            </div>
        </div>
    )
}

export default PurposefulGemstone