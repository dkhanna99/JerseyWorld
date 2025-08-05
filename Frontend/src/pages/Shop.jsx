import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { API_ENDPOINTS } from '../config.js';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.PRODUCTS);
                const data = await response.json();
                
                // Transform API data to match expected format
                const transformedProducts = data.map((product, index) => ({
                    id: product._id || index + 1,
                    image: product.image && product.image.length > 0 ? product.image[0] : '',
                    name: product.name,
                    description: product.description,
                    price: product.basePrice,
                    rating: product.rating,
                    category: product.category ? product.category.name : 'Uncategorized',
                    hasVariants: product.hasVariants || false,
                    variants: product.variants || [],
                    availableColors: product.availableColors || [],
                    availableSizes: product.availableSizes || []
                }));
                
                setProducts(transformedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="bg-white mx-auto py-50 px-4 md:px-16 lg:px-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white mx-auto py-50 px-4 md:px-16 lg:px-24">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-black inline-block border-b-4 border-red-500 pb-2">
                All Products
            </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;