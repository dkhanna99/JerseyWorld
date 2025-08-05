# Dhruv Khanna (86797909)

## Assignment 3

**Website Names**:

- **Jersey World** (Frontend) – available at `http://localhost:5173`
- **Jersey World Admin** (Admin Panel) – available at `http://localhost:3000`

---

### What I Built

This assignment extends the Jersey World e-commerce site from Assignment 2 by integrating a full backend with Node.js,
Express.js, and MongoDB. I created a RESTful API that powers the frontend and an admin dashboard with full CRUD
functionality.

---

### ✅ Core Features Implemented

- **Complete REST API** built with Express and MongoDB
- **Product Search** with multi-field "AND" logic (name, description, variants, categories)
- **Best Sellers Category**:
    - At least 1 product from each category
    - Shown dynamically on the homepage
- **Checkout System**:
    - Converts cart into order
    - Generates a unique order ID
- **Admin Dashboard**:
    - View all active carts
    - View all completed orders
    - Add, update, and delete products
    - Receive messages from “Contact Us” form
- **Protected Routes** for Admin pages

---

### 🌟 Extra Feature

I built a fully functional **admin panel** with CRUD operations for products, real-time cart/order tracking, and secure
access through protected routes. The system also integrates a contact form that submits user messages to the admin
dashboard — all data-driven and backed by MongoDB.

---

### 🚀 How to Run via Docker

1. Clone the repository and checkout the `Assignment3` branch:
   ```bash
   git clone https://github.students.cs.ubc.ca/CPSC455-2025S/students-khanna99.git
   cd students-khanna99
   git checkout Assignment3
   ```
2. Run the app with Docker Compose:

```bash
docker-compose build
docker-compose up
```

### 🔗 Access the Application

- **Frontend (Jersey World)**: [http://localhost:5173](http://localhost:5173)
- **Admin Panel (Jersey World Admin)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)