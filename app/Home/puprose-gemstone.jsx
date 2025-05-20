import Image from "next/image"

function PurposefulGemstone() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-12">Purposeful Gemstones</h1>
                <p className="text-xl text-gray-600">Let Every Stone Reflect Your Purpose and Strength</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-4">
                {/* Health */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-48 h-48 sm:w-40 sm:h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-24 h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/health.png" alt="Health" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Health</h3>
                </div>

                {/* Career */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-48 h-48 sm:w-40 sm:h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-24 h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/career.png" alt="Career" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Career</h3>
                </div>

                {/* Education */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-48 h-48 sm:w-40 sm:h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-24 h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/education.png" alt="Education" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Education</h3>
                </div>

                {/* Business */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-48 h-48 sm:w-40 sm:h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-24 h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/business.png" alt="Business" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Business</h3>
                </div>

                {/* Relationship */}
                <div className="flex flex-col items-center">
                    <div className="bg-[#dbc396] rounded-full w-48 h-48 sm:w-40 sm:h-40 md:w-36 md:h-36 lg:w-44 lg:h-44 flex items-center justify-center mb-4 overflow-hidden">
                        <div className="relative w-24 h-24 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                            <Image src="/relationship.png" alt="Relationship" fill className="object-contain" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold">Relationship</h3>
                </div>
            </div>
        </div>
    )
}

export default PurposefulGemstone
