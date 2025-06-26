import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { addToCart } from "../redux/cartSlice.jsx";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addProductToCart } from "../utils/cartUtils.js";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const renderStars = () => {
        const stars = [];
        const rating = product.rating || 0;

        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} className="text-yellow-500" />);
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-500" />);
            }
        }
        return stars;
    };

    const handleAddToCart = async (e, product) => {
        e.stopPropagation(); 
        e.preventDefault();
        
        if (isAddingToCart) return; // Prevent multiple clicks
        
        try {
            setIsAddingToCart(true);
            
            console.log('Adding product to cart:', product.name, 'ID:', product.id);
            
            // Add to backend cart
            const updatedCart = await addProductToCart(product);
            console.log('Backend cart updated:', updatedCart);
            
            // Also add to Redux store for immediate UI update
            dispatch(addToCart(product));
            
        } catch (error) {
            console.error('Failed to add to cart:', error);
            // You could show a toast notification here
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div className="bg-white p-4 shadow rounded border transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between h-full">
                {/* Product Image */}
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-48 object-contain mb-4"
                />

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Name */}
                    <h3 className="text-lg font-semibold mb-2 text-black">{product.name}</h3>

                    {/* Price */}
                    <p className="text-gray-500 mb-2">${product.price}</p>

                    {/* Stars */}
                    <div className="flex items-center mb-4">
                        {renderStars()}
                    </div>

                    {/* Add to Cart Button */}
                    <div
                        className={`mt-auto flex items-center justify-center w-8 h-8 bg-red-600 group text-white text-sm rounded-full hover:w-32 hover:bg-red-700 transition-all duration-300 overflow-hidden cursor-pointer ${
                            isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => handleAddToCart(e, product)}
                    >
                        <span className="group-hover:hidden">
                            {isAddingToCart ? '...' : '+'}
                        </span>
                        <span className="hidden group-hover:block">
                            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;