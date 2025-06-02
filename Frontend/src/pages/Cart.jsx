import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EmptyCart from '../assets/empty-cart.png';
import { FaTrashAlt } from "react-icons/fa";
import {removeFromCart, increaseQuantity, decreaseQuantity} from "../redux/cartSlice.jsx";
const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const [address, setAddress] = useState('main street, 0012');
    const dispatch = useDispatch()
    const handleContinueShopping = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <div className="min-h-[90vh] w-screen flex items-center justify-center bg-white px-4 py-8">
            {cart.products.length > 0 ? (
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
                            {cart.products.map((product) => (
                                <div key={product.id} className="flex flex-col md:flex-row items-center justify-between border-b pb-6">
                                    {/* Product Info */}
                                    <div className="flex items-center space-x-4 w-full md:w-2/5">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-24 h-24 object-contain rounded"
                                        />
                                        <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                                    </div>

                                    {/* Price | Quantity | Subtotal | Remove */}
                                    <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-3/5 mt-4 md:mt-0 space-y-4 md:space-y-0">
                                        <p className="text-black">${product.price}</p>

                                        <div className="flex items-center border rounded overflow-hidden">
                                            <button className="text-lg font-bold px-3 py-1 bg-black text-white hover:bg-gray-700 border-r"
                                            onClick={() => dispatch(decreaseQuantity(product.id))}>
                                                -
                                            </button>
                                            <p className="px-4 text-black">{product.quantity}</p>
                                            <button className="text-lg font-bold px-3 py-1 bg-black text-white hover:bg-gray-700 border-l"
                                                    onClick={() => dispatch(increaseQuantity(product.id))}>
                                                +
                                            </button>
                                        </div>

                                        <p className="text-black">${(product.price * product.quantity).toFixed(2)}</p>

                                        <button className="text-red-500 hover:text-red-700"
                                        onClick={() => dispatch(removeFromCart(product.id))}>
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Totals */}
                        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md border h-fit sticky top-50">
                            <h3 className="text-lg font-semibold mb-5 text-black">CART TOTALS</h3>

                            {/* Total Items */}
                            <div className="flex justify-between mb-5 border-b pb-2 text-black">
                                <span className="text-sm">Total Items:</span>
                                <span>{cart.totalQuantity}</span>
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
                                <span>${cart.totalPrice.toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="button"
                                className="w-full !bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition">
                                Proceed to Checkout
                            </button>
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
                    <button
                        onClick={handleContinueShopping}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;