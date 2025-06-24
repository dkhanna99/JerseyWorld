import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from "./components/Sidebar";
import {createContext, useEffect, useState} from "react";
import SignUp from "./pages/SignUp";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";

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
                            <Route path="/" exact element={<Dashboard />} />
                            <Route path="/dashboard" exact element={<Dashboard />} />
                            <Route path="/login" exact element={<Login />} />
                            <Route path="/signUp" exact element={<SignUp />} />
                            <Route path="/products" exact element={<Products />} />
                            <Route path="/product/details" exact element={<ProductDetails />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </MyContext.Provider>
    );
}

export default App;
export { MyContext };