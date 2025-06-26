import Button from '@mui/material/Button';
import {MdDashboard} from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { GiBasketballJersey } from "react-icons/gi";
import { TbShoppingCartBolt } from "react-icons/tb";
import { LuMessagesSquare } from "react-icons/lu";
import {IoMdLogOut, IoMdNotifications, IoMdSettings} from "react-icons/io";
import { Link } from "react-router-dom";
import {useState} from "react";


const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        if(activeTab===index){
            setIsToggleSubmenu(!isToggleSubmenu);
        }else{
            setIsToggleSubmenu(false);
            setIsToggleSubmenu(true);
        }

    };
    return (
    <div className="sidebar">
        <ul>
            <li>
                <Link to="/">
                <Button
                    className={`w-100 ${activeTab === 0 ? "active" : ""}`}
                    onClick={()=>isOpenSubmenu(0)}>
                    <span className="icon"><MdDashboard /></span>
                    Dashboard
                    <span className="arrow">
                <FaAngleRight />
              </span>
                </Button>
                </Link>
            </li>
            <li>
                <Button
                    className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? "active" : ""}`}
                        onClick={()=>isOpenSubmenu(1)}>
                    <span className="icon"><GiBasketballJersey /></span>
                    Products
                    <span className="arrow">
                <FaAngleRight />
              </span>
                </Button>
                <div className={`submenuWrapper ${
                    activeTab === 1 && isToggleSubmenu === true
                        ? "colapse"
                        : "colapsed"
                }`}>
                <ul className="submenu">
                    <li><Link to="/products">Product List</Link></li>
                    {/* <li><Link to="/product/details">Product View</Link></li> */}
                    <li><Link to="/product/upload">Product Upload</Link></li>
                </ul>
                </div>
            </li>
            <li>
                <Button
                    className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? "active" : ""}`}
                        onClick={()=>isOpenSubmenu(2)}>
                    <span className="icon"><LuMessagesSquare /></span>
                    Messages
                    <span className="arrow">
                <FaAngleRight />
              </span>
                </Button>
                <div className={`submenuWrapper ${
                    activeTab === 2 && isToggleSubmenu === true
                        ? "colapse"
                        : "colapsed"
                }`}>
                <ul className="submenu">
                    <li><Link to="/contact-messages">Contact Messages</Link></li>
                </ul>
                </div>
            </li>
            <li>
                <Link to="/">
                <Button
                    className={`w-100 ${activeTab === 3 ? "active" : ""}`}
                    onClick={()=>isOpenSubmenu(3)}>
                    <span className="icon"><TbShoppingCartBolt /></span>
                    Orders
                    <span className="arrow">
                <FaAngleRight />
              </span>
                </Button>
                </Link>
            </li>
            <li>
                <Link to="/">
                <Button
                    className={`w-100 ${activeTab === 4 ? "active" : ""}`}
                    onClick={()=>isOpenSubmenu(4)}>
                    <span className="icon"><IoMdNotifications /></span>
                    Notifications
                    <span className="arrow">
                <FaAngleRight />
              </span>
                </Button>
                </Link>
            </li>
            <li>
                <Link to="/">
                <Button
                    className={`w-100 ${activeTab === 5 ? "active" : ""}`}
                    onClick={()=>isOpenSubmenu(5)}>
                    <span className="icon"><IoMdSettings /></span>
                    Settings
                    <span className="arrow">
                <FaAngleRight />
              </span>
                </Button>
                </Link>
            </li>
        </ul>

        <div className="logoutWrapper">
            <div className="logoutBox">
                <Button variant="contained">
                    <IoMdLogOut /> Logout
                </Button>
            </div>
        </div>
        
    </div>
    )
}

export default Sidebar;