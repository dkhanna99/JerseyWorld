import React, {useEffect} from "react";
import home1 from "../assets/home1.png";
import home2 from "../assets/home2.png";
import kids from "../assets/kids.png";
import retro from "../assets/retro.png";
import InfoSection from "../components/InfoSection.jsx";
import CategorySection from "../components/CategorySection.jsx";
import { setProducts} from "../redux/productSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { API_ENDPOINTS } from "../config.js";
import { initializeCartOnce } from "../utils/cartUtils.js";

const Home = () => {
    
    const dispatch = useDispatch()
    const products = useSelector(state => state.products)
    
    useEffect(() =>{
        const initializeData = async () => {
            try {
                // Initialize cart only once
                const cart = await initializeCartOnce();
                console.log('Cart initialized:', cart);
                
                // Fetch products
                const response = await fetch(API_ENDPOINTS.PRODUCTS);
                const data = await response.json();
                
                // Transform API data to match mockData format
                const transformedProducts = data.map((product, index) => ({
                    id: product._id || index + 1,
                    image: product.image && product.image.length > 0 ? product.image[0] : '',
                    name: product.name,
                    description: product.description,
                    price: product.basePrice,
                    rating: product.rating,
                    category: product.category ? product.category.name : 'Uncategorized',
                    hasVariants: product.hasVariants || false,
                    variants: product.variants || [],
                    availableColors: product.availableColors || [],
                    availableSizes: product.availableSizes || []
                }));
                
                dispatch(setProducts(transformedProducts));
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };
        
        initializeData();
    }, [dispatch])

    return (
        <div className="w-full pt-30"> 
            {/* Hero Section 1 */}
            <section className="w-full">
                <img
                    src={home1}
                    alt="Hero Banner 1"
                    className="w-full object-cover"
                />
            </section>

            {/* Hero Section 2 */}
            <section className="w-full">
                <img
                    src={home2}
                    alt="Hero Banner 2"
                    className="w-full object-cover"
                />
            </section>

            {/* Kids Jersey Banner */}
            <section className="w-full">
                <img
                    src={kids}
                    alt="Kids Jerseys"
                    className="w-full object-cover"
                />
            </section>

            {/* Retro Jersey Banner */}
            <section className="w-full">
                <img
                    src={retro}
                    alt="Retro Jerseys"
                    className="w-full object-cover"
                />
            </section>
            <InfoSection />
            <CategorySection />

            <div className="bg-white py-12">
                <div className="container mx-auto">
                    {/* Centered Best Sellers Heading */}
                    <div className="flex justify-center mb-6">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 text-4xl font-extrabold !text-black !underline no-underline hover:no-underline group"
                        >
                            Best Sellers
                            <FaArrowRight className="text-2xl !text-black transform transition-transform duration-300 group-hover:translate-x-2" />
                        </Link>
                    </div>

                    {/*Product Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {products.products
                            .filter(product => product.category?.toLowerCase() === 'Best Sellers')
                            .slice(0, 5)
                            .map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default Home;