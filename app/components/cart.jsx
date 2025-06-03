"use client"
import { useState } from "react"
import { MapPin, Plus, Minus } from "lucide-react"

function Cart() {
    const [quantity, setQuantity] = useState(1)
    const [pincode, setPincode] = useState("480661")

    const basePrice = 40900
    const totalPrice = basePrice * quantity

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1)
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1)
        }
    }

    return (
        <div className="container mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Product Image */}
                <div className="flex justify-center items-center">
                    <div className="relative w-full max-w-md aspect-square">
                        <img
                            src="/yellow-stone-cart.png"
                            alt="Yellow Sapphire (Pukhraj)"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6 mt-12">
                    {/* Title and Price */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Yellow Sapphire (Pukhraj)</h1>
                        <p className="text-3xl font-bold text-gray-900">Rs. {basePrice.toLocaleString()}.00</p>
                    </div>

                    {/* Product Info Grid */}
                    <div className="grid grid-cols-1 gap-3 text-base">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">SKU :</span>
                            <span className="text-gray-700">GM01953</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Origin :</span>
                            <span className="text-gray-700">Sri Lanka</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Certification :</span>
                            <span className="text-gray-700">Free Lab Certificate</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Pooja / Energization :</span>
                            <span className="text-gray-700">No Energization</span>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Delivery Details :</h3>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#BA8E49] focus:border-transparent"
                                placeholder="Enter pincode"
                            />
                        </div>
                        <p className="text-sm text-gray-600 text-right">
                            <span className="font-semibold">Expected Dispatch Date: 05 Jun, 2025</span>
                        </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 text-base">Qty :</span>
                            <span className="text-gray-700 text-base">{quantity}</span>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-6 bg-white">
                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Minus className="w-4 h-4 text-gray-600" />
                                </button>

                                <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">{quantity}</span>

                                <button
                                    onClick={incrementQuantity}
                                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sub Total */}
                    <div className="border-t border-gray-200 pt-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-900">Sub Total</span>
                            <span className="text-xl font-bold text-gray-900">RS. {totalPrice.toLocaleString()}.00</span>
                        </div>

                        {/* Checkout Button */}
                        <button className="w-full py-4 text-base font-semibold bg-[#BA8E49] text-white rounded-lg transition-colors duration-200 tracking-wide">
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart