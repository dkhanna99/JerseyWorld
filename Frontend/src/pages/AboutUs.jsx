import React from "react";
import ShopImage from "../assets/shopimage.png";

const AboutUs = () => {
    return (
        <div className="bg-white w-full min-h-screen py-50 px-6 md:px-16 lg:px-32">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-black mb-4">About Jersey World</h1>
                <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                    Bringing you the best football jerseys from around the world. Quality, passion, and authenticity — that's the Jersey World promise.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <div className="flex justify-center">
                    <img
                        src={ShopImage}
                        alt="About Jersey World"
                        className="rounded-lg shadow-lg w-full max-w-md object-cover"
                    />
                </div>

                {/* Right: Content */}
                <div>
                    <h2 className="text-2xl font-semibold text-black mb-4">Our Story</h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Founded by a group of football fanatics, Jersey World was born out of a love for the beautiful game. We believe every fan deserves to wear their pride — whether it’s a national team jersey or your favorite club’s colors.
                    </p>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        From the latest home kits to rare fan merchandise, we curate only the best for you. All our jerseys are sourced with utmost care, ensuring top-notch quality and authenticity.
                    </p>

                    <h2 className="text-2xl font-semibold text-black mb-4 mt-8">Why Choose Us?</h2>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                        <li>Authentic, high-quality products</li>
                        <li>Wide range of club and national team jerseys</li>
                        <li>Fast, reliable shipping worldwide</li>
                        <li>Passionate customer support</li>
                    </ul>
                </div>
            </div>

            {/* Footer Section */}
            <div className="text-center mt-20">
                <h2 className="text-2xl font-semibold text-black mb-2">Join the Jersey World Family</h2>
                <p className="text-gray-600">
                    Wear your passion. Live the game.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;