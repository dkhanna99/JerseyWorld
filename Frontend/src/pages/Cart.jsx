import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {Link, Navigate} from 'react-router-dom';
import EmptyCart from '../assets/empty-cart.png';
import { FaTrashAlt } from "react-icons/fa";
import {removeFromCart, increaseQuantity, decreaseQuantity} from "../redux/cartSlice.jsx";
import { getCartWithProducts, removeProductFromCart, updateProductQuantity } from "../utils/cartUtils.js";

const Cart = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState('main street, 0012');
    const [updatingQuantities, setUpdatingQuantities] = useState({});
    const dispatch = useDispatch();

    // Fetch cart data from backend
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                setLoading(true);
                const cart = await getCartWithProducts();
                setCartData(cart);
            } catch (error) {
                console.error('Error fetching cart:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    // Handle remove product
    const handleRemoveProduct = async (productId, attributeId = null) => {
        try {
            console.log('Removing product with ID:', productId, 'and attributeId:', attributeId);
            console.log('Product ID type:', typeof productId);
            
            // If productId is an object, extract the actual ID
            const actualProductId = typeof productId === 'object' ? productId._id || productId.id : productId;
            console.log('Actual product ID to remove:', actualProductId);
            
            await removeProductFromCart(actualProductId, attributeId);
            // Refresh cart data
            const updatedCart = await getCartWithProducts();
            setCartData(updatedCart);
            // Also update Redux store with variant info
            dispatch(removeFromCart({ id: actualProductId, attributeId }));
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    // Handle increase quantity
    const handleIncreaseQuantity = async (productId, currentQuantity, attributeId = null) => {
        try {
            console.log('Increasing quantity for product:', productId, 'from', currentQuantity, 'to', currentQuantity + 1);
            
            // Set loading state for this specific product
            const itemKey = attributeId ? `${productId}_${attributeId}` : productId;
            setUpdatingQuantities(prev => ({ ...prev, [itemKey]: true }));
            
            await updateProductQuantity(productId, currentQuantity + 1, attributeId);
            console.log('Backend update completed');
            
            // Refresh cart data
            const updatedCart = await getCartWithProducts();
            console.log('Fetched updated cart:', updatedCart);
            setCartData(updatedCart);
            
            // Also update Redux store with variant info
            dispatch(increaseQuantity({ id: productId, attributeId }));
            
            console.log('UI should now show updated quantity');
        } catch (error) {
            console.error('Error increasing quantity:', error);
        } finally {
            // Clear loading state
            const itemKey = attributeId ? `${productId}_${attributeId}` : productId;
            setUpdatingQuantities(prev => ({ ...prev, [itemKey]: false }));
        }
    };

    // Handle decrease quantity
    const handleDecreaseQuantity = async (productId, currentQuantity, attributeId = null) => {
        if (currentQuantity <= 1) {
            // Remove product if quantity would become 0
            await handleRemoveProduct(productId, attributeId);
            return;
        }
        
        try {
            console.log('Decreasing quantity for product:', productId, 'from', currentQuantity, 'to', currentQuantity - 1);
            
            // Set loading state for this specific product
            const itemKey = attributeId ? `${productId}_${attributeId}` : productId;
            setUpdatingQuantities(prev => ({ ...prev, [itemKey]: true }));
            
            await updateProductQuantity(productId, currentQuantity - 1, attributeId);
            console.log('Backend update completed');
            
            // Refresh cart data
            const updatedCart = await getCartWithProducts();
            console.log('Fetched updated cart:', updatedCart);
            setCartData(updatedCart);
            
            // Also update Redux store with variant info
            dispatch(decreaseQuantity({ id: productId, attributeId }));
            
            console.log('UI should now show updated quantity');
        } catch (error) {
            console.error('Error decreasing quantity:', error);
        } finally {
            // Clear loading state
            const itemKey = attributeId ? `${productId}_${attributeId}` : productId;
            setUpdatingQuantities(prev => ({ ...prev, [itemKey]: false }));
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        if (!cartData || !cartData.items) return { totalQuantity: 0, totalPrice: 0 };
        
        const totalQuantity = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return { totalQuantity, totalPrice };
    };

    const { totalQuantity, totalPrice } = calculateTotals();

    // Debug: Log current cart data
    console.log('Current cart data for rendering:', cartData);
    console.log('Cart items:', cartData?.items);

    if (loading) {
        return (
            <div className="min-h-[90vh] w-screen flex items-center justify-center bg-white">
                <div className="text-2xl text-black">Loading cart...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[90vh] w-screen flex items-center justify-center bg-white">
                <div className="text-2xl text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] w-screen flex items-center justify-center bg-white px-4 py-8">
            {cartData && cartData.items && cartData.items.length > 0 ? (
                <div className="w-full max-w-6xl">
                    <h3 className="text-2xl font-semibold mb-8 text-center text-black">SHOPPING CART</h3>

                    {/* Flex Container */}
                    <div className="flex flex-col md:flex-row justify-between gap-12">
                        {/* Product List */}
                        <div className="flex-1 space-y-6">
                            {/* Table Header */}
                            <div className="hidden md:flex justify-between font-semibold text-black border-b pb-4 mb-6 text-sm">
                                <p className="w-2/5">PRODUCT</p>
                                <div className="flex justify-between w-3/5">
                                    <p>PRICE</p>
                                    <p>QUANTITY</p>
                                    <p>SUBTOTAL</p>
                                    <p>REMOVE</p>
                                </div>
                            </div>

                            {/* Product Rows */}
                            {cartData.items.map((item) => {
                                // Extract the actual product ID
                                const actualProductId = typeof item.productId === 'object' ? item.productId._id || item.productId.id : item.productId;
                                // Create unique key for loading state
                                const itemKey = item.attributeId ? `${actualProductId}_${item.attributeId}` : actualProductId;
                                
                                return (
                                    <div key={itemKey} className="flex flex-col md:flex-row items-center justify-between border-b pb-6">
                                        {/* Product Info */}
                                        <div className="flex items-center space-x-4 w-full md:w-2/5">
                                            <img
                                                src={item.product?.image || ''}
                                                alt={item.product?.name || 'Product'}
                                                className="w-24 h-24 object-contain rounded"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-black">{item.product?.name || 'Product'}</h3>
                                                {/* Show variant information if available */}
                                                {item.attributeId && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        <span className="mr-2">
                                                            Color: {item.attributeId.color}
                                                        </span>
                                                        <span>
                                                            Size: {item.attributeId.size}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price | Quantity | Subtotal | Remove */}
                                        <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-3/5 mt-4 md:mt-0 space-y-4 md:space-y-0">
                                            <p className="text-black">${item.price}</p>

                                            <div className="flex items-center border rounded overflow-hidden focus:outline-none">
                                                <button 
                                                    className={`text-lg font-bold px-3 py-1 !bg-gray-800 text-white hover:!bg-gray-600 border-r transition-colors duration-200 focus:outline-none ${
                                                        updatingQuantities[itemKey] ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    onClick={() => handleDecreaseQuantity(actualProductId, item.quantity, item.attributeId)}
                                                    disabled={updatingQuantities[itemKey]}
                                                >
                                                    {updatingQuantities[itemKey] ? '...' : '-'}
                                                </button>
                                                <p className="px-4 text-black bg-white">
                                                    {updatingQuantities[itemKey] ? '...' : item.quantity}
                                                </p>
                                                <button 
                                                    className={`text-lg font-bold px-3 py-1 !bg-gray-800 text-white hover:!bg-gray-600 border-l transition-colors duration-200 focus:outline-none ${
                                                        updatingQuantities[itemKey] ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                    onClick={() => handleIncreaseQuantity(actualProductId, item.quantity, item.attributeId)}
                                                    disabled={updatingQuantities[itemKey]}
                                                >
                                                    {updatingQuantities[itemKey] ? '...' : '+'}
                                                </button>
                                            </div>

                                            <p className="text-black">${(item.price * item.quantity).toFixed(2)}</p>

                                            <button 
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveProduct(actualProductId, item.attributeId)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cart Totals */}
                        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md border h-fit sticky top-50">
                            <h3 className="text-lg font-semibold mb-5 text-black">CART TOTALS</h3>

                            {/* Total Items */}
                            <div className="flex justify-between mb-5 border-b pb-2 text-black">
                                <span className="text-sm">Total Items:</span>
                                <span>{totalQuantity}</span>
                            </div>

                            {/* Shipping */}
                            <div className="mb-4 border-b pb-4 text-black">
                                <p className="mb-1">Shipping:</p>
                                <p className="ml-2 text-sm">
                                    Shipping to: <span className="text-xs font-bold">{address}</span>
                                </p>
                                <button className="text-blue-500 hover:underline mt-1 ml-2 text-sm">
                                    Change Address
                                </button>
                            </div>

                            {/* Total Price */}
                            <div className="flex justify-between mb-4 text-black">
                                <span>Total Price:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <Link to="/checkout"><button
                                type="button"
                                className="w-full !bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition">
                                Proceed to Checkout
                            </button></Link>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty Cart Section
                <div className="flex flex-col justify-center items-center text-center space-y-6">
                    <img
                        src={EmptyCart}
                        alt="Empty Cart"
                        className="max-w-xs w-full object-contain"
                    />
                    <h2 className="text-2xl font-semibold text-gray-700">Your Cart is Empty</h2>
                    <Link
                        to="/shop"
                        className="bg-blue-600 !text-white py-2 px-6 rounded hover:bg-red-800 transform hover:scale-105 transition-transform duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;