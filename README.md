# 🛍️ NodeJs Backend Ecommerce API

Hello there 👋,
**backend API of an e-commerce platform** using **Node.js** and **MongoDB**.

This project aims to build a **backend API for an e-commerce platform**, handling tasks such as:

- Managing products
- Processing orders
- Handling shopping carts

The API is designed to be consumed by a client (such as a frontend application), enabling **seamless integration for users** to interact with.

---

## 🚀 Features

- **Product Management** – Create, update, delete, and fetch products
- **Order Management** – Place, refund, and manage orders
- **Shopping Cart** – Add/remove items, update quantities, and checkout
- **User Authentication** (JWT-based) – Secure access for customers
- **MongoDB Integration** – Data persistence with Mongoose

---

## 🛠️ Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework for building APIs
- **MongoDB & Mongoose** – Database & ODM
- **JWT (JSON Web Token)** – Authentication & Authorization
- **dotenv** – Environment configuration

---

## 📂 Project Structure

```
NodeJs-backend-Ecommerce-API/
├── config/          # Configuration files (DB, environment, etc.)
├── controllers/     # Business logic for each route
├── models/          # Mongoose models (User,Category, Product, Cart, Order.)
├── routes/          # API route definitions
├── middleware/      # Authentication, validation, error handling
├── utils/           # Helper functions
├── server.js        # App entry point
├── utils/           # Reusable helpers/utilities
├── tests/           # Test specs (unit/integration)
└── package.json     # Project metadata and dependencies
```

---

## 📌 API Endpoints

#### See the Full api docs at

https://documenter.getpostman.com/view/3905853/2sB3BLjnVE#get-started-here

### **Products**

- `GET /api/products` list products
- `POST /api/products` – Create a new product
- `GET /api/products/:id` – Fetch product by ID
- `PUT /api/products/:id` – Update product
- `DELETE /api/products/:id` – Delete product

### **Cart**

- `POST /api/cart` – Add item to cart
- `GET /api/cart` – Get user’s cart
- `PUT /api/cart/:id` – Update item in cart
- `DELETE /api/cart/:id` – Remove item from cart

### **Orders**

- `POST /api/orders` – Place a new order
- `GET /api/orders` – Get all user orders
- `GET /api/orders/:id` – Get order details

---

## ✅ Future Improvements

- Add payment gateway integration
- Improve error handling & validation
- Implement admin panel endpoints
- Add testing (Jest, Supertest)

---

## 📜 License

This project is licensed under the **MIT License**.

---

### 1. Clone the Repository

```bash
git clone https://github.com/wajdifadool/NodeJs-backend-Ecommerce-API.git
cd NodeJs-backend-Ecommerce-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Run the Server

```bash
npm start
```

Server will start on `http://localhost:5000` 🚀
