import React from 'react';
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import paymentIcons from '../assets/paymentoptions.png';
const Footer = () => {
    return (
        <footer className="!bg-gray-900 text-gray-300 py-12 px-4 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-21">
               
                {/* Payment Methods Image */}
                <div className="flex flex-col justify-start items-start">
                    <h4 className="text-white text-xl font-semibold mb-4">We Accept</h4>
                    <div className="flex justify-center items-center w-full">
                        <img
                            src={paymentIcons}
                            alt="Payment Methods"
                            className="h-20 md:h-10 w-auto object-contain bg-transparent"
                        />
                    </div>
                </div>


                {/* Quick Links */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                className="hover:text-white  transition-colors duration-300"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/shop"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                className="hover:text-white  transition-colors duration-300"
                            >
                                Shop
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/aboutus"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                className="hover:text-white  transition-colors duration-300"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contactus"
                                style={{ color: 'inherit', textDecoration: 'none' }}
                                className="hover:text-white  transition-colors duration-300"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="" className="text-white text-2xl hover:text-red-500 transition-colors duration-300">
                            <FaFacebook />
                        </a>
                        <a href="" className="text-white text-2xl hover:text-red-500 transition-colors duration-300">
                            <FaTwitter />
                        </a>
                        <a href="" className="text-white text-2xl hover:text-red-500 transition-colors duration-300">
                            <FaGithub />
                        </a>
                        <a href="" className="text-white text-2xl hover:text-red-500 transition-colors duration-300">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Subscribe to our Newsletter</h4>
                    <form className="flex flex-col space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-3 rounded-md text-gray-900 bg-white placeholder-gray-600 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md transition-colors duration-300 font-semibold"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
                © {new Date().getFullYear()} Jersey World. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;