import {FaPencilAlt, FaUserCircle} from "react-icons/fa";
import {IoMdCart} from "react-icons/io";
import {MdDelete, MdShoppingBag} from "react-icons/md";
import {GiStarsStack} from "react-icons/gi";
import DashboardBox from "./components/dashboardBox";
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useState} from "react";
import Button from "@mui/material/Button";
import {FaEye} from "react-icons/fa6";

const Dashboard = () => {

    const [showBy, setshowBy] = useState(10);
    const [showBysetCatBy, setCatBy] = useState("");
    
    return (
        <>
            <div className="right-content w-100">
                <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox
                                color={["#1da256", "#48d483"]}
                                icon={<FaUserCircle />}
                                grow={true}
                                title="Total Users"
                                count="10"
                            />
                            <DashboardBox
                                color={["#c012e2", "#eb64fe"]}
                                icon={<IoMdCart />}
                                title="Total Orders"
                                count="20"
                            />
                            <DashboardBox
                                color={["#2c78e5", "#60aff5"]}
                                icon={<MdShoppingBag />}
                                title="Total Products"
                                count="30"
                            />
                            <DashboardBox
                                color={["#e1950e", "#f3cd29"]}
                                icon={<GiStarsStack />}
                                title="Total Reviews"
                                count="40"
                            />
                            
                        </div>
                    </div>
                    
                    
                </div>
                </div>

            <div className="card shadow border-0 p-3 mt-5">
                <h3 className="hd">Best Selling Products</h3>
                <div className="row cardFilters mt-2 mb-3">
                    <div className="col-md-3">
                        <h4>SHOW BY</h4>
                        <FormControl size="small" className="w-100">
                        <Select
                            value={showBy}
                            onChange={(e)=>{setshowBy(e.target.value)}}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="w-100"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
                    
                    <div className="col-md-3">
                        <h4>CATEGORY BY</h4>
                        <FormControl size="small" className="w-100">
                        <Select
                            value={showBysetCatBy}
                            onChange={(e)=>{setCatBy(e.target.value)}}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="w-100"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                        </FormControl>

                    </div></div>

                <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped v-align">
                        <thead className="thead-dark">
                        <tr>
                            <th>UID</th>
                            <th style={{ width: "300px" }}>PRODUCT</th>
                                     <th>CATEGORY</th>
                                   <th>PRICE</th>
                                    <th>RATING</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                        <tr>
                            <td>#1</td>
                            <td>
                                <div className="d-flex productBox">
                                    <div className="imgWrapper">
                                        <div className="img">
                                            <img src="https://store.fcbarcelona.com/cdn/shop/files/251100B_1_bbfaed15-891d-4a6d-9ff1-efffaf45ac5f.jpg?v=1730384805&width=1400" className="w-100"/>
                                        </div>
                                    </div>
                                    <div className="info pl-0" align="center">
                                        <h6>BarcaHome</h6>
                                </div>
                                </div>
                                </td>
                            <td>Clubs</td>
                            <td>120</td>
                            <td>5</td>
                            <td>
                                <div className="actions d-flex align-items-center">
                                    <Button className="secondary" color="secondary"><FaEye /></Button>
                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                    <Button className="error" color="error"><MdDelete /></Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>#1</td>
                            <td>
                                <div className="d-flex productBox">
                                    <div className="imgWrapper">
                                        <div className="img">
                                            <img src="https://store.fcbarcelona.com/cdn/shop/files/251100B_1_bbfaed15-891d-4a6d-9ff1-efffaf45ac5f.jpg?v=1730384805&width=1400" className="w-100"/>
                                        </div>
                                    </div>
                                    <div className="info pl-0" align="center">
                                        <h6>BarcaHome</h6>
                                    </div>
                                </div>
                            </td>
                            <td>Clubs</td>
                            <td>120</td>
                            <td>5</td>
                            <td>
                                <div className="actions d-flex align-items-center">
                                    <Button className="secondary" color="secondary"><FaEye /></Button>
                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                    <Button className="error" color="error"><MdDelete /></Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>#1</td>
                            <td>
                                <div className="d-flex productBox">
                                    <div className="imgWrapper">
                                        <div className="img">
                                            <img src="https://store.fcbarcelona.com/cdn/shop/files/251100B_1_bbfaed15-891d-4a6d-9ff1-efffaf45ac5f.jpg?v=1730384805&width=1400" className="w-100"/>
                                        </div>
                                    </div>
                                    <div className="info pl-0" align="center">
                                        <h6>BarcaHome</h6>
                                    </div>
                                </div>
                            </td>
                            <td>Clubs</td>
                            <td>120</td>
                            <td>5</td>
                            <td>
                                <div className="actions d-flex align-items-center">
                                    <Button className="secondary" color="secondary"><FaEye /></Button>
                                    <Button className="success" color="success"><FaPencilAlt /></Button>
                                    <Button className="error" color="error"><MdDelete /></Button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Dashboard;