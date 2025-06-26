import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import JWlogo from '../assets/JWlogo.png';
import { useSelector } from "react-redux";
import { getCartWithProducts } from "../utils/cartUtils.js";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Fetch cart data to get real item count
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const cart = await getCartWithProducts();
                const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartItemCount(totalItems);
            } catch (error) {
                console.error('Error fetching cart count:', error);
                setCartItemCount(0);
            }
        };

        fetchCartCount();
    }, []);

    // Listen for cart updates (you can add a custom event or use a different approach)
    useEffect(() => {
        const handleCartUpdate = () => {
            fetchCartCount();
        };

        // Listen for custom cart update events
        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const fetchCartCount = async () => {
        try {
            const cart = await getCartWithProducts();
            const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(totalItems);
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartItemCount(0);
        }
    };

    return (
        <nav className={`bg-white w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}>
            {/* Main Navbar */}
            <div className='w-full px-4 md:px-16 lg:px-24 flex justify-between items-center transition-all duration-300'>
                {/* Search Icon */}
                <div className='flex-1 flex justify-start'>
                    <Link to="/search">
                        <FaSearch className='text-2xl text-red-500 cursor-pointer transition-transform duration-300 transform hover:scale-110' />
                    </Link>
                </div>

                {/* Logo */}
                <div className='flex-1 flex justify-center'>
                    <Link to="/">
                        <img
                            src={JWlogo}
                            alt="Jersey World Logo"
                            className={`transition-all duration-300 transform hover:scale-110 ${isScrolled ? 'h-12 md:h-16' : 'h-16 md:h-20'}`}
                        />
                    </Link>
                </div>

                {/* Cart, Login/Register */}
                <div className='flex-1 flex justify-end items-center space-x-4'>
                    <Link to="/cart" className="relative">
                        <FaShoppingCart className='text-2xl cursor-pointer transition-transform duration-300 transform hover:scale-110' />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"> 
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                    <button className='hidden md:block bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800'>
                        Login | Register
                    </button>

                    {/* Hamburger Button */}
                    <button
                        className="inline-block md:hidden text-2xl text-red-500 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Desktop Links */}
            <div className='hidden md:flex items-center justify-center space-x-8 py-4 text-base font-medium text-black'>
                <NavLinks />
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="flex flex-col items-center space-y-4 py-6 text-black font-medium">
                        <NavLinks mobile />
                    </div>
                </div>
            )}
        </nav>
    );
};

// Separate NavLinks component for reuse
const NavLinks = ({ mobile }) => (
    <>
        <Link to="/" className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}>Home</Link>
        <Link to="/categories" className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}>Categories</Link>
        <Link to="/shop" className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}>Shop</Link>
        <Link to="/contactus" className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}>Contact</Link>
        <Link to="/aboutus" className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}>About Us</Link>
    </>
);

export default Navbar;