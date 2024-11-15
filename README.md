# Car Management Backend API

This is a Node.js backend API for a Car Management System, supporting user authentication, CRUD operations for cars, and image upload functionality.

---

## Table of Contents
1. [Features](#features)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Database Setup](#database-setup)
5. [API Documentation](#api-documentation)
6. [Usage](#usage)
7. [Folder Structure](#folder-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

### Features

- User registration and login with JWT authentication.
- CRUD operations for cars, including upload and retrieval of car images.
- CORS configuration for secure API access from specific origins.
- Search functionality to filter through user's cars based on keywords.

---

### Technologies

- **Node.js** - Backend runtime
- **Express** - Web framework
- **SQLite** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Token-based authentication
- **multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository
2. **Frontend Installation**
   ```bash
   cd frontend
   npm install
3. **Backend Installation:**
   ```bash
   cd backend
   npm install
4. **Run the Server:**
   ```bash
   node index.js

**API Documentation**

## Base URL: 

```bash
http://localhost:3000
```

## Authentication

POST /api/auth/register - Register a new user.

POST /api/auth/login - Login user to receive a JWT token.

**Products**

POST /api/products - Add a new product (authentication required).

GET /api/products - Retrieve all products.

GET /api/products/

- Retrieve a specific product by ID.

PUT /api/products/

- Update a specific product (authentication required).
  
DELETE /api/products/

- Delete a specific product (authentication required).

**Product Images**

POST /api/products/
/images - Upload an image for a product (authentication required).

---

**Database Setup**

**Initialize SQLite Database:**

Ensure SQLite3 is installed.

In the backend directory, create and structure database.db with the following tables:

The tables are mentioned in the database.sql file

**Database File:** The SQLite database is saved as database.db in the backend folder.

---

## Usage

- Login as a user to obtain a JWT token.
- Pass the token in the Authorization header as Bearer <token> for requests that require authentication.
- Manage Products: Add, update, delete, and view products as an authenticated user.
- Image Upload: Upload images for specific products after product creation.

---

## File Structure

# Backend

backend/
├── node_modules/
├── uploads/                  # Stores uploaded images
├── database.db               # SQLite database file
├── database.sql              # SQL file for database schema
├── .gitignore
├── index.js                  # Entry point of the backend application
├── package.json              # Backend dependencies and scripts
└── package-lock.json

# Frontend

frontend/
├── node_modules/
├── public/
├── src/
│   ├── component/
│   │   ├── CreateProduct/       # Component for creating a new product
│   │   ├── Header/              # Header component
│   │   ├── Login/               # Login component
│   │   ├── LoginWrapper/        # Component wrapping login for conditional rendering
│   │   ├── ProductDetails/      # Component for displaying product details
│   │   ├── ProductList/         # Component listing all products
│   │   └── ProtectedRoute/      # Component for route protection
│   ├── App.css                  # Styling for App component
│   ├── App.js                   # Main React component
│   └── App.test.js              # Testing file for App component
├── package.json                # Frontend dependencies and scripts
└── package-lock.json

---

## Contributing

Contributions are welcome! Please fork the repository, create a new branch for your feature, and submit a pull request.

---

## License

This project is licensed under the MIT License.

This `README.md` is tailored for your project structure and includes essential details on setup, database, API, usage, and the overall file structure. Adjust any specific names, URLs, or paths as needed based on your actual project details.

---
