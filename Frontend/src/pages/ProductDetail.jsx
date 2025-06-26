import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaCarSide, FaQuestion } from 'react-icons/fa';
import { addToCart } from "../redux/cartSlice.jsx";
import { API_ENDPOINTS } from '../config.js';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const safeQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
        dispatch(addToCart({ ...product, quantity: safeQuantity }));
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
                
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                
                const data = await response.json();
                
                // Transform API data to match expected format
                const transformedProduct = {
                    id: data._id,
                    image: data.image && data.image.length > 0 ? data.image[0] : '',
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    rating: data.rating,
                    category: data.category ? data.category.name : 'Uncategorized'
                };
                
                setProduct(transformedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) return <div className="text-center py-20 text-2xl text-black">Loading ....</div>;
    
    if (error) return <div className="text-center py-20 text-2xl text-black">Error: {error}</div>;
    
    if (!product) return <div className="text-center py-20 text-2xl text-black">Product not found</div>;

    return (
        <div className="container mx-auto py-60 px-4 md:px-16 lg:px-24 bg-white">
            <div className="flex flex-col md:flex-row gap-x-16">
                {/* Product Image */}
                <div className="md:w-1/2 py-4 shadow-md md:px-8 h-96 flex justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain"
                    />
                </div>

                {/* Product Information */}
                <div className="md:w-1/2 p-4 shadow-md md:px-16 flex flex-col items-center gap-y-4">
                    <h2 className="text-3xl font-semibold mb-2 text-center text-black">{product.name}</h2>
                    <p className="text-xl font-semibold text-black mb-4">${product.price}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center mb-4 gap-x-2">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="!bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition"
                        >
                            -
                        </button>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            readOnly
                            className="border p-2 w-16 text-center text-black bg-gray-100 rounded"
                        />
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="!bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition"
                        >
                            +
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="!bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition duration-300"
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Delivery & Return Section */}
                    <div className="flex flex-col gap-y-4 mt-4">
                        <p className="flex items-center text-black">
                            <FaCarSide className="mr-2" />
                            Delivery & Return
                        </p>
                        <p className="flex items-center text-black">
                            <FaQuestion className="mr-2" />
                            Ask a Question
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Description */}
            <div className="mt-12">
                <h3 className="text-xl font-bold mb-2 text-black">Product Description</h3>
                <p className="text-black"><b>{product.description}</b>.</p>
            </div>
        </div>
    );
};

export default ProductDetail;