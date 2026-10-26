"use client";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import api from "@/lib/axios";
import useAccessToken from "@/hooks/userSession";
import { useApi } from "@/hooks/useApi";
import AuthModal from "@/app/components/auth-model/authModel";
import { toast } from "react-toastify";

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

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const HeroSkeleton = () => (
  <div className="w-full h-[180px] sm:h-[280px] lg:h-[420px] bg-[#f3efe6] animate-pulse" />
);

const FilterSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-5xl mx-auto">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-11 bg-[#f3efe6] rounded-lg animate-pulse" />
    ))}
  </div>
);

const ProductCardSkeleton = () => (
  <div className="rounded-2xl border border-[#ebe4d6] bg-white overflow-hidden">
    <div className="aspect-[4/5] bg-[#f7f5f0] animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 bg-[#f3efe6] rounded" />
      <div className="h-5 w-3/4 bg-[#f3efe6] rounded" />
      <div className="h-4 w-1/3 bg-[#f3efe6] rounded" />
      <div className="h-10 w-full bg-[#f3efe6] rounded-full" />
    </div>
  </div>
);

function Jewelry() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const catFromUrl = searchParams.get("cat");
  const { accessToken } = useAccessToken();
  const { post } = useApi();
  const pendingProductId = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [errorImages, setErrorImages] = useState(new Set());
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedType, setSelectedType] = useState(TYPE_FROM_CAT[catFromUrl] || "");
  const [loadError, setLoadError] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const returnPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  const fetchJewellery = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");
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
      setLoadError("Failed to load jewellery. Please try again.");
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

  const handleImageError = useCallback((id) => {
    setErrorImages((prev) => new Set([...prev, id]));
  }, []);

  const resetFilters = () => {
    setSelectedFilter("");
    setSelectedMetal("");
    setSelectedType("");
  };

  const handleAddCarWithToken = async (id, token = accessToken) => {
    try {
      setAddingId(id);
      await post(
        "/cart",
        { productId: id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Added to cart");
    } catch (err) {
      if (err.response?.status === 401) {
        pendingProductId.current = id;
        setIsAuthModalOpen(true);
        toast.error("Please log in to add items to your cart.");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data?.message || "This piece could not be added.");
      } else {
        toast.error(err.response?.data?.message || "Failed to add to cart. Please try again.");
      }
    } finally {
      setAddingId(null);
    }
  };

  const handleAddToCart = (id) => {
    if (!accessToken) {
      pendingProductId.current = id;
      setIsAuthModalOpen(true);
      return;
    }
    handleAddCarWithToken(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfaf7]">
        <HeroSkeleton />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <FilterSkeleton />
          <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
    <div className="min-h-screen bg-[#fbfaf7]">
      <div className="relative bg-[#1a120c]">
        {!heroImageLoaded && <HeroSkeleton />}
        <Image
          src="/jwellery-banner.png"
          alt="Sunita Gemstones jewellery"
          width={1920}
          height={640}
          className={`w-full h-auto transition-opacity duration-500 ${
            heroImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setHeroImageLoaded(true)}
          onError={() => setHeroImageLoaded(true)}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[#BA8E49] mb-2">
            Handcrafted jewellery
          </p>
          <h1 className="font-display text-[2rem] sm:text-4xl lg:text-5xl text-[#1c1915] leading-tight">
            Find Your Unique Aesthetic
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6b645b]">
            Select a metal and style, then add a piece to your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 max-w-5xl mx-auto">
          <div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full h-11 bg-white border-[#e6dfd2] text-sm">
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

          <div>
          <Select value={selectedMetal} onValueChange={setSelectedMetal}>
            <SelectTrigger className="w-full h-11 bg-white border-[#e6dfd2] text-sm">
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

          <div className="sm:col-span-2 lg:col-span-1">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full h-11 bg-white border-[#e6dfd2] text-sm">
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

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(selectedFilter || selectedMetal || selectedType) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 text-xs tracking-wide uppercase bg-white border border-[#e6dfd2] hover:border-[#BA8E49] rounded-full"
              >
                Clear filters
              </button>
            )}
            {selectedFilter && (
              <span className="px-3 py-1.5 text-xs bg-white text-[#5c564e] border border-[#e6dfd2] rounded-full">
                {formatLabel(selectedFilter)}
              </span>
            )}
            {selectedMetal && (
              <span className="px-3 py-1.5 text-xs bg-white text-[#5c564e] border border-[#e6dfd2] rounded-full">
                {formatLabel(selectedMetal)}
              </span>
            )}
            {selectedType && (
              <span className="px-3 py-1.5 text-xs bg-white text-[#5c564e] border border-[#e6dfd2] rounded-full">
                {formatLabel(selectedType)}
              </span>
            )}
          </div>
          <p className="text-xs tracking-wide uppercase text-[#8a8176]">
            {filteredData.length} {filteredData.length === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {loadError ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-display text-[#1c1915] mb-3">{loadError}</h3>
            <button
              onClick={fetchJewellery}
              className="px-6 py-2.5 bg-[#1c1915] text-white text-sm rounded-full hover:bg-[#BA8E49]"
            >
              Retry
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-16 px-4">
            <h3 className="text-2xl font-display text-[#1c1915] mb-2">No jewellery found</h3>
            <p className="text-sm text-[#6b645b] mb-5 max-w-md mx-auto">
              {items.length === 0
                ? "Jewellery added from the admin portal will appear here."
                : "Try another metal, type, or category."}
            </p>
            {items.length > 0 && (
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#1c1915] text-white text-sm rounded-full hover:bg-[#BA8E49]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pb-8">
            {filteredData.map((item) => {
              const hasError = errorImages.has(item.id);
              const salePrice = Number(item.discountedPrice || item.originalPrice || 0);
              const originalPrice = Number(item.originalPrice || 0);
              const onSale = originalPrice > salePrice && salePrice > 0;
              const outOfStock = !item.isAvailable || Number(item.stock) === 0;
              const isAdding = addingId === item.id;

              return (
                <article
                  key={item.id}
                  className="flex flex-col h-full bg-white rounded-2xl border border-[#ebe4d6] overflow-hidden shadow-[0_8px_24px_rgba(28,25,21,0.04)]"
                >
                  <Link
                    href={`/products/${item.id}`}
                    className="relative block aspect-[4/5] bg-[#f7f5f0]"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title || "Jewellery"}
                      fill
                      sizes="(max-width: 520px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain object-center p-3 sm:p-4"
                      onError={() => handleImageError(item.id)}
                    />
                    {hasError && (
                      <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                        <p className="text-xs text-[#8a8176]">Image not available</p>
                      </div>
                    )}
                    {item.category !== "all" && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-wide uppercase bg-white/95 text-[#1c1915] rounded-full">
                        {item.category}
                      </span>
                    )}
                    {outOfStock && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] tracking-wide uppercase bg-[#1c1915] text-white rounded-full">
                        Sold out
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1 gap-2 p-3.5 sm:p-4">
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[#BA8E49] min-h-[1rem]">
                      {[formatLabel(item.type), formatLabel(item.metal)].filter(Boolean).join(" · ")}
                    </p>
                    <Link href={`/products/${item.id}`}>
                      <h2 className="font-display text-xl sm:text-[1.35rem] leading-snug text-[#1c1915] line-clamp-2 hover:text-[#BA8E49]">
                        {item.title}
                      </h2>
                    </Link>
                    <div className="mt-auto pt-2 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        {salePrice > 0 ? (
                          <p className="text-base font-medium text-[#1c1915]">
                            ₹{formatPrice(salePrice)}
                          </p>
                        ) : (
                          <p className="text-sm text-[#8a8176]">Price on request</p>
                        )}
                        {onSale && (
                          <p className="text-xs text-[#8a8176] line-through">₹{formatPrice(originalPrice)}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.id)}
                      disabled={outOfStock || isAdding}
                      className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1c1915] px-4 py-2.5 text-xs sm:text-sm tracking-wide text-white transition-colors hover:bg-[#BA8E49] disabled:cursor-not-allowed disabled:bg-[#cfc8bc]"
                    >
                      {isAdding ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      {outOfStock ? "Out of stock" : isAdding ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          pendingProductId.current = null;
          setIsAuthModalOpen(false);
        }}
        redirectTo={returnPath}
        onSuccess={async (session) => {
          const id = pendingProductId.current;
          pendingProductId.current = null;
          if (!id || !session?.accessToken) return;
          await handleAddCarWithToken(id, session.accessToken);
        }}
      />
    </div>
  );
}

export default function JewelryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfaf7]">
          <HeroSkeleton />
        </div>
      }
    >
      <Jewelry />
    </Suspense>
  );
}
