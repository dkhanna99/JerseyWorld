import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
import { API_ENDPOINTS } from "../../config";

// Breadcrumb styling
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

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINTS.PRODUCTS);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle delete product
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                // Remove product from state
                setProducts(products.filter(product => product._id !== productId));
                alert('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    // Handle edit product (navigate to edit page)
    const handleEditProduct = (productId) => {
        navigate(`/product/upload?id=${productId}`);
    };

    // Handle view product details
    const handleViewProduct = (productId) => {
        navigate(`/product/details?id=${productId}`);
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

    if (error) {
        return (
            <div className="right-content w-100">
                <div className="alert alert-danger m-4" role="alert">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card shadow border-0 w-100 flex-row p-4">
                <h5 className="mb-0">Products Management</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        label="Products"
                    />
                </Breadcrumbs>
            </div>

            {/* Add Product Button */}
            <div className="card shadow border-0 w-100 p-4 mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">All Products ({products.length})</h6>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        onClick={() => window.location.href = '/product/upload'}
                    >
                        Add New Product
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="card shadow border-0 w-100 p-4 mt-3">
                {products.length === 0 ? (
                    <div className="text-center py-5">
                        <h6 className="text-muted">No products found</h6>
                        <p className="text-muted">Start by adding your first product</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>
                                            <div style={{ width: '60px', height: '60px' }}>
                                                <LazyLoadImage
                                                    alt={product.name}
                                                    effect="blur"
                                                    className="w-100 h-100 object-fit-cover rounded"
                                                    src={product.image && product.image.length > 0 ? product.image[0] : '/placeholder-image.jpg'}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{product.name}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {product.description && product.description.length > 50 
                                                        ? `${product.description.substring(0, 50)}...` 
                                                        : product.description}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary">
                                                {product.category ? product.category.name : 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td>
                                            <strong>${product.basePrice}</strong>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="text-warning me-1">★</span>
                                                <span>{product.rating || 0}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${product.isFeatured ? 'bg-success' : 'bg-light text-dark'}`}>
                                                {product.isFeatured ? 'Featured' : 'Regular'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => handleViewProduct(product._id)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="warning"
                                                    onClick={() => handleEditProduct(product._id)}
                                                    title="Edit Product"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    title="Delete Product"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;