import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import JWlogo from '../assets/JWlogo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <nav className={`bg-white shadow-md w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
            {/* Main Navbar */}
            <div className='container mx-auto px-4 md:px-16 lg:px-24 flex justify-between items-center transition-all duration-300'>
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
                    <Link to="/cart">
                        <FaShoppingCart className='text-lg cursor-pointer transition-transform duration-300 transform hover:scale-110' />
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
        <Link
            to="/"
            className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}
        >
            Home
        </Link>
        <Link
            to="/categories"
            className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}
        >
            Categories
        </Link>
        <Link
            to="/shop"
            className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}
        >
            Shop
        </Link>
        <Link
            to="/contact"
            className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}
        >
            Contact
        </Link>
        <Link
            to="/about"
            className={`relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full ${mobile ? 'text-lg' : ''}`}
        >
            About Us
        </Link>
    </>
);

export default Navbar;