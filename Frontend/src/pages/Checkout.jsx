import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCartWithProducts } from '../utils/cartUtils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {clearCart} from "../redux/cartSlice.jsx";
import { useDispatch } from 'react-redux';


const Checkout = () => {
    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        postal: '',
        city: '',
        province: '',
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    
    useEffect(() => {
        const fetchCart = async () => {
            const data = await getCartWithProducts();
            setCart(data.items || []);
            setLoading(false);
        };
        fetchCart();
    }, []);

    const handlePlaceOrder = async () => {

        const newErrors = {};

        if (!customer.name) newErrors.name = 'Name is required';
        if (!customer.email) newErrors.email = 'Email is required';
        if (!customer.phone) newErrors.phone = 'Phone number is required';
        if (!customer.address1) newErrors.address1 = 'Street address is required';
        if (!customer.postal) newErrors.postal = 'Postal code is required';
        if (!customer.city) newErrors.city = 'City is required';
        if (!customer.province) newErrors.province = 'Province is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            const res = await axios.post('http://localhost:4000/api/orders', {
                cartId: localStorage.getItem('cartId'),
                shopperName: customer.name,
                email: customer.email,
                phone: customer.phone,
            });

            navigate('/thank-you', {state: {orderNumber: res.data.orderNumber}});
            dispatch(clearCart()); 
            localStorage.removeItem('cartId'); 
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Something went wrong while placing your order.');
        }
        
    };

    if (loading) return <div className="p-8 text-xl">Loading checkout...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-30">
            <h2 className="text-3xl font-bold text-center text-black">Checkout</h2>

            {/* Section 1: Customer Details */}
            <div className="space-y-4 border p-6 rounded-lg shadow mb-8">
                <h3 className="text-xl font-semibold text-black">Customer Details</h3>

                <input
                    className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-black'} text-black`}               
                    placeholder="Full Name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-black'} text-black`}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

                <input
                    type="number"
                    placeholder="Phone Number"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-black'} text-black`}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}

                <h4 className="text-lg font-semibold text-black mt-6">Delivery Address</h4>

                <input
                    type="text"
                    placeholder="Street / Address Line 1"
                    value={customer.address1}
                    onChange={(e) => setCustomer({ ...customer, address1: e.target.value })}
                    className={`w-full p-2 border rounded ${errors.address1 ? 'border-red-500' : 'border-black'} text-black`}
                />
                {errors.address1 && <p className="text-sm text-red-600">{errors.address1}</p>}

                <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={customer.address2}
                    onChange={(e) => setCustomer({ ...customer, address2: e.target.value })}
                    className="w-full p-2 border border-black text-black rounded"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={customer.postal}
                        onChange={(e) => setCustomer({ ...customer, postal: e.target.value })}
                        className={`w-full p-2 border rounded ${errors.postal ? 'border-red-500' : 'border-black'} text-black`}
                    />
                    {errors.postal && <p className="text-sm text-red-600">{errors.postal}</p>}

                    <input
                        type="text"
                        placeholder="City"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-black'} text-black`}
                    />
                    {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                </div>

                <select
                    value={customer.province}
                    onChange={(e) => setCustomer({ ...customer, province: e.target.value })}
                    className={`w-full p-2 border rounded ${errors.province ? 'border-red-500' : 'border-black'} text-black bg-white`}
                >
                    <option value="">Select Province</option>
                    <option value="AB">Alberta</option>
                    <option value="BC">British Columbia</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">New Brunswick</option>
                    <option value="NL">Newfoundland and Labrador</option>
                    <option value="NS">Nova Scotia</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">Prince Edward Island</option>
                    <option value="QC">Quebec</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="NT">Northwest Territories</option>
                    <option value="NU">Nunavut</option>
                    <option value="YT">Yukon</option>
                </select>
                {errors.province && <p className="text-sm text-red-600">{errors.province}</p>}
                
            </div>
            {/* Section 2: Review Items */}
            <div className="space-y-4 border p-6 rounded-lg shadow mb-6">
                <h3 className="text-xl font-semibold text-black">Review Your Items</h3>
                {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-black">
                        <p>{item.product.name}</p>
                        <p>{item.quantity} × ${item.price} = ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                <div className="font-bold text-right text-black">
                    Total: $
                    {cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
                </div>
            </div>

            {/* Section 3: Place Order */}
            <div className="text-center">
                <button
                    onClick={handlePlaceOrder}
                    className="!bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:!bg-red-600 transition"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Checkout;
    