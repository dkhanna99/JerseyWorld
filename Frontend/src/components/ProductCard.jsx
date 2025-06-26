import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaPalette, FaRuler } from "react-icons/fa";
import { addToCart } from "../redux/cartSlice.jsx";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addProductToCart } from "../utils/cartUtils.js";

const ProductCard = ({ product }) => {
    console.log(product);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

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
        
        console.log('Product card clicked:', product.name, 'hasVariants:', product.hasVariants, 'availableColors:', product.availableColors, 'availableSizes:', product.availableSizes);
        
        // If product has available colors or sizes, redirect to product detail page
        if (product.availableColors?.length > 0 || product.availableSizes?.length > 0) {
            console.log('Product has options, redirecting to product detail page');
            navigate(`/product/${product.id}`);
            return;
        }
        
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

    // Get price display
    const getPriceDisplay = () => {
        return `$${product.price}`;
    };

    // Check if product has options
    const hasOptions = (product.availableColors?.length > 0 || product.availableSizes?.length > 0);

    // Set default selections when component mounts or product changes
    React.useEffect(() => {
        if (product.availableColors?.length > 0 && !selectedColor) {
            setSelectedColor(product.availableColors[0]);
        }
        if (product.availableSizes?.length > 0 && !selectedSize) {
            setSelectedSize(product.availableSizes[0]);
        }
    }, [product]);

    return (
        <div className="bg-white p-4 shadow rounded border transform transition-transform duration-300 hover:scale-105 flex flex-col justify-between h-full">
            {/* Product Image */}
            <Link to={`/product/${product.id}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-48 object-contain mb-4 cursor-pointer"
                />
            </Link>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                {/* Name */}
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-black cursor-pointer hover:text-red-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <p className="text-gray-500 mb-2">{getPriceDisplay()}</p>

                {/* Color and Size Selection */}
                {hasOptions && (
                    <div className="mb-3 space-y-2">
                        {/* Color Selection */}
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
                                                selectedColor === color 
                                                    ? 'scale-110 shadow-sm ring-2 ring-red-200' 
                                                    : ''
                                            }`}
                                            style={{
                                                backgroundColor: color.startsWith('#') ? color : 
                                                    color === 'White' ? '#ffffff' :
                                                    color === 'Black' ? '#000000' :
                                                    color === 'Red' ? '#ff0000' :
                                                    color === 'Blue' ? '#0000ff' :
                                                    color === 'Green' ? '#00ff00' :
                                                    color === 'Yellow' ? '#ffff00' :
                                                    color === 'Purple' ? '#800080' :
                                                    color === 'Orange' ? '#ffa500' :
                                                    color === 'Pink' ? '#ffc0cb' :
                                                    color === 'Brown' ? '#a52a2a' :
                                                    color === 'Gray' ? '#808080' :
                                                    '#cccccc',
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

                        {/* Size Selection */}
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
                                                    ? 'bg-red-500 text-white border-red-500 shadow-sm' 
                                                    : 'bg-white text-black border-black hover:border-gray-600 hover:bg-gray-50'
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