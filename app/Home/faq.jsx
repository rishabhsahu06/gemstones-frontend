"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef } from "react"
// Removed TypeScript interface
const faqData = [
    {
        id: 1,
        question: "How do I know which gemstone is right for my zodiac sign?",
        answer:
            "Each zodiac sign is associated with specific gemstones that align with its ruling planet and characteristics. Consulting an astrologer can help you find the most suitable stone.",
    },
    {
        id: 2,
        question: "Can wearing the wrong gemstone cause negative effects?",
        answer:
            "While gemstones are generally safe to wear, some believe that wearing incompatible stones may not provide the desired benefits. It's recommended to consult with an expert before choosing.",
    },
    {
        id: 3,
        question: "What is a birthstone, and how is it different from a planetary gemstone?",
        answer:
            "Birthstones are associated with birth months, while planetary gemstones are linked to astrological planets and their influences. Planetary stones are chosen based on your birth chart analysis.",
    },
    {
        id: 4,
        question: "Do I need to energize or purify my gemstone before wearing it?",
        answer:
            "Many practitioners recommend cleansing and energizing gemstones before first use to remove any negative energies and enhance their natural properties.",
    },
    {
        id: 5,
        question: "On which finger should I wear my astrological gemstone ring?",
        answer:
            "The finger choice depends on the specific gemstone and its associated planet. Each finger is connected to different planetary energies in Vedic astrology.",
    },
    {
        id: 6,
        question: "How long does it take for a gemstone to show astrological effects?",
        answer:
            "The effects of gemstones can vary from person to person. Some may notice changes within a few weeks, while others might take several months to experience the full benefits.",
    },
]

function FAQ() {
    const [openItems, setOpenItems] = useState([1]) // First item open by default

    const toggleItem = (id) => {
        setOpenItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    return (
        <div className="container mx-auto ">
            {/* Header Section */}
            <div className="text-center mb-12 lg:mb-16 mt-12">
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-6">
                    Frequently Asked Question
                </h1>
                <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
                   Got questions? We’ve got answers. From gemstone authenticity and care tips to shipping details and customization options—find everything you need to know right here. Explore our most commonly asked questions to make your shopping experience smooth and informed.
                </p>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="order-2 lg:order-1">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="/faq-img.png"
                            alt="Dr. Sunita Dubey - Gemstone Expert"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                <div className="order-1 lg:order-2 space-y-4">
                    {faqData.map((item) => {
                        const isOpen = openItems.includes(item.id)
                        const contentRef = useRef(null)
                        const [height, setHeight] = useState("0px")

                        useEffect(() => {
                            if (isOpen && contentRef.current) {
                                setHeight(`${contentRef.current.scrollHeight}px`)
                            } else {
                                setHeight("0px")
                            }
                        }, [isOpen])

                        return (
                            <div
                                key={item.id}
                                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
                                        {item.question}
                                    </h3>
                                    <div className="flex-shrink-0">
                                        {isOpen ? (
                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                        )}
                                    </div>
                                </button>

                                <div
                                    ref={contentRef}
                                    className="px-6 transition-all duration-300 ease-in-out overflow-hidden "
                                    style={{ maxHeight: height }}
                                >
                                    <div className="border-t  mb-2 border-gray-100 py-4">
                                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default FAQ
