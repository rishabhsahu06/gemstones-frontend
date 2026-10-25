"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";

const TYPE_FROM_CAT = {
  pendants: "pendants",
  bracelets: "bracelets",
  earrings: "earrings",
  rings: "rings",
  necklaces: "necklaces",
  anklets: "anklets",
  chokers: "chokers",
};

const formatLabel = (value) =>
  value
    ? String(value)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "";

const HeroSkeleton = () => (
  <div className="w-full h-[300px] sm:h-[400px] lg:h-[600px] bg-gray-200 animate-pulse">
    <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
  </div>
);

const FilterSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-4xl mx-auto">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex-1">
        <div className="w-full h-12 bg-gray-200 rounded-md animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded-md"></div>
        </div>
      </div>
    ))}
  </div>
);

const ProductCardSkeleton = () => (
  <div className="group cursor-pointer">
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 mb-2 sm:mb-3 animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
    </div>
    <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
  </div>
);

const TitleSkeleton = () => (
  <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-6 sm:mb-8">
    <div className="w-80 h-8 sm:h-10 lg:h-12 bg-gray-200 rounded mb-2 sm:mb-4 animate-pulse"></div>
    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

function Jewelry() {
  const searchParams = useSearchParams();
  const catFromUrl = searchParams.get("cat");

  const [isLoading, setIsLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [errorImages, setErrorImages] = useState(new Set());
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedType, setSelectedType] = useState(TYPE_FROM_CAT[catFromUrl] || "");
  const [error, setError] = useState("");

  const fetchJewellery = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/products", {
        params: {
          productType: "jewellery",
          isAvailable: true,
          limit: 1000,
        },
      });

      const products = response.data?.data || [];
      const mapped = products.map((product) => ({
        id: product._id,
        title: product.name,
        image: product.images?.[0]?.url || "/placeholder.svg",
        metal: product.metal || "",
        type: product.jewelleryType || "",
        category: product.jewelleryTag && product.jewelleryTag !== "all" ? product.jewelleryTag : "all",
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        isAvailable: product.isAvailable,
        stock: product.stock,
      }));

      setItems(mapped);
    } catch (err) {
      console.error("Failed to load jewellery", err);
      setError("Failed to load jewellery. Please try again.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJewellery();
  }, [fetchJewellery]);

  useEffect(() => {
    if (TYPE_FROM_CAT[catFromUrl]) {
      setSelectedType(TYPE_FROM_CAT[catFromUrl]);
    }
  }, [catFromUrl]);

  useEffect(() => {
    let filtered = [...items];

    if (selectedFilter && selectedFilter !== "all") {
      filtered = filtered.filter((item) => item.category === selectedFilter);
    }

    if (selectedMetal) {
      filtered = filtered.filter((item) => item.metal === selectedMetal);
    }

    if (selectedType) {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    setFilteredData(filtered);
  }, [items, selectedFilter, selectedMetal, selectedType]);

  const handleImageLoad = useCallback((id) => {
    setLoadedImages((prev) => new Set([...prev, id]));
  }, []);

  const handleImageError = useCallback((id) => {
    setErrorImages((prev) => new Set([...prev, id]));
  }, []);

  const resetFilters = () => {
    setSelectedFilter("");
    setSelectedMetal("");
    setSelectedType("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSkeleton />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TitleSkeleton />
          <FilterSkeleton />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-12 sm:pb-16">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        {!heroImageLoaded && <HeroSkeleton />}
        <Image
          src="/jwellery-banner.png"
          alt="Jewelry Hero - Discover exquisite jewelry collections"
          width={1920}
          height={600}
          className={`w-full h-auto object-cover transition-opacity duration-500 ${
            heroImageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
          onLoad={() => setHeroImageLoaded(true)}
          onError={() => setHeroImageLoaded(true)}
          priority
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-center">
            Find Your Unique Aesthetic
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">Select Metal & Style</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 max-w-4xl mx-auto">
          <div className="flex-1">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Filter by Category" />
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
            <Select value={selectedMetal} onValueChange={setSelectedMetal}>
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
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Jewelry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rings">Rings</SelectItem>
                <SelectItem value="pendants">Pendants</SelectItem>
                <SelectItem value="necklaces">Necklaces</SelectItem>
                <SelectItem value="bracelets">Bracelets</SelectItem>
                <SelectItem value="earrings">Earrings</SelectItem>
                <SelectItem value="anklets">Anklets</SelectItem>
                <SelectItem value="chokers">Chokers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(selectedFilter || selectedMetal || selectedType) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                Clear All Filters
              </button>
            )}
            {selectedFilter && (
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                Category: {selectedFilter}
              </span>
            )}
            {selectedMetal && (
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                Metal: {formatLabel(selectedMetal)}
              </span>
            )}
            {selectedType && (
              <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                Type: {formatLabel(selectedType)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {filteredData.length} {filteredData.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">{error}</h3>
            <button
              onClick={fetchJewellery}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">No jewelry found</h3>
            <p className="text-gray-600 mb-4">
              {items.length === 0
                ? "Jewellery added from the admin portal will appear here."
                : "Try adjusting your filters to see more results"}
            </p>
            {items.length > 0 && (
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-12 sm:pb-16">
            {filteredData.map((item, index) => {
              const isLoaded = loadedImages.has(item.id);
              const hasError = errorImages.has(item.id);
              const price = item.discountedPrice || item.originalPrice;

              return (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg block"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 mb-2 sm:mb-3 relative">
                    {!isLoaded && !hasError && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    )}
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={`${item.title} - Premium jewelry piece`}
                      width={300}
                      height={300}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageError(item.id)}
                    />
                    {hasError && (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <p className="text-xs text-gray-500">Image not available</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg">
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          <p className="text-xs text-gray-700 capitalize">
                            {formatLabel(item.metal)} • {formatLabel(item.type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-sm sm:text-base font-medium text-gray-800 group-hover:text-gray-600">
                    {item.title}
                  </p>
                  {price > 0 && (
                    <p className="text-center text-sm text-[#BA8E49] font-semibold mt-1">
                      Rs. {Number(price).toLocaleString()}
                    </p>
                  )}
                  {item.category !== "all" && (
                    <div className="text-center mt-1">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          item.category === "new"
                            ? "bg-green-100 text-green-800"
                            : item.category === "popular"
                              ? "bg-blue-100 text-blue-800"
                              : item.category === "sale"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -400% 0; }
          100% { background-position: 400% 0; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function JewelryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <HeroSkeleton />
        </div>
      }
    >
      <Jewelry />
    </Suspense>
  );
}
