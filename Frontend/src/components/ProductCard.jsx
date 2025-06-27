import React, { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaPalette, FaRuler } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice.jsx";
import { addProductToCart } from "../utils/cartUtils.js";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const renderStars = () => {
        const stars = [];
        const rating = product.rating || 0;
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
            else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
            else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
        }
        return stars;
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isAddingToCart) return;

        if (product.availableColors?.length > 0 || product.availableSizes?.length > 0) {
            navigate(`/product/${product.id}`);
            return;
        }

        try {
            setIsAddingToCart(true);
            const updatedCart = await addProductToCart(product);
            dispatch(addToCart(product));
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const getPriceDisplay = () => {
        const price = product.price ?? product.variants?.[0]?.price;
        return price ? `$${price}` : "Price not available";
    };

    const hasOptions = product.availableColors?.length > 0 || product.availableSizes?.length > 0;

    useEffect(() => {
        if (product.availableColors?.length > 0 && !selectedColor) {
            setSelectedColor(product.availableColors[0]);
        }
        if (product.availableSizes?.length > 0 && !selectedSize) {
            setSelectedSize(product.availableSizes[0]);
        }
    }, [product]);

    return (
        <div className="bg-white p-4 shadow rounded border transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between h-full">
            <Link to={`/product/${product.id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-48 object-contain mb-4 cursor-pointer"
                />
            </Link>

            <div className="flex-1 flex flex-col justify-between">
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-black cursor-pointer hover:text-red-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-500 mb-2">{getPriceDisplay()}</p>

                {hasOptions && (
                    <div className="mb-3 space-y-2">
                        {product.availableColors?.length > 0 && (
                            <div>
                                <div className="flex items-center mb-1">
                                    <FaPalette className="mr-1 text-xs text-gray-600" />
                                    <span className="text-xs font-bold text-gray-700">Color:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {product.availableColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSelectedColor(color);
                                            }}
                                            className={`transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                                                selectedColor === color ? 'scale-110 shadow-sm ring-2 ring-red-200' : ''
                                            }`}
                                            style={{
                                                backgroundColor: color.startsWith('#') ? color :
                                                    ({
                                                        White: '#ffffff', Black: '#000000', Red: '#ff0000',
                                                        Blue: '#0000ff', Green: '#00ff00', Yellow: '#ffff00',
                                                        Purple: '#800080', Orange: '#ffa500', Pink: '#ffc0cb',
                                                        Brown: '#a52a2a', Gray: '#808080'
                                                    }[color] ?? '#cccccc'),
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: selectedColor === color ? '2px solid #ef4444' : '2px solid #d1d5db',
                                                boxSizing: 'border-box',
                                                padding: '10px'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.availableSizes?.length > 0 && (
                            <div>
                                <div className="flex items-center mb-1">
                                    <FaRuler className="mr-1 text-xs text-gray-600" />
                                    <span className="text-xs font-bold text-gray-700">Size:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {product.availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSelectedSize(size);
                                            }}
                                            className={`bg-white px-1.5 py-0.5 text-xs rounded border transition-all duration-200 hover:scale-105 ${
                                                selectedSize === size
                                                    ? '!bg-red-500 !text-white !border-red-500 !shadow-sm'
                                                    : '!bg-white !text-black !border-black hover:!border-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center mb-4">{renderStars()}</div>

                <div
                    className={`mt-auto flex items-center justify-center w-8 h-8 bg-red-600 group text-white text-sm rounded-full hover:w-32 hover:bg-red-700 transition-all duration-300 overflow-hidden cursor-pointer ${
                        isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleAddToCart}
                >
                    <span className="group-hover:hidden">
                        {isAddingToCart ? '...' : hasOptions ? '→' : '+'}
                    </span>
                    <span className="hidden group-hover:block">
                        {isAddingToCart ? 'Adding...' : hasOptions ? 'Select Options' : 'Add to Cart'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;