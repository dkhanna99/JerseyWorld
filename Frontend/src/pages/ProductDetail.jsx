import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaCarSide, FaQuestion } from 'react-icons/fa';
import { fetchProducts } from '../redux/productSlice';
import {addToCart} from "../redux/cartSlice.jsx";

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const products = useSelector((state) => state.products?.products) || [];
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState(1);
    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(addToCart(product));
    };

    useEffect(() => {
        const newProduct = products.find(product => product.id === parseInt(id));
        setProduct(newProduct);
    }, [id, products]);

    if (!product) return <div className="text-center py-20 text-2xl text-black">Loading ....</div>;

    return (
        <div className="container mx-auto py-60 px-4 md:px-16 lg:px-24 bg-white">
            <div className="flex flex-col md:flex-row gap-x-16">
                {/* Product Image */}
                <div className="md:w-1/2 py-4 shadow-md md:px-8 h-96 flex justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full object-contain "
                    />
                </div>

                {/* Product Information */}
                <div className="md:w-1/2 p-4 shadow-md md:px-16 flex flex-col items-center gap-y-4">
                    <h2 className="text-3xl font-semibold mb-2 text-center text-black">{product.name}</h2>
                    <p className="text-xl font-semibold text-black mb-4">${product.price}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center mb-4 gap-x-2">
                        <button
                            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
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
                            onClick={() => setQuantity(quantity + 1)}
                            className="!bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 transition"
                        >
                            +
                        </button>
                        <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="!bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition duration-300"
                        >
                            Add to Cart
                        </button>
                        {/*<button className="!bg-red-600 text-white py-2 px-6 rounded hover:bg-red-800 transform hover:scale-105 transition-transform duration-300 ml-4">
                            Add to Cart
                        </button>*/}
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