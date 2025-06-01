import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const products = useSelector(state => state.products);

    return (
        <div className="bg-white mx-auto py-50 px-4 md:px-16 lg:px-24">
            <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-black inline-block border-b-4 border-red-500 pb-2">
                All Products
            </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
                {products.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;