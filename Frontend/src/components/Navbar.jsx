import React from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import JWlogo from '../assets/JWlogo.png';
const Navbar = () => {
    return (
        <nav className='bg-white shadow-md w-full fixed top-0 left-0 z-50'>
            <div className='container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center'>
                #Search
                <div className='flex-1 flex justify-start'>
                    <Link to="/search">
                        <FaSearch className='text-2xl text-red-500 cursor-pointer transition-transform duration-300 transform hover:scale-110' />
                    </Link>
                </div>

                #Logo
                <div className='flex-1 flex justify-center'>
                    <Link to="/">
                        <img
                            src={JWlogo}
                            alt="Jersey World Logo"
                            className='h-20 transition-transform duration-300 transform hover:scale-110'
                        />
                    </Link>
                </div>

                #Cart and Login
                <div className='flex-1 flex justify-end items-center space-x-4'>
                    <Link to="/cart">
                        <FaShoppingCart className='text-lg cursor-pointer transition-transform duration-300 transform hover:scale-110' />
                    </Link>
                    <button className='hidden md:block'>
                        Login | Register
                    </button>
                    <button className='block md:hidden'>
                        <FaUser className='cursor-pointer transition-transform duration-300 transform hover:scale-110' />
                    </button>
                </div>
            </div>

            #NavLinks
            <div className='flex items-center justify-center space-x-8 py-4 text-base font-medium text-black'>
                <Link
                    to="/"
                    className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                    Home
                </Link>
                <Link
                    to="/categories"
                    className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                    Categories
                </Link>
                <Link
                    to="/contact"
                    className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                    Contact
                </Link>
                <Link
                    to="/about"
                    className="relative hover:text-black transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                >
                    About Us
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;