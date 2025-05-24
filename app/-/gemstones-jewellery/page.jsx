import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

function Jewelry() {
  const data = [
    { id: 1, title: "Ring", image: "/ring.png" },
    { id: 2, title: "Necklace - Pendant", image: "/pendant-img.png" },
    { id: 3, title: "Bracelet", image: "/ankles.png" },
    { id: 4, title: "Earrings", image: "/green-ring.png" },
    { id: 5, title: "Anklets", image: "/ring.png" },
    { id: 6, title: "Bracelet Pins", image: "/pendant-img.png" },
    { id: 7, title: "Chokers", image: "/ankles.png" },
    { id: 8, title: "Ring", image: "/green-ring.png" },
    { id: 9, title: "Ring", image: "/ring.png" },
    { id: 10, title: "Necklace - Pendant", image: "/pendant-img.png" },
    { id: 11, title: "Bracelet", image: "/ankles.png" },
    { id: 12, title: "Earrings", image: "/green-ring.png" },
    { id: 13, title: "Anklets", image: "/ring.png" },
    { id: 14, title: "Bracelet Pins", image: "/pendant-img.png" },
    { id: 15, title: "Chokers", image: "/ankles.png" },
    { id: 16, title: "Ring", image: "/green-ring.png" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="">
        <Image
          src="/jwellery-banner.png"
          alt="Jewelry Hero"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
        />

      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-center">
            Find Your Unique Aesthetic
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">Select Metal</p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-4xl mx-auto">
          <div className="flex-1">
            <Select>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="sale">On Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select Metal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="rose-gold">Rose Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Jewellery Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rings">Rings</SelectItem>
                <SelectItem value="necklaces">Necklaces</SelectItem>
                <SelectItem value="bracelets">Bracelets</SelectItem>
                <SelectItem value="earrings">Earrings</SelectItem>
                <SelectItem value="anklets">Anklets</SelectItem>
                <SelectItem value="chokers">Chokers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-12 sm:pb-16">
          {data.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 mb-2 sm:mb-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-center text-sm sm:text-base font-medium text-gray-800 group-hover:text-gray-600 transition-colors">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Jewelry;
