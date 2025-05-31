import { useState } from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";

function App() {
    
    return (
       <BrowserRouter>
           <Navbar />
           <Routes>
               <Route path="/" element={<Home />}></Route>
           </Routes>
           <Footer />
       </BrowserRouter>
  )
}

export default App
