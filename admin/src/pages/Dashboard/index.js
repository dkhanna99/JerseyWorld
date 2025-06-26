import React, { useState, useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Badge from "@mui/material/Badge";
import { 
    FaDollarSign, 
    FaShoppingCart, 
    FaBox, 
    FaEnvelope, 
    FaPlus,
    FaEye,
    FaExclamationTriangle
} from "react-icons/fa";
import { Link } from "react-router-dom";
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

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.ADMIN_DASHBOARD);
            
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount) => {
        return `${parseFloat(amount).toFixed(2)}`;
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

    if (!dashboardData) {
        return (
            <div className="right-content w-100">
                <div className="alert alert-warning m-4" role="alert">
                    No dashboard data available
                </div>
            </div>
        );
    }

    const { metrics, recentOrders, recentMessages } = dashboardData;

    return (
        <div className="right-content w-100">
            {/* Header */}
            <div className="card shadow border-0 w-100 flex-row p-4 m-0">
                <h5 className="mb-0">Dashboard</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                </Breadcrumbs>
            </div>

            {/* Quick Actions */}
            <div className="card shadow border-0 w-100 p-4 mt-3 m-0">
                <h6 className="mb-3">Quick Actions</h6>
                <div className="d-flex gap-2 flex-wrap">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPlus />}
                        component={Link}
                        to="/product/upload"
                    >
                        Add Product
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FaEye />}
                        component={Link}
                        to="/orders?section=orders"
                    >
                        View Orders
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FaEnvelope />}
                        component={Link}
                        to="/contact-messages"
                    >
                        Contact Messages
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FaShoppingCart />}
                        component={Link}
                        to="/orders?section=carts"
                    >
                        Active Carts
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="row mt-3">
                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <CardContent className="text-center">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <FaDollarSign className="text-success me-2" size={24} />
                                <Typography variant="h4" component="div" className="text-success">
                                    {formatCurrency(metrics.totalRevenue)}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="text.secondary">
                                Total Revenue
                            </Typography>
                            <div className="mt-2">
                                <small className="text-muted">
                                    Today: {formatCurrency(metrics.todayRevenue)} | 
                                    Week: {formatCurrency(metrics.weekRevenue)}
                                </small>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <CardContent className="text-center">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <FaShoppingCart className="text-primary me-2" size={24} />
                                <Typography variant="h4" component="div" className="text-primary">
                                    {metrics.totalOrders}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="text.secondary">
                                Total Orders
                            </Typography>
                            <div className="mt-2">
                                <small className="text-muted">
                                    Today: {metrics.todayOrders} | 
                                    Week: {metrics.weekOrders}
                                </small>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <CardContent className="text-center">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <FaBox className="text-info me-2" size={24} />
                                <Typography variant="h4" component="div" className="text-info">
                                    {metrics.totalProducts}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="text.secondary">
                                Total Products
                            </Typography>
                            <div className="mt-2">
                                <small className="text-muted">
                                    Featured: {metrics.featuredProducts} | 
                                    No Images: {metrics.productsWithoutImages}
                                </small>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-md-3 mb-3">
                    <Card className="h-100">
                        <CardContent className="text-center">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <Badge badgeContent={metrics.unreadMessages} color="error">
                                    <FaEnvelope className="text-warning me-2" size={24} />
                                </Badge>
                                <Typography variant="h4" component="div" className="text-warning">
                                    {metrics.unreadMessages}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="text.secondary">
                                Unread Messages
                            </Typography>
                            <div className="mt-2">
                                <small className="text-muted">
                                    Active Carts: {metrics.activeCarts}
                                </small>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="row mt-3">
                {/* Recent Orders */}
                <div className="col-md-6 mb-3">
                    <Card className="h-100">
                        <CardContent>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Typography variant="h6" component="div">
                                    Recent Orders
                                </Typography>
                                <Button
                                    size="small"
                                    component={Link}
                                    to="/orders?section=orders"
                                >
                                    View All
                                </Button>
                            </div>
                            {recentOrders.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" className="text-center py-3">
                                    No recent orders
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} elevation={0}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order #</TableCell>
                                                <TableCell>Customer</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                                <TableCell align="right">Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentOrders.map((order) => (
                                                <TableRow key={order.id} hover>
                                                    <TableCell>
                                                        <strong>{order.orderNumber}</strong>
                                                    </TableCell>
                                                    <TableCell>{order.customerName}</TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(order.total)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <small>{formatDate(order.date)}</small>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Messages */}
                <div className="col-md-6 mb-3">
                    <Card className="h-100">
                        <CardContent>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Typography variant="h6" component="div">
                                    Recent Messages
                                </Typography>
                                <Button
                                    size="small"
                                    component={Link}
                                    to="/contact-messages"
                                >
                                    View All
                                </Button>
                            </div>
                            {recentMessages.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" className="text-center py-3">
                                    No recent messages
                                </Typography>
                            ) : (
                                <div>
                                    {recentMessages.map((message) => (
                                        <div key={message.id} className="border-bottom pb-2 mb-2">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <strong>{message.name}</strong>
                                                    <br />
                                                    <small className="text-muted">{message.email}</small>
                                                </div>
                                                <div className="text-end">
                                                    {message.status === 'unread' && (
                                                        <FaExclamationTriangle className="text-warning" size={12} />
                                                    )}
                                                    <br />
                                                    <small className="text-muted">{formatDate(message.date)}</small>
                                                </div>
                                            </div>
                                            <p className="mb-0 mt-1 small">{message.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Alerts Section */}
            {(metrics.productsWithoutImages > 0 || metrics.unreadMessages > 0) && (
                <div className="card shadow border-0 w-100 p-4 mt-3">
                    <h6 className="mb-3">Alerts</h6>
                    <div className="row">
                        {metrics.productsWithoutImages > 0 && (
                            <div className="col-md-6">
                                <div className="alert alert-warning d-flex align-items-center" role="alert">
                                    <FaExclamationTriangle className="me-2" />
                                    <div>
                                        <strong>Products without images:</strong> {metrics.productsWithoutImages} products need images
                                    </div>
                                </div>
                            </div>
                        )}
                        {metrics.unreadMessages > 0 && (
                            <div className="col-md-6">
                                <div className="alert alert-info d-flex align-items-center" role="alert">
                                    <FaEnvelope className="me-2" />
                                    <div>
                                        <strong>Unread messages:</strong> {metrics.unreadMessages} messages need attention
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;