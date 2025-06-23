import React, {useContext, useEffect, useState} from "react";
import logo from "../../assets/JWlogo.png";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {MdMenuOpen} from "react-icons/md";
import {MdDarkMode} from "react-icons/md";
import {IoMdCart} from "react-icons/io";
import {MdEmail} from "react-icons/md";
import {IoIosNotifications} from "react-icons/io";
import {MdOutlineMenu} from "react-icons/md";
import {MdOutlineLightMode} from "react-icons/md";
import {MdNightlightRound} from "react-icons/md";
import SearchBar from "../SearchBar";

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);

    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationDrop);

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    const handleOpenotificationsDrop = () => {
        setisOpennotificationDrop(true);
    };

    const handleClosenotificationsDrop = () => {
        setisOpennotificationDrop(false);
    };

    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo Wraooer */}
                        <div className="col-sm-2 part1 pr-0">
                            <Link to={"/"} className="d-flex align-items-center logo">
                                <img src={logo}/>
                            </Link>
                        </div>


                        <div className="col-sm-3 d-flex align-items-center part2">
                            <Button
                                className="rounded-circle mr-3"> <MdMenuOpen/>
                            </Button>
                            <SearchBar searchProducts={(input) => {
                                console.log("Search input:", input);
                            }}/>
                        </div>

                        <div className="col-sm-7 d-flex align-items-center justify-content-end gap-3 part3">
                            
                            <Button className="rounded-circle mr-3"><MdDarkMode/></Button>
                            <Button className="rounded-circle mr-3"><IoMdCart/></Button>
                            <Button className="rounded-circle mr-3"><MdEmail/></Button>

                            <div className="dropdownWrapper position-relative">
                                <Button className="rounded-circle mr-3"
                                        onClick={handleOpenotificationsDrop}><IoIosNotifications/></Button>
                                <Menu
                                    anchorEl={isOpennotificationDrop}
                                    className="notifications dropdown_list"
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleClosenotificationsDrop}
                                    onClick={handleClosenotificationsDrop}
                                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                >
                                    <div className="head" style={{ width: '100%', textAlign: 'center', padding: '8px 0' }}>
                                        <strong>Orders (12)</strong>
                                    </div>
                                    
                                    <Divider className="mb-1"/>

                                    <div className="scroll">
                                        
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <div className='d-flex'>
                                            <div>
                                    <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://media.craiyon.com/2025-04-03/DM1WvH1NQNu97z7gcovH7Q.webp"/>
                                </span>
                                    </div>
                                            </div>

                                        <div className="dropdownInfo">
                                            <h4>
                                                <span>
                                                    <b>Mahmudul </b>
                                                    added to his favorite list
                                                    <b> Leather belt steve madden</b>
                                                </span>
                                            </h4>
                                            <p className="text-sky mb-0">few seconds ago</p>
                                        </div>
                                        </div> 
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <div className='d-flex'>
                                            <div>
                                                <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://media.craiyon.com/2025-04-03/DM1WvH1NQNu97z7gcovH7Q.webp"/>
                                </span>
                                                </div>
                                            </div>

                                            <div className="dropdownInfo">
                                                <h4>
                                                <span>
                                                    <b>Mahmudul </b>
                                                    added to his favorite list
                                                    <b> Leather belt steve madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky mb-0">few seconds ago</p>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <div className='d-flex'>
                                            <div>
                                                <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://media.craiyon.com/2025-04-03/DM1WvH1NQNu97z7gcovH7Q.webp"/>
                                </span>
                                                </div>
                                            </div>

                                            <div className="dropdownInfo">
                                                <h4>
                                                <span>
                                                    <b>Mahmudul </b>
                                                    added to his favorite list
                                                    <b> Leather belt steve madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky mb-0">few seconds ago</p>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <div className='d-flex'>
                                            <div>
                                                <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://media.craiyon.com/2025-04-03/DM1WvH1NQNu97z7gcovH7Q.webp"/>
                                </span>
                                                </div>
                                            </div>

                                            <div className="dropdownInfo">
                                                <h4>
                                                <span>
                                                    <b>Mahmudul </b>
                                                    added to his favorite list
                                                    <b> Leather belt steve madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky mb-0">few seconds ago</p>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <div className='d-flex'>
                                            <div>
                                                <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://media.craiyon.com/2025-04-03/DM1WvH1NQNu97z7gcovH7Q.webp"/>
                                </span>
                                                </div>
                                            </div>

                                            <div className="dropdownInfo">
                                                <h4>
                                                <span>
                                                    <b>Mahmudul </b>
                                                    added to his favorite list
                                                    <b> Leather belt steve madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky mb-0">few seconds ago</p>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <div className='d-flex'>
                                            <div>
                                                <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://media.craiyon.com/2025-04-03/DM1WvH1NQNu97z7gcovH7Q.webp"/>
                                </span>
                                                </div>
                                            </div>

                                            <div className="dropdownInfo">
                                                <h4>
                                                <span>
                                                    <b>Mahmudul </b>
                                                    added to his favorite list
                                                    <b> Leather belt steve madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky mb-0">few seconds ago</p>
                                            </div>
                                        </div>
                                    </MenuItem>
                                    
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                                        <Button className="btn-blue" style={{ minWidth: '200px' }}>
                                            View All Notifications
                                        </Button>
                                    </div>
                                </Menu>
                            </div>

                            <div className="myAccWrapper">
                                <Button className="myAcc d-flex align-items-center"
                                        onClick={handleOpenMyAccDrop}>
                                    <div className="userImg">
                                <span className="rounded-circle">
                                <img
                                    src="https://thumbs.dreamstime.com/b/cartoon-smiling-boy-vector-illustration-avatar-profile-picture-use-vibrant-young-wearing-casual-hoodie-character-364611515.jpg"/>
                                </span>
                                    </div>

                                    <div className="userInfo">
                                        <h4>Dhruv Khanna</h4>
                                        <p className="mb-0">@dk99</p>
                                    </div>

                                </Button>

                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={openMyAcc}
                                    onClose={handleCloseMyAccDrop}
                                    onClick={handleCloseMyAccDrop}
                                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                >
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <ListItemIcon>
                                            <PersonAdd fontSize="small"/>
                                        </ListItemIcon>
                                        My Account
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <ListItemIcon>
                                            <Settings fontSize="small"/>
                                        </ListItemIcon>
                                        Reset Password
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                        <ListItemIcon>
                                            <Logout fontSize="small"/>
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>

                            </div>

                        </div>


                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;