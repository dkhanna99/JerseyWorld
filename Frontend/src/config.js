// API Configuration
export const API_BASE_URL = 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
    PRODUCTS: `${API_BASE_URL}/api/products`,
    CATEGORIES: `${API_BASE_URL}/api/category`,
    CART: `${API_BASE_URL}/api/cart`,
    // Add other endpoints here as needed
    // USERS: `${API_BASE_URL}/api/users`,
};

// Environment configuration
export const CONFIG = {
    API_BASE_URL,
    API_ENDPOINTS,
    // Add other configuration constants here
}; 