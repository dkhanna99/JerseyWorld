import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import NoProduct from '../assets/not_found.png';
import { setFilteredData } from '../redux/productSlice';

const FilterData = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector((state) => state.products.searchTerm);
    const filteredData = useSelector((state) => state.products.filteredData);

    useEffect(() => {
        const fetchFilteredProducts = async () => {
            if (!searchTerm) return;

            try {
                const response = await fetch(`http://localhost:4000/api/products/search?q=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }
                const data = await response.json();
                dispatch(setFilteredData(data));
            } catch (error) {
                console.error('Error fetching search results:', error.message);
                dispatch(setFilteredData([]));
            }
        };

        fetchFilteredProducts();
    }, [searchTerm, dispatch]);

    return (
        <div className="mx-auto py-50 px-4 md:px-16 lg:px-24 bg-white">
            {filteredData.length > 0 ? (
                <>
                    <h2 className="text-3xl font-bold mb-6 text-center text-black">Search Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredData.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-center mt-12">
                    <img src={NoProduct} alt="No products found illustration" className="w-64" />
                    <p className="text-lg text-gray-600 mt-4">No products found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default FilterData;