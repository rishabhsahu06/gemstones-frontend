import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Gemstone data
const gemstoneData = {
    "yellow-sapphire-pukhraj": {
        name: "Yellow Sapphire",
        altName: "Pukhraj",
        description:
            "Yellow Sapphire, is a gemstone of prosperity and power. Global icon Angelina Jolie favours it as well. Known for enhancing fortune, it's a timeless choice among high-worth spiritual investors.",
        benefits: ["Financial Growth", "Promotes Good Health", "Stability in domestic life", "Good for education"],
        image: "/yellow-stone.png",
    },
    "blue-sapphire-neelam": {
        name: "Blue Sapphire",
        altName: "Neelam",
        description:
            "Blue Sapphire is known as the stone of wisdom and royalty. It brings mental clarity, spiritual insight, and divine favor. This precious gemstone has been treasured by kings and spiritual leaders throughout history.",
        benefits: ["Mental Clarity", "Spiritual Growth", "Protection from negativity", "Enhanced intuition"],
        image: "/blue-stone.png",
    },
    emerald: {
        name: "Emerald",
        altName: "Panna",
        description:
            "Emerald is the stone of successful love and domestic bliss. It enhances unity, unconditional love, and partnership. Known for bringing harmony and growth in relationships and business ventures.",
        benefits: ["Relationship harmony", "Business success", "Enhanced creativity", "Emotional healing"],
        image: "/green-stone.png",
    },
    ruby: {
        name: "Ruby",
        altName: "Manik",
        description:
            "Ruby is the king of gemstones, representing passion, protection, and prosperity. It stimulates the heart chakra and brings courage, confidence, and vitality to the wearer.",
        benefits: ["Increased confidence", "Leadership qualities", "Passion and energy", "Protection from harm"],
        image: "/red-stone.png",
    },
    opal: {
        name: "Opal",
        altName: "Dudhiya Ratna",
        description:
            "Opal is a stone of inspiration and creativity. It enhances cosmic consciousness and induces psychic and mystical visions. Known for bringing good luck and amplifying emotions.",
        benefits: ["Enhanced creativity", "Emotional balance", "Spiritual awakening", "Good fortune"],
        image: "/opal-stone.png",
    },
    "orange-sapphire": {
        name: "Orange Sapphire",
        altName: "Padparadscha",
        description:
            "Orange Sapphire is a rare and precious gemstone that combines the energy of yellow and pink sapphires. It brings joy, creativity, and emotional healing to the wearer.",
        benefits: ["Creative inspiration", "Emotional healing", "Joy and happiness", "Artistic abilities"],
        image: "/blue-stone.png",
    },
    pearl: {
        name: "Pearl",
        altName: "Moti",
        description:
            "Pearl is the queen of gems, representing purity, wisdom, and spiritual transformation. It calms the mind, enhances personal integrity, and brings peace and tranquility.",
        benefits: ["Mental peace", "Emotional stability", "Enhanced wisdom", "Spiritual growth"],
        image: "/pearl-stone.png",
    },
    "pink-sapphire": {
        name: "Pink Sapphire",
        altName: "Gulabi Neelam",
        description:
            "Pink Sapphire is the stone of love and emotional healing. It opens the heart chakra, promotes self-love, and attracts romantic relationships filled with trust and loyalty.",
        benefits: ["Emotional healing", "Self-love", "Romantic relationships", "Heart chakra activation"],
        image: "/red-stone.png",
    },
};

// Sample products for the grid
const sampleProducts = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "Yellow Sapphire - 5.97 Carats",
    origin: "Sri Lanka",
    price: "₹ 27,216",
    image: "/yellow-stone.png",
}));

export default function GemstoneDetailPage({ params }) {
    // console.log("Gemstone Detail Page Params:", params)
console.log(params.slug,"yoyo")
    const gemstone = gemstoneData[params.slug.toLowerCase()];
    console.log("Gemstone Data:", gemstone);
    if (!gemstone) {
        return <div>Gemstone not found</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-gray-900">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/gemstones" className="hover:text-gray-900">
                        Gemstones
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium">{gemstone.name}</span>
                </nav>
            </div>

            <div className="container mx-auto px-4 pb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {gemstone.name} ({gemstone.altName})
                </h1>

                <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-4xl">{gemstone.description}</p>

                {/* Benefits section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Why Choose {gemstone.name} ({gemstone.altName}) Stone?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {gemstone.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low-to-high">Low to High</SelectItem>
                            <SelectItem value="high-to-low">High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Weight(Carat)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1-3">1-3 Carats</SelectItem>
                            <SelectItem value="3-5">3-5 Carats</SelectItem>
                            <SelectItem value="5-10">5-10 Carats</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Shape" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="oval">Oval</SelectItem>
                            <SelectItem value="round">Round</SelectItem>
                            <SelectItem value="cushion">Cushion</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Origin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sri-lanka">Sri Lanka</SelectItem>
                            <SelectItem value="myanmar">Myanmar</SelectItem>
                            <SelectItem value="thailand">Thailand</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sampleProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-yellow-200 to-yellow-400 p-8 flex items-center justify-center">
                                <Image
                                    src={gemstone.image || "/placeholder.svg"}
                                    alt={product.title}
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">Origin: {product.origin}</p>
                                <p className="text-lg font-bold text-gray-900 mb-4">{product.price}</p>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-amber-700 border-amber-700 hover:bg-amber-50"
                                    >
                                        ADD CART
                                    </Button>
                                    <Button size="sm" className="flex-1 bg-amber-700 hover:bg-amber-800">
                                        BUY NOW
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
