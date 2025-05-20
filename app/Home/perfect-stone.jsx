import { Button } from "@/components/ui/button";
import Image from "next/image";

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

function PerfectStones() {
    return (
        <div className="container mx-auto px-4 mt-12">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 mt-16">Find your Perfect Stone</h1>
            <p className="text-xl text-center text-gray-600 mb-10">Shop by Categories</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stoneCategories.map((stone, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div

                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={stone.image || "/placeholder.svg"}
                                    alt={stone.name}
                                    width={330}
                                    height={330}
                                    className="object-contain max-h-full"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-medium text-center">{stone.name}</h3>

                    </div>
                ))}
            </div>

            <div className="flex justify-center  mt-8">
                <Button className="bg-[#BA8E49] px-16 py-8 text-xl">View all</Button>
            </div>
        </div>
    );
}

export default PerfectStones;
