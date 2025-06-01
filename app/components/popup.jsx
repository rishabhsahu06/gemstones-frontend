"use client";
import React, { useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';

const AstrologyPopup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        countryCode: '+91'
    });

    const [isOpen, setIsOpen] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-amber-700 transition-colors z-50"
            >
                Book Consultation
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all shadow-md"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Image */}
                    <div className="lg:w-1/2 relative overflow-hidden min-h-[400px] lg:min-h-[600px]">
                        <img
                            src="/popup-img.png"
                            alt="Astrology Zodiac Wheel"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="lg:w-1/2 p-6 lg:p-8">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                                Book Consultation Online Call
                            </h2>
                            <p className="text-gray-600 mb-6 text-sm lg:text-base">
                                Get Personalized Astrological Guidance from the Comfort of Your Home
                            </p>

                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Email Address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Phone No.
                                    </label>
                                    <div className="flex">
                                        <div className="relative">
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleInputChange}
                                                className="appearance-none bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                            >
                                                <option value="+91">+91</option>
                                                <option value="+1">+1</option>
                                                <option value="+44">+44</option>
                                                <option value="+86">+86</option>
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter Phone No."
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date Field */}
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">
                                        Appointment Date & Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                                            required
                                        />
                                        {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
                                    </div>
                                </div>

                                {/* Price Display */}
                                <div className="bg-amber-100 border border-amber-200 rounded-lg p-4 mt-6">
                                    <div className="text-center">
                                        <span className="text-amber-800 font-semibold text-lg">
                                            Rs. 1500.00/ 30 Min
                                        </span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mt-6"
                                >
                                    PAY NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstrologyPopup;