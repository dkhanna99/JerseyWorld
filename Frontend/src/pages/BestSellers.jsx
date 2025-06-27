import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/products");
                if (!response.ok) throw new Error(`Status ${response.status}`);

                const data = await response.json();

                console.log("All products from API:", data);

                const featured = data
                    .filter((product) => product.isFeatured || product.featured)
                    .map((product) => ({
                        ...product,
                        id: product._id || product.id, 
                    }));
                
                //const featured = data.filter(p => p.featured === true || p.isFeatured === true);

                console.log("Filtered featured products:", featured);

                setProducts(featured);
            } catch (err) {
                console.error("Error fetching best sellers:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="bg-white py-40 min-h-screen">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-extrabold mb-6 text-center">Best Sellers</h2>

                {loading && <p className="text-center text-gray-600">Loading products...</p>}
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {!loading && products.length === 0 && <p className="text-center text-gray-500">No featured products found.</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id || product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BestSellers;