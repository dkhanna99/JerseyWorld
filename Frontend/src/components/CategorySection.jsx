import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { API_ENDPOINTS } from "../config.js";

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.CATEGORIES);
                const data = await response.json();
                
                // Transform categories data
                const transformedCategories = data.map(category => ({
                    title: category.name,
                    imageUrl: category.images && category.images.length > 0 ? category.images[0] : '',
                    id: category._id
                }));
                
                setCategories(transformedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="text-2xl text-black">Loading categories...</div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="text-2xl text-black">Error loading categories</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12">
                {/* Heading Link */}
                <div className="text-center mb-8">
                    <Link
                        to="/categories"
                        className="inline-flex items-center gap-2 text-4xl font-extrabold !text-black !underline no-underline hover:no-underline group"
                    >
                        Categories
                        <FaArrowRight className="text-2xl !text-black transform transition-transform duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                    {categories.map((category, index) => (
                        <div
                            key={category.id || index}
                            className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                        >
                            <img
                                src={category.imageUrl}
                                alt={category.title}
                                className="w-24 h-24 object-contain mb-4"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mb-4 hidden">
                                <span className="text-gray-500 text-xs">{category.title}</span>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-black">{category.title}</p>
                                <p className="text-black mt-2 text-sm hover:underline">View All</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategorySection;