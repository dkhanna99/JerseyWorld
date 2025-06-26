import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThankYou = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderNumber = location.state?.orderNumber;

    return (
        <div className="min-h-[90vh] flex flex-col justify-center items-center px-4 py-12 text-center bg-white">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You for Your Order!</h1>
            {orderNumber && (
                <p className="text-lg text-black mb-2">Your order number is <span className="font-semibold">{orderNumber}</span>.</p>
            )}
            <p className="text-black mb-6">You’ll receive an email confirmation shortly.</p>
            <button
                onClick={() => navigate('/')}
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:!bg-red-600 transition"
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default ThankYou;