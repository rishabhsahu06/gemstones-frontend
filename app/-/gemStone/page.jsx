import Image from "next/image"

const gemstones = [
  // Row 1
  { src: "/yellow-stone.png", alt: "Yellow gemstone on gold background" },
  { src: "/blue-stone.png", alt: "Blue gemstone on blue background" },
  { src: "/green-stone.png", alt: "Green gemstone on green background" },
  { src: "/red-stone.png", alt: "Red gemstone on red background" },
  // Row 2
  { src: "/opal-stone.png", alt: "Opal gemstone on light background" },
  { src: "/blue-stone.png", alt: "Orange gemstone on orange background" },
  { src: "/pearl-stone.png", alt: "Pearl on light gray background" },
  { src: "/red-stone.png", alt: "Pink gemstone on orange background" },
  // Row 3 (repeating the first row)
  { src: "/yellow-stone.png", alt: "Yellow gemstone on gold background" },
  { src: "/blue-stone.png", alt: "Blue gemstone on blue background" },
  { src: "/green-stone.png", alt: "Green gemstone on green background" },
  { src: "/red-stone.png", alt: "Red gemstone on red background" },
  // Row 4 (repeating the second row)
  { src: "/yellow-stone.png", alt: "Opal gemstone on light background" },
  { src: "/blue-stone.png", alt: "Orange gemstone on orange background" },
  { src: "/green-stone.png", alt: "Pearl on light gray background" },
  { src: "/red-stone.png", alt: "Pink gemstone on orange background" },
]

function Page() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-start mb-8 mt-12 px-4">Gemstones</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {gemstones.map((stone, index) => (
          <div
            key={index}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer "
          >
            <Image
              src={stone.src || "/placeholder.svg"}
              alt={stone.alt}
              width={500}
              height={500}
              className="w-full h-full object-contain  transition-all duration-300 hover:shadow-xl "
              priority={index < 4} // Load first row with priority
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page