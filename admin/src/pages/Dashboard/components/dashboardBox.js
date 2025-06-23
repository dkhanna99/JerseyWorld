import Button from "@mui/material/Button";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { IoIosTimer } from "react-icons/io";

const DashboardBox = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const ITEM_HEIGHT = 48;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                className="dashboardBox"
                style={{
                    backgroundImage: `linear-gradient(to right, ${props.color?.[0]} , ${props.color?.[1]})`,
                }}
            >
                {
                    props.grow === true
                        ? <span className="chart"><TrendingUpIcon /></span>
                        : <span className="chart"><TrendingDownIcon /></span>
                }

                <div className="d-flex align-items-center w-100 justify-content-between">
                    <div className="col1">
                        <div className="card-count">{props.count > 0 ? props.count : 0}</div>
                    </div>

                    <div className="ml-auto">
                        {props.icon && <span className="icon">{props.icon}</span>}
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="text-white mb-1">{props.title}</h4>
                    <Button className="m1=auto toggleIcon" onClick={handleClick}>
                        <HiDotsVertical />
                    </Button>
                    <Menu
                        className="dropdown_menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }
                        }}
                    >
                        <MenuItem onClick={handleClose}><IoIosTimer />Last Day</MenuItem>
                        <MenuItem onClick={handleClose}><IoIosTimer />Last Week</MenuItem>
                        <MenuItem onClick={handleClose}><IoIosTimer />Last Month</MenuItem>
                        <MenuItem onClick={handleClose}><IoIosTimer />Last Year</MenuItem>
                    </Menu>
                </div>
            </Button>
        </>
    );
};

export default DashboardBox;