import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Shop from './pages/Shop.jsx';
import Categories from "./pages/Categories.jsx";
import Cart from "./pages/Cart.jsx";
import Search from "./pages/Search.jsx";
import FilterData from "./pages/FilterData.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import { useDispatch } from 'react-redux';
import { mockData } from './assets/mockData.jsx';
import { setProducts } from './redux/productSlice.jsx';
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setProducts(mockData));
    }, [dispatch]);

    return (
        <div className="min-h-screen flex flex-col">
            <BrowserRouter>
                <Navbar />
                <ScrollToTop />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/filter-data" element={<FilterData />} />
                        <Route path="/aboutus" element={<AboutUs />} />
                        <Route path="/contactus" element={<ContactUs />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                    </Routes>
                </main>
                <Footer />
                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                />
            </BrowserRouter>
        </div>
    );
}

export default App;