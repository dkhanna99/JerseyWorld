import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { API_ENDPOINTS } from "../config.js";

const Categories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories
                const categoriesResponse = await fetch(API_ENDPOINTS.CATEGORIES);
                const categoriesData = await categoriesResponse.json();
                
                // Transform categories data
                const transformedCategories = categoriesData.map(category => ({
                    title: category.name,
                    imageUrl: category.images && category.images.length > 0 ? category.images[0] : '',
                    id: category._id
                }));
                
                setCategories(transformedCategories);
                
                // Fetch products
                const productsResponse = await fetch(API_ENDPOINTS.PRODUCTS);
                const productsData = await productsResponse.json();
                
                // Transform products data to match expected format
                const transformedProducts = productsData.map((product, index) => ({
                    id: product._id || index + 1,
                    image: product.image && product.image.length > 0 ? product.image[0] : '',
                    name: product.name,
                    description: product.description,
                    price: product.basePrice,
                    rating: product.rating,
                    category: product.category ? product.category.name : 'Uncategorized',
                    hasVariants: product.hasVariants || false,
                    variants: product.variants || []
                }));
                
                setProducts(transformedProducts);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoryClick = (category) => {
        if (category === selectedCategory) {
            setSelectedCategory(null); 
        } else {
            setSelectedCategory(category);
        }
    };

    const filteredProducts = selectedCategory
        ? products.filter((product) => product.category === selectedCategory)
        : products;

    if (loading) return <div className="text-center py-20 text-2xl text-black">Loading...</div>;
    
    if (error) return <div className="text-center py-20 text-2xl text-black">Error: {error}</div>;

    return (
        <div className="bg-white min-h-screen px-4 py-40 container mx-auto">
            {/* Categories */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-6 text-black">Categories</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={category.id || index}
                            onClick={() => handleCategoryClick(category.title)}
                            className={`flex flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer
                              ${selectedCategory === category.title ? 'bg-red-100 border-red-500' : ''}`}
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