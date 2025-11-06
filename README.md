<p align="center">
  <img src="./JWlogo.png" alt="Jersey World Logo" width="300"/>
</p>

# **JerseyWorld – Full-Stack E-Commerce Platform**

JerseyWorld is a full-stack e-commerce platform designed for browsing, filtering, and purchasing official sports jerseys. It features a modern UI, secure authentication, an admin dashboard with full product management, and a scalable backend API.

---

## 🌐 **Website URLs**

- **Jersey World (Frontend):** http://localhost:5173  
- **Jersey World Admin (Admin Panel):** http://localhost:3000  

---

## 🔐 **Admin Access (Demo Credentials)**

To access the admin panel, use the login link located in the **footer** of the main site.

**Demo Credentials:**
- **Email:** admin@jerseyworld.com
- **Password:** jerseyworld99

The admin dashboard includes full product CRUD functionality, real-time cart and order tracking, and protected admin routes.

---

## 🚀 **Features**

### ✅ **Frontend**
- Modern, responsive UI built with **React** and **Tailwind CSS**
- **Product browsing**, filtering, and category-based navigation  
- **Search functionality** with multi-field logic  
- Detailed **product pages** with images, pricing, and descriptions  
- Fully functional **shopping cart** (add, update, remove items)  
- **About** and **Contact** pages  
- Smooth routing with **React Router**

### ✅ **Backend**
- RESTful API built using **Node.js**, **Express**, and **MongoDB**
- **JWT authentication** for secure access  
- Advanced **product search API** using multi-field AND logic  
- **Order & checkout flow** with unique order IDs  
- Dynamic **Best Sellers** module  
- Contact form submissions stored in the database  

### ✅ **Admin Dashboard**
- Complete **CRUD** for products  
- Manage **active carts** and **completed orders**  
- View customer messages from Contact page  
- Secure admin-only routes  
- Real-time database-driven views  

---

## 🛠 **Tech Stack**

### **Frontend**
React • Redux Toolkit • React Router • Tailwind CSS • React Icons  

### **Backend**
Node.js • Express • MongoDB/Mongoose • JWT Auth  

### **DevOps**
Docker • Docker Compose

---

## 📦 **Running the Project with Docker**

```bash
git clone <repo-url>
cd jerseyworld
docker-compose build
docker-compose up
