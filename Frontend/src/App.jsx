import { useState } from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom";
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
import { useEffect } from 'react';
import { mockData } from './assets/mockData.jsx';
import { setProducts } from './redux/productSlice.jsx';
function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setProducts(mockData)); 
    }, [dispatch]);
    
    return (
       <BrowserRouter>
           <Navbar />
           <Routes>
               <Route path="/" element={<Home />}></Route>
               <Route path="/shop" element={<Shop />}></Route>
               <Route path="/categories" element={<Categories />}></Route>
               <Route path="/cart" element={<Cart />}></Route>
               <Route path="/search" element={<Search />}></Route>
               <Route path="/filter-data" element={<FilterData />}></Route>
               <Route path="/aboutus" element={<AboutUs />}></Route>
               <Route path="/contactus" element={<ContactUs />}></Route>
               <Route path="/product/:id" element={<ProductDetail />}></Route>
           </Routes>
           <Footer />
       </BrowserRouter>
  )
}

export default App
