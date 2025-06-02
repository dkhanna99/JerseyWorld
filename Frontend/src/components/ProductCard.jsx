import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { addToCart } from "../redux/cartSlice.jsx";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

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

    const handleAddToCart = (e, product) => {
        e.stopPropagation(); // Prevent link navigation
        e.preventDefault();
        dispatch(addToCart(product));
        alert("Product Added Successfully!");
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div className="bg-white p-4 shadow rounded border transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between h-full">
                {/* Product Image */}
                <img
                    src={product.image}
                    alt={product.name}
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
                        className="mt-auto flex items-center justify-center w-8 h-8 bg-red-600 group text-white text-sm rounded-full hover:w-32 hover:bg-red-700 transition-all duration-300 overflow-hidden cursor-pointer"
                        onClick={(e) => handleAddToCart(e, product)}
                    >
                        <span className="group-hover:hidden">+</span>
                        <span className="hidden group-hover:block">Add to Cart</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;