import React, { useState } from "react";
import { mockData } from "../assets/mockData.jsx"; 
import club from '../assets/club.png';
import nation from '../assets/nations.png';
import kidslogo from '../assets/kidslogo.png';
import fanmerch from '../assets/fanmerch.png';
import training from '../assets/training.png';
import ProductCard from "../components/ProductCard.jsx";

const categories = [
    { title: 'Clubs', imageUrl: club },
    { title: 'Nations', imageUrl: nation },
    { title: 'Kids', imageUrl: kidslogo },
    { title: 'Fan Merch', imageUrl: fanmerch },
    { title: 'Training', imageUrl: training },
];

const Categories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        if (category === selectedCategory) {
            setSelectedCategory(null); 
        } else {
            setSelectedCategory(category);
        }
    };

    const filteredProducts = selectedCategory
        ? mockData.filter((product) => product.category === selectedCategory)
        : mockData;

    return (
        <div className="bg-white min-h-screen px-4 py-40 container mx-auto">
            {/* Categories */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-6 text-black">Categories</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            onClick={() => handleCategoryClick(category.title)}
                            className={`flex flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer
                              ${selectedCategory === category.title ? 'bg-red-100 border-red-500' : ''}`}
                        >
                            <img
                                src={category.imageUrl}
                                alt={category.title}
                                className="w-24 h-24 object-contain mb-4"
                            />
                            <p className="text-lg font-semibold text-black">{category.title}</p>
                            <p className="text-black mt-2 text-sm hover:underline">
                                {selectedCategory === category.title ? "Selected" : "View All"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-6 text-black">
                    {selectedCategory ? `${selectedCategory} Products` : "All Products"}
                </h2>
                {filteredProducts.length === 0 ? (
                    <p className="text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories