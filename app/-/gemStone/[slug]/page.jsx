
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
import CategoryCard from "@/app/components/category-cards/categoryCards"

// Gemstone data
const gemstoneData = {
    "yellow-sapphire-pukhraj": {
        id: 1,
        name: "Yellow Sapphire",
        altName: "Pukhraj",
        description:
            "Yellow Sapphire, is a gemstone of prosperity and power. Global icon Angelina Jolie favours it as well. Known for enhancing fortune, it's a timeless choice among high-worth spiritual investors.",
        benefits: ["Financial Growth", "Promotes Good Health", "Stability in domestic life", "Good for education"],
        image: "/yellow-stone.png",
    },
    "blue-sapphire-neelam": {
        id: 2,
        name: "Blue Sapphire",
        altName: "Neelam",
        description:
            "Blue Sapphire is known as the stone of wisdom and royalty. It brings mental clarity, spiritual insight, and divine favor. This precious gemstone has been treasured by kings and spiritual leaders throughout history.",
        benefits: ["Mental Clarity", "Spiritual Growth", "Protection from negativity", "Enhanced intuition"],
        image: "/blue-stone.png",
    },
    emerald: {
        id: 3,
        name: "Emerald",
        altName: "Panna",
        description:
            "Emerald is the stone of successful love and domestic bliss. It enhances unity, unconditional love, and partnership. Known for bringing harmony and growth in relationships and business ventures.",
        benefits: ["Relationship harmony", "Business success", "Enhanced creativity", "Emotional healing"],
        image: "/green-stone.png",
    },
    ruby: {
        id: 4,
        name: "Ruby",
        altName: "Manik",
        description:
            "Ruby is the king of gemstones, representing passion, protection, and prosperity. It stimulates the heart chakra and brings courage, confidence, and vitality to the wearer.",
        benefits: ["Increased confidence", "Leadership qualities", "Passion and energy", "Protection from harm"],
        image: "/red-stone.png",
    },
    opal: {
        id: 5,
        name: "Opal",
        altName: "Dudhiya Ratna",
        description:
            "Opal is a stone of inspiration and creativity. It enhances cosmic consciousness and induces psychic and mystical visions. Known for bringing good luck and amplifying emotions.",
        benefits: ["Enhanced creativity", "Emotional balance", "Spiritual awakening", "Good fortune"],
        image: "/opal-stone.png",
    },
    "orange-sapphire": {
        id: 6,
        name: "Orange Sapphire",
        altName: "Padparadscha",
        description:
            "Orange Sapphire is a rare and precious gemstone that combines the energy of yellow and pink sapphires. It brings joy, creativity, and emotional healing to the wearer.",
        benefits: ["Creative inspiration", "Emotional healing", "Joy and happiness", "Artistic abilities"],
        image: "/blue-stone.png",
    },
    pearl: {
        id: 7,
        name: "Pearl",
        altName: "Moti",
        description:
            "Pearl is the queen of gems, representing purity, wisdom, and spiritual transformation. It calms the mind, enhances personal integrity, and brings peace and tranquility.",
        benefits: ["Mental peace", "Emotional stability", "Enhanced wisdom", "Spiritual growth"],
        image: "/pearl-stone.png",
    },
    "pink-sapphire": {
        id: 8,
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

export default async function GemstoneDetailPage({ params }) {
    // console.log("Gemstone Detail Page Params:", params)
const token = false
    const AddToCart = (productId) => {
        if (!token) {
           alert("Please login to add products to cart.");
        } else {
            console.log("Adding product to cart:", productId);
        }
    };
    const gemstone = params.slug && gemstoneData[params.slug.toLowerCase()];

    if (!gemstone) {
        return <div>Gemstone not found</div>;
    }

    return (
        <div className="min-h-screen bg-white mt-4">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4 ">
                <nav className="flex items-center space-x-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-gray-900">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <div className="hover:text-gray-900">
                        Gemstones
                    </div>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 font-medium">{gemstone.name}</span>
                </nav>
            </div>

            <div className="container mx-auto px-4 pb-12 ">
                <h1 className="text-4xl font-bold text-gray-900 my-4 ">
                    {gemstone.name} ({gemstone.altName})
                </h1>

                <p className="text-gray-700 text-lg leading-relaxed mb-5 max-w-4xl">{gemstone.description}</p>

                {/* Benefits section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Why Choose {gemstone.name} ({gemstone.altName}) Stone?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {gemstone.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-full bg- border border-[#BA8E49] flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-[#BA8E49]" />
                                </div>
                                <span className="text-gray-700 font-semibold">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue  placeholder="Price" />
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
    <CategoryCard key={product.id} product={product} slug={params.slug} />
  ))}
</div>
            </div>
        </div>
    );
}
