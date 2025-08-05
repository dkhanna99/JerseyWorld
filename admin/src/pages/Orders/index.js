import React, { useState, useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { FaEye, FaPrint } from "react-icons/fa";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css";
import { API_ENDPOINTS } from "../../config";
import { useSearchParams } from 'react-router-dom';

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

const Orders = () => {
    const [searchParams] = useSearchParams();
    const section = searchParams.get('section') || 'orders';
    const [orders, setOrders] = useState([]);
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({});

    // Fetch data from API
    useEffect(() => {
        fetchData();
    }, [section]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            if (section === 'orders') {
                const response = await fetch(API_ENDPOINTS.ADMIN_ORDERS);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
                calculateStats(data, []);
            } else {
                const response = await fetch(API_ENDPOINTS.ADMIN_CARTS);
                if (!response.ok) {
                    throw new Error('Failed to fetch carts');
                }
                const data = await response.json();
                setCarts(data);
                calculateStats([], data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (allOrders, allCarts) => {
        const totalOrders = allOrders.length;
        const totalCarts = allCarts.length;
        const totalRevenue = allOrders.reduce((sum, order) => {
            const orderTotal = order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
            return sum + orderTotal;
        }, 0);
        const cartValue = allCarts.reduce((sum, cart) => {
            const cartTotal = cart.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
            return sum + cartTotal;
        }, 0);

        setStats({
            totalOrders,
            totalCarts,
            totalRevenue: totalRevenue.toFixed(2),
            cartValue: cartValue.toFixed(2)
        });
    };

    // Handle view details
    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Calculate total
    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
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
                <h5 className="mb-0">Orders & Carts Management</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        label="Orders & Carts"
                    />
                </Breadcrumbs>
            </div>

            {/* Stats Cards */}
            <div className="row mt-3">
                <div className="col-md-3">
                    <div className="card text-center p-3">
                        <h4 className="text-primary">{stats.totalOrders || 0}</h4>
                        <small className="text-muted">Total Orders</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3">
                        <h4 className="text-info">{stats.totalCarts || 0}</h4>
                        <small className="text-muted">Active Carts</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3">
                        <h4 className="text-success">${stats.totalRevenue || '0.00'}</h4>
                        <small className="text-muted">Total Revenue</small>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center p-3">
                        <h4 className="text-warning">${stats.cartValue || '0.00'}</h4>
                        <small className="text-muted">Cart Value</small>
                    </div>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="card shadow border-0 w-100 p-4 mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">
                        {section === 'orders' && `All Orders (${orders.length})`}
                        {section === 'carts' && `Active Carts (${carts.length})`}
                    </h6>
                    <div className="btn-group" role="group">
                        <Button
                            variant={section === 'orders' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => window.location.href = '/orders?section=orders'}
                        >
                            All Orders
                        </Button>
                        <Button
                            variant={section === 'carts' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => window.location.href = '/orders?section=carts'}
                        >
                            Active Carts
                        </Button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            {section === 'orders' && (
                <div className="card shadow border-0 w-100 p-4 mt-3">
                    {orders.length === 0 ? (
                        <div className="text-center py-5">
                            <h6 className="text-muted">No orders found</h6>
                            <p className="text-muted">Orders will appear here when customers place them</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>
                                                <strong>{order.orderNumber}</strong>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{order.shopperName}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {order.email}
                                                    </small>
                                                    {order.phone && (
                                                        <>
                                                            <br />
                                                            <small className="text-muted">
                                                                {order.phone}
                                                            </small>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ maxWidth: '300px' }}>
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-1">
                                                            <div style={{ width: '30px', height: '30px', marginRight: '8px' }}>
                                                                <LazyLoadImage
                                                                    alt="Product"
                                                                    effect="blur"
                                                                    className="w-100 h-100 object-fit-cover rounded"
                                                                    src={item.productId?.image?.[0] || '/placeholder-image.jpg'}
                                                                />
                                                            </div>
                                                            <div>
                                                                <small>
                                                                    {item.productId?.name || 'Product'} 
                                                                    (Qty: {item.quantity})
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <strong>${calculateTotal(order.items)}</strong>
                                            </td>
                                            <td>
                                                <small>{formatDate(order.createdAt)}</small>
                                            </td>
                                            <td>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => handleViewDetails(order)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Carts Table */}
            {section === 'carts' && (
                <div className="card shadow border-0 w-100 p-4 mt-3">
                    {carts.length === 0 ? (
                        <div className="text-center py-5">
                            <h6 className="text-muted">No active carts found</h6>
                            <p className="text-muted">Active carts will appear here when customers add items</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Cart ID</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carts.map((cart) => (
                                        <tr key={cart._id}>
                                            <td>
                                                <strong>{cart.cartId}</strong>
                                            </td>
                                            <td>
                                                <div style={{ maxWidth: '300px' }}>
                                                    {cart.items.map((item, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-1">
                                                            <div style={{ width: '30px', height: '30px', marginRight: '8px' }}>
                                                                <LazyLoadImage
                                                                    alt="Product"
                                                                    effect="blur"
                                                                    className="w-100 h-100 object-fit-cover rounded"
                                                                    src={item.productId?.image?.[0] || '/placeholder-image.jpg'}
                                                                />
                                                            </div>
                                                            <div>
                                                                <small>
                                                                    {item.productId?.name || 'Product'} 
                                                                    (Qty: {item.quantity})
                                                                </small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <strong>${calculateTotal(cart.items)}</strong>
                                            </td>
                                            <td>
                                                <small>{formatDate(cart.createdAt)}</small>
                                            </td>
                                            <td>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => handleViewDetails(cart)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {showModal && selectedItem && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {section === 'orders' ? `Order Details - ${selectedItem.orderNumber}` : `Cart Details - ${selectedItem.cartId}`}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {section === 'orders' && (
                                    <>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <strong>Customer Name:</strong> {selectedItem.shopperName}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Email:</strong> {selectedItem.email}
                                            </div>
                                        </div>
                                        {selectedItem.phone && (
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <strong>Phone:</strong> {selectedItem.phone}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Order Date:</strong> {formatDate(selectedItem.createdAt)}
                                                </div>
                                            </div>
                                        )}
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <strong>Order Total:</strong> ${calculateTotal(selectedItem.items)}
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {section === 'carts' && (
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <strong>Cart ID:</strong> {selectedItem.cartId}
                                        </div>
                                        <div className="col-md-6">
                                            <strong>Created:</strong> {formatDate(selectedItem.createdAt)}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mb-3">
                                    <strong>{section === 'orders' ? 'Order Items:' : 'Cart Items:'}</strong>
                                    <div className="table-responsive mt-2">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedItem.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div style={{ width: '40px', height: '40px', marginRight: '10px' }}>
                                                                    <LazyLoadImage
                                                                        alt="Product"
                                                                        effect="blur"
                                                                        className="w-100 h-100 object-fit-cover rounded"
                                                                        src={item.productId?.image?.[0] || '/placeholder-image.jpg'}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <strong>{item.productId?.name || 'Product'}</strong>
                                                                    {item.attributeId && (
                                                                        <>
                                                                            <br />
                                                                            <small className="text-muted">
                                                                                Variant: {item.attributeId.color} - {item.attributeId.size}
                                                                            </small>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>${item.price}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button
                                    variant="outlined"
                                    startIcon={<FaPrint />}
                                    onClick={() => window.print()}
                                >
                                    Print {section === 'orders' ? 'Order' : 'Cart'}
                                </Button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Backdrop */}
            {showModal && (
                <div className="modal-backdrop fade show"></div>
            )}
        </div>
    );
};

export default Orders; 