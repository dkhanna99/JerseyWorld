import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import club from '../assets/club.png';
import nation from '../assets/nations.png';
import kidslogo from '../assets/kidslogo.png';
import fanmerch from '../assets/fanmerch.png';
import training from '../assets/training.png';

const categories = [
    {
        title: 'Clubs',
        imageUrl: club,
    },
    {
        title: 'Nations',
        imageUrl: nation,
    },
    {
        title: 'Kids',
        imageUrl: kidslogo,
    },
    {
        title: 'Fan Merch',
        imageUrl: fanmerch,
    },
    {
        title: 'Training',
        imageUrl: training,
    },
];

const CategorySection = () => {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12">
                {/* Heading Link */}
                <div className="text-center mb-8">
                    <Link
                        to="/categories"
                        className="inline-flex items-center gap-2 text-4xl font-extrabold !text-black !underline no-underline hover:no-underline group"
                    >
                        Categories
                        <FaArrowRight className="text-2xl !text-black transform transition-transform duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                        >
                            <img
                                src={category.imageUrl}
                                alt={category.title}
                                className="w-24 h-24 object-contain mb-4"
                            />
                            <div>
                                <p className="text-lg font-semibold text-black">{category.title}</p>
                                <p className="text-black mt-2 text-sm hover:underline">View All</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategorySection;