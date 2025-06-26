import React, { useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa6";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
import InputLabel from "@mui/material/InputLabel";
import {Checkbox, FormControlLabel} from "@mui/material";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({theme}) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const ProductUpload = () => {

    const [categoryVal, setcategoryVal] = useState('');
    const [ratingsValue, setRatingValue] = useState(1);

    const handleChangeCategory = (event) => {
        setcategoryVal(event.target.value);
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Product View</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<HomeIcon fontSize="small"/>}
                        />

                        <StyledBreadcrumb
                            label="Products"
                            component="a"
                            href="#"
                        />
                        <StyledBreadcrumb
                            label="Product Upload"

                        />
                    </Breadcrumbs>
                </div>

                <form className="form">
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="card p-4">
                                <h5 className="mb-4">
                                    Basic Information
                                </h5>
                                <div className="form-group">
                                    <h6>PRODUCT NAME</h6>
                                    <input type="text" name="name"/>
                                </div>
                                <div className="form-group">
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows="5" cols="10"/>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>CATEGORY</h6>
                                            <Select
                                                value={categoryVal}
                                                onChange={handleChangeCategory}
                                                displayEmpty
                                                inputProps={{'aria-label': 'Without label'}}
                                                className="w-100"
                                            >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                <MenuItem className="text-capitalize">Clubs</MenuItem>
                                                <MenuItem className="text-capitalize">Nations</MenuItem>
                                                <MenuItem className="text-capitalize">Fan Merch</MenuItem>
                                                <MenuItem className="text-capitalize">Kids</MenuItem>
                                                <MenuItem className="text-capitalize">Training</MenuItem>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>PRICE</h6>
                                            <input type="number" name="price" className="w-100"/>
                                        </div>

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            <h6>RATINGS</h6>
                                            <Rating
                                                name="simple-controlled"
                                                value={ratingsValue}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group d-flex align-items-center mt-3">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        
                                                        name="bestseller"
                                                        color="primary"
                                                    />
                                                }
                                                label="BEST-SELLER?"
                                            />
                                        </div>
                                    </div>
                                    <br/>
                                </div>
                                <div className="row">

                                </div>
                               
                            </div>
                        </div>
                    </div>
                    <div className="row">

                    </div>
                    <div className="card p-4 mt-0">
                        <div className="imagesUploadSec">
                            <h5 className="mb-4">Media And Published</h5>

                            <div className="imgUploadBox d-flex align-items-center">

                                <div className="uploadBox">
                        <span
                            className="remove">
                          <IoCloseSharp/>
                        </span>
                                    <div className="box">
                                        <LazyLoadImage
                                            alt={"image"}
                                            effect="blur"
                                            className="w-100"
                                            src="https://store.fcbarcelona.com/cdn/shop/files/25100BMF_1.jpg?v=1728911440&width=1445"
                                        />
                                    </div>
                                </div>


                                <div className="uploadBox">
                                    <input
                                        type="file"
                                        multiple
                                        name="images"
                                    />
                                    <div className="info">
                                        <FaRegImages />
                                        <h5>image upload</h5>
                                    </div>
                                </div>
                            </div>

                            <br/>

                            <Button type="submit"
                                    className="btn-blue btn-lg btn-big"><FaCloudUploadAlt/> &nbsp; PUBLISH AND
                                VIEW</Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProductUpload;