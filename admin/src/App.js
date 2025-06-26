import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from "./components/Sidebar";
import {createContext, useEffect, useState} from "react";
import SignUp from "./pages/SignUp";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import ProductUpload from "./pages/ProductUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./pages/ContactMessages";
import Orders from "./pages/Orders";

const MyContext = createContext();

function App() {
    const [isLogin, setIsLogin] = useState(false);
    const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);

    const values = {
        isLogin,
        setIsLogin,
        isHideSidebarAndHeader,
        setIsHideSidebarAndHeader
    };
    
    return (
        <MyContext.Provider value={values}>
            <BrowserRouter>
                {
                    isHideSidebarAndHeader !== true &&
                    <Header />
                }
                <div className="main d-flex">
                    {
                        isHideSidebarAndHeader !== true &&
                        <div className="sidebarWrapper">
                            <Sidebar />
                        </div>
                    }

                    <div className={`content ${isHideSidebarAndHeader === true && 'full'}`}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signUp" element={<SignUp />} />
                            
                            {/* Protected Routes */}
                            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                            <Route path="/product/details" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                            <Route path="/product/upload" element={<ProtectedRoute><ProductUpload /></ProtectedRoute>} />
                            <Route path="/contact-messages" element={<ProtectedRoute><ContactMessages /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                            
                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </MyContext.Provider>
    );
}

export default App;
export { MyContext };