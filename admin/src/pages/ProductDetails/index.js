import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import Slider from "react-slick";
import {MdCategory, MdFilterVintage, MdOutlineSportsSoccer} from "react-icons/md";
import {IoStarSharp} from "react-icons/io5";
import {IoIosPricetags} from "react-icons/io";
import Divider from "@mui/material/Divider";
import { API_ENDPOINTS } from "../../config";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
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

const ProductDetails = () => {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const productId = searchParams.get('id');

    // Fetch product details from API
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) {
                setError('No product ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    var productSliderOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    var productSliderSmlOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
    };

    if (loading) {
        return (
            <div className="right-content w-100">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="right-content w-100">
                <div className="alert alert-danger m-4" role="alert">
                    Error: {error || 'Product not found'}
                </div>
            </div>
        );
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
                            icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                            label="Products"
                            component="a"
                            href="#"
                        />
                        <StyledBreadcrumb
                            label="Product View"
                        />
                    </Breadcrumbs>
                </div>

                <div className="card productDetailsSection">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="sliderWrapper p-5">
                                <h6 className="mb-3">Product Gallery</h6>
                                {product.image && product.image.length > 0 ? (
                                    <>
                                        <Slider {...productSliderOptions} className="sliderBig mb-2" >
                                            {product.image.map((image, index) => (
                                                <div key={index} className="item">
                                                    <img src={image} className="w-100" alt={`${product.name} - Image ${index + 1}`} />
                                                </div>
                                            ))}
                                        </Slider>
                                        {product.image.length > 1 && (
                                            <Slider {...productSliderSmlOptions} className="sliderSml" >
                                                {product.image.map((image, index) => (
                                                    <div key={index} className="item">
                                                        <img src={image} className="w-100" alt={`${product.name} - Thumbnail ${index + 1}`} />
                                                    </div>
                                                ))}
                                            </Slider>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-5">
                                        <p className="text-muted">No images available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="p-5">
                                <h6 className="mb-3">Product Details</h6>
                                
                                <h4>{product.name}</h4>
                                
                                <div className="productInfo mt-3">
                                    <div className="row">
                                        <div className="col-sm-5 d-flex align-items-center">
                                            <span className="icon "><MdOutlineSportsSoccer /></span>
                                            <span className="name">Product ID</span>
                                        </div>
                                        <div className="col-sm-7">
                                            <span>{product._id}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-5 d-flex align-items-center">
                                            <span className="icon "><MdCategory /></span>
                                            <span className="name">Category</span>
                                        </div>
                                        <div className="col-sm-7">
                                            <span>{product.categories && product.categories.length > 0 ? product.categories.map((cat) => cat.name).join(', ') : 'Uncategorized'}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-5 d-flex align-items-center">
                                            <span className="icon"><MdFilterVintage /></span>
                                            <span className="name">Featured</span>
                                        </div>
                                        <div className="col-sm-7">
                                            <span className={`badge ${product.isFeatured ? 'bg-success' : 'bg-secondary'}`}>
                                                {product.isFeatured ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-5 d-flex align-items-center">
                                            <span className="icon "><IoStarSharp /></span>
                                            <span className="name">Ratings</span>
                                        </div>
                                        <div className="col-sm-7">
                                            <span>{product.rating || 0} / 5</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-5 d-flex align-items-center">
                                            <span className="icon "><IoIosPricetags /></span>
                                            <span className="name">Price</span>
                                        </div>
                                        <div className="col-sm-7">
                                            <span>$ {product.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <br/> <br/>
                                <h4 className="mt-4">Product Description</h4> 
                                <p>{product.description || 'No description available'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;