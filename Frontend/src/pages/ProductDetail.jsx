import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaCarSide, FaQuestion } from 'react-icons/fa';

const ProductDetail = () => {
    const { id } = useParams();
    const productState = useSelector((state) => state.product);  // 🛑 Get full product slice safely
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (productState && productState.products && productState.products.length > 0) {
            const newProduct = productState.products.find((product) => product.id === parseInt(id));
            setProduct(newProduct);
        }
    }, [id, productState]);

    if (!product) return <div className="text-center py-20 text-2xl text-gray-600">Loading ....</div>;

    return (
        <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
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
                    <h2 className="text-3xl font-semibold mb-2 text-center">{product.name}</h2>
                    <p className="text-xl font-semibold text-gray-800 mb-4">${product.price}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center mb-4 gap-x-2">
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="border p-1 w-16 text-center"
                        />
                        {/* Add to Cart Button */}
                        <button className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-800 transition">
                            Add to Cart
                        </button>
                    </div>

                    {/* Delivery & Return Section */}
                    <div className="flex flex-col gap-y-4 mt-4">
                        <p className="flex items-center text-gray-700">
                            <FaCarSide className="mr-2" />
                            Delivery & Return
                        </p>
                        <p className="flex items-center text-gray-700">
                            <FaQuestion className="mr-2" />
                            Ask a Question
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Description */}
            <div className="mt-12">
                <h3 className="text-xl font-bold mb-2">Product Description</h3>
                <p className="text-gray-600">Product description will goes here for <b>{product.name}</b>.</p>
            </div>
        </div>
    );
};

export default ProductDetail;