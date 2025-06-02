import React from "react";
import { FaSearch } from "react-icons/fa";
import {useDispatch} from "react-redux";
import { setSearchTerm} from "../redux/productSlice.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const Search = () => {
    const dispatch = useDispatch();
    const [search, setSeach] = useState();
    const navigate = useNavigate()
    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchTerm(search))
        navigate('/filter-data')
    }
    return (
        <div className="bg-white w-full min-h-screen flex justify-center pt-50 px-4">
            <div className="relative flex-1 max-w-md mx-4">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search Product"
                        className="w-full border border-black text-black py-2 px-4" 
                        onChange={(e) => setSeach(e.target.value)}
                    />
                    <FaSearch className="absolute top-3 right-3 text-red-500" />
                </form>
            </div>
        </div>
    );
};

export default Search;