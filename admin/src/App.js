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
                            <Route
                                path="*"
                                element={
                                    <ProtectedRoute>
                                        <Routes>
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/products" element={<Products />} />
                                            <Route path="/product/details" element={<ProductDetails />} />
                                            <Route path="/product/upload" element={<ProductUpload />} />
                                        </Routes>
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </MyContext.Provider>
    );
}

export default App;
export { MyContext };