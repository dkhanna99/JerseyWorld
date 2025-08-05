import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaCarSide, FaQuestion } from 'react-icons/fa';
import { addToCart } from "../redux/cartSlice.jsx";
import { API_ENDPOINTS } from '../config.js';
import { addProductToCart } from '../utils/cartUtils.js';

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const productData = await response.json();
                setProduct(productData);
                
                // Set default color and size if available
                if (productData.hasVariants && productData.variants && productData.variants.length > 0) {
                    const firstVariant = productData.variants[0];
                    setSelectedColor(firstVariant.color);
                    setSelectedSize(firstVariant.size);
                    setSelectedVariant(firstVariant);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
      
        fetchProduct();
    }, [id]);

    // Update selected variant when color or size changes
    useEffect(() => {
        if (product && product.hasVariants && product.variants) {
            const variant = product.variants.find(v => 
                v.color === selectedColor && v.size === selectedSize
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedColor, selectedSize, product]);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (isAddingToCart) return;
        
        try {
            setIsAddingToCart(true);
            
            // Validate variant selection if product has variants
            if (product.hasVariants && !selectedVariant) {
                alert('Please select a color and size');
                return;
            }
            
            const safeQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
            
            // Prepare product data for cart
            const productForCart = {
                ...product,
                quantity: safeQuantity,
                price: selectedVariant ? selectedVariant.price : product.basePrice,
                attributeId: selectedVariant ? selectedVariant._id : null
            };
            
            // Add to backend cart
            await addProductToCart(productForCart);
            
            // Also add to Redux store for immediate UI update
            dispatch(addToCart(productForCart));
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Function to convert hex color to readable name
    const getColorName = (color) => {
        if (!color) return 'Unknown';
        
        // If it's already a color name, return it
        if (!color.startsWith('#')) {
            return color;
        }
        
        // Convert hex to color name
        const colorMap = {
            '#000000': 'Black',
            '#FF0000': 'Red',
            '#0000FF': 'Blue',
            '#FFFF00': 'Yellow',
            '#00FFFF': 'Cyan',
            '#800080': 'Purple',
            '#FFC0CB': 'Pink',
            '#A52A2A': 'Brown',
            '#808080': 'Gray',
            '#D2691E': 'Chocolate',
            '#FF7F50': 'Coral',
            '#6495ED': 'Cornflower Blue',
            '#DC143C': 'Crimson',
            '#B8860B': 'Dark Goldenrod',
            '#A9A9A9': 'Dark Gray',
            '#006400': 'Dark Green',
            '#BDB76B': 'Dark Khaki',
            '#8B008B': 'Dark Magenta',
            '#556B2F': 'Dark Olive Green',
            '#FF8C00': 'Dark Orange',
            '#9932CC': 'Dark Orchid',
            '#8B0000': 'Dark Red',
            '#E9967A': 'Dark Salmon',
            '#8FBC8F': 'Dark Sea Green',
            '#483D8B': 'Dark Slate Blue',
            '#2F4F4F': 'Dark Slate Gray',
            '#00CED1': 'Dark Turquoise',
            '#9400D3': 'Dark Violet',
            '#FF1493': 'Deep Pink',
            '#00BFFF': 'Deep Sky Blue',
            '#696969': 'Dim Gray',
            '#1E90FF': 'Dodger Blue',
            '#B22222': 'Fire Brick',
            '#FFFAF0': 'Floral White',
            '#228B22': 'Forest Green',
            '#DCDCDC': 'Gainsboro',
            '#F8F8FF': 'Ghost White',
            '#FFD700': 'Gold',
            '#DAA520': 'Goldenrod',
            '#008000': 'Green',
            '#ADFF2F': 'Green Yellow',
            '#F0FFF0': 'Honeydew',
            '#FF69B4': 'Hot Pink',
            '#CD5C5C': 'Indian Red',
            '#4B0082': 'Indigo',
            '#FFFFF0': 'Ivory',
            '#F0E68C': 'Khaki',
            '#E6E6FA': 'Lavender',
            '#FFF0F5': 'Lavender Blush',
            '#7CFC00': 'Lawn Green',
            '#FFFACD': 'Lemon Chiffon',
            '#ADD8E6': 'Light Blue',
            '#F08080': 'Light Coral',
            '#E0FFFF': 'Light Cyan',
            '#FAFAD2': 'Light Goldenrod Yellow',
            '#90EE90': 'Light Green',
            '#D3D3D3': 'Light Gray',
            '#FFB6C1': 'Light Pink',
            '#FFA07A': 'Light Salmon',
            '#20B2AA': 'Light Sea Green',
            '#87CEFA': 'Light Sky Blue',
            '#778899': 'Light Slate Gray',
            '#B0C4DE': 'Light Steel Blue',
            '#FFFFE0': 'Light Yellow',
            '#00FF00': 'Lime',
            '#FAF0E6': 'Linen',
            '#FF00FF': 'Magenta',
            '#800000': 'Maroon',
            '#66CDAA': 'Medium Aquamarine',
            '#0000CD': 'Medium Blue',
            '#BA55D3': 'Medium Orchid',
            '#9370DB': 'Medium Purple',
            '#3CB371': 'Medium Sea Green',
            '#7B68EE': 'Medium Slate Blue',
            '#00FA9A': 'Medium Spring Green',
            '#48D1CC': 'Medium Turquoise',
            '#C71585': 'Medium Violet Red',
            '#191970': 'Midnight Blue',
            '#F5FFFA': 'Mint Cream',
            '#FFE4E1': 'Misty Rose',
            '#FFE4B5': 'Moccasin',
            '#FFDEAD': 'Navajo White',
            '#000080': 'Navy',
            '#FDF5E6': 'Old Lace',
            '#808000': 'Olive',
            '#6B8E23': 'Olive Drab',
            '#FFA500': 'Orange',
            '#FF4500': 'Orange Red',
            '#DA70D6': 'Orchid',
            '#EEE8AA': 'Pale Goldenrod',
            '#98FB98': 'Pale Green',
            '#AFEEEE': 'Pale Turquoise',
            '#DB7093': 'Pale Violet Red',
            '#FFEFD5': 'Papaya Whip',
            '#FFDAB9': 'Peach Puff',
            '#CD853F': 'Peru',
            '#DDA0DD': 'Plum',
            '#B0E0E6': 'Powder Blue',
            '#BC8F8F': 'Rosy Brown',
            '#4169E1': 'Royal Blue',
            '#8B4513': 'Saddle Brown',
            '#FA8072': 'Salmon',
            '#F4A460': 'Sandy Brown',
            '#2E8B57': 'Sea Green',
            '#FFF5EE': 'Seashell',
            '#A0522D': 'Sienna',
            '#C0C0C0': 'Silver',
            '#87CEEB': 'Sky Blue',
            '#6A5ACD': 'Slate Blue',
            '#708090': 'Slate Gray',
            '#FFFAFA': 'Snow',
            '#00FF7F': 'Spring Green',
            '#4682B4': 'Steel Blue',
            '#D2B48C': 'Tan',
            '#008080': 'Teal',
            '#D8BFD8': 'Thistle',
            '#FF6347': 'Tomato',
            '#40E0D0': 'Turquoise',
            '#EE82EE': 'Violet',
            '#F5DEB3': 'Wheat',
            '#FFFFFF': 'White',
            '#F5F5F5': 'White Smoke',
            '#9ACD32': 'Yellow Green'
        };
        
        return colorMap[color.toUpperCase()] || color;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h2>
                </div>
            </div>
        );
    }

    const currentPrice = selectedVariant ? selectedVariant.price : product.basePrice;
    const availableColors = product.hasVariants ? [...new Set(product.variants.map(v => v.color))] : [];
    const availableSizes = product.hasVariants ? [...new Set(product.variants.map(v => v.size))] : [];

    return (
        <div style={{'margin-top': '160px'}} className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="space-y-4">
                            <img
                                src={product.image && product.image.length > 0 ? product.image[0] : ''}
                                alt={product.name}
                                className="w-full h-96 object-contain rounded-lg"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-gray-600 text-lg">{product.description}</p>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-red-600">${currentPrice}</span>
                                {product.hasVariants && selectedVariant && (
                                    <span className="text-sm text-gray-500">
                                        {getColorName(selectedVariant.color)} - {selectedVariant.size}
                                    </span>
                                )}
                            </div>

                            {/* Variant Selection */}
                            {product.hasVariants && product.variants && product.variants.length > 0 && (
                                <div className="space-y-4">
                                    {/* Color Selection */}
                                    {availableColors.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Color</h3>
                                            <div className="flex space-x-2">
                                                {availableColors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
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
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            border: selectedColor === color ? '3px solid #ef4444' : '3px solid #d1d5db',
                                                            boxSizing: 'border-box'
                                                        }}
                                                        title={getColorName(color)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Size Selection */}
                                    {availableSizes.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Size</h3>
                                            <div className="flex space-x-2">
                                                {availableSizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                                            selectedSize === size
                                                                ? 'border-red-600 bg-red-50 text-red-600'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Stock Information */}
                                    {selectedVariant && (
                                        <div className="text-sm text-gray-600">
                                            Stock: {selectedVariant.stock} available
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quantity and Add to Cart */}
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
                                    disabled={isAddingToCart || (product.hasVariants && !selectedVariant)}
                                    className={`!bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition duration-300 ${
                                        isAddingToCart || (product.hasVariants && !selectedVariant)
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                >
                                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
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
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;