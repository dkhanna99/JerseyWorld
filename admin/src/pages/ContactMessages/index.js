import React, { useState, useEffect } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { FaEye, FaTrash, FaCheck, FaReply } from "react-icons/fa";
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

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch messages from API
    useEffect(() => {
        fetchMessages();
        fetchStats();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_ENDPOINTS.CONTACT}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            
            const data = await response.json();
            setMessages(data.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_ENDPOINTS.CONTACT}/stats/summary`);
            
            if (response.ok) {
                const data = await response.json();
                setStats(data.data || {});
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Handle status update
    const handleStatusUpdate = async (messageId, newStatus) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.CONTACT}/${messageId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setMessages(prev => prev.map(msg => 
                msg._id === messageId ? { ...msg, status: newStatus } : msg
            ));
            
            // Refresh stats
            fetchStats();
            
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    // Handle delete message
    const handleDeleteMessage = async (messageId) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const response = await fetch(`${API_ENDPOINTS.CONTACT}/${messageId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete message');
                }

                // Remove message from state
                setMessages(prev => prev.filter(msg => msg._id !== messageId));
                
                // Refresh stats
                fetchStats();
                
                alert('Message deleted successfully!');
            } catch (error) {
                console.error('Error deleting message:', error);
                alert('Failed to delete message');
            }
        }
    };

    // Handle view message details
    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setShowModal(true);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'unread':
                return 'bg-danger';
            case 'read':
                return 'bg-warning';
            case 'replied':
                return 'bg-success';
            default:
                return 'bg-secondary';
        }
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
                <h5 className="mb-0">Contact Messages</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <StyledBreadcrumb
                        component="a"
                        href="#"
                        label="Dashboard"
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb
                        label="Contact Messages"
                    />
                </Breadcrumbs>
            </div>

            {/* Stats Cards */}
            <div className="row mt-3">
                <div className="col-md-2">
                    <div className="card text-center p-3">
                        <h4 className="text-primary">{stats.total || 0}</h4>
                        <small className="text-muted">Total Messages</small>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center p-3">
                        <h4 className="text-danger">{stats.unread || 0}</h4>
                        <small className="text-muted">Unread</small>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center p-3">
                        <h4 className="text-warning">{stats.read || 0}</h4>
                        <small className="text-muted">Read</small>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center p-3">
                        <h4 className="text-success">{stats.replied || 0}</h4>
                        <small className="text-muted">Replied</small>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card text-center p-3">
                        <h4 className="text-info">{stats.recent || 0}</h4>
                        <small className="text-muted">Last 7 Days</small>
                    </div>
                </div>
            </div>

            {/* Messages Table */}
            <div className="card shadow border-0 w-100 p-4 mt-3">
                {messages.length === 0 ? (
                    <div className="text-center py-5">
                        <h6 className="text-muted">No contact messages found</h6>
                        <p className="text-muted">Messages from the contact form will appear here</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((message) => (
                                    <tr key={message._id}>
                                        <td>
                                            <strong>{message.name}</strong>
                                        </td>
                                        <td>
                                            <a href={`mailto:${message.email}`} className="text-decoration-none">
                                                {message.email}
                                            </a>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '300px' }}>
                                                {message.message.length > 100 
                                                    ? `${message.message.substring(0, 100)}...` 
                                                    : message.message}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(message.status)}`}>
                                                {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <small>{formatDate(message.createdAt)}</small>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => handleViewMessage(message)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </Button>
                                                {message.status === 'unread' && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="warning"
                                                        onClick={() => handleStatusUpdate(message._id, 'read')}
                                                        title="Mark as Read"
                                                    >
                                                        <FaCheck />
                                                    </Button>
                                                )}
                                                {message.status !== 'replied' && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="success"
                                                        onClick={() => handleStatusUpdate(message._id, 'replied')}
                                                        title="Mark as Replied"
                                                    >
                                                        <FaReply />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleDeleteMessage(message._id)}
                                                    title="Delete Message"
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

            {/* Message Detail Modal */}
            {showModal && selectedMessage && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Message Details</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong>Name:</strong> {selectedMessage.name}
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Email:</strong> 
                                        <a href={`mailto:${selectedMessage.email}`} className="ms-2">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong>Status:</strong> 
                                        <span className={`badge ${getStatusBadge(selectedMessage.status)} ms-2`}>
                                            {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <strong>Message:</strong>
                                    <div className="mt-2 p-3 bg-light rounded">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
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

export default ContactMessages; 