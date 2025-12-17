# BookCourier – Backend Server

## 📦 Server Overview

**BookCourier Backend Server** is the core API that powers the BookCourier Library-to-Home Delivery System. This Node.js and Express-based server handles all business logic, data management, and API operations for the entire platform. It connects seamlessly with the client-side React application to provide a complete, end-to-end library delivery management solution.

The server manages user authentication, book catalog operations, order processing, review systems, and role-based access control for different user types (customers, librarians, and administrators).

## 🎯 Server Purpose

**Problem Solved:**

- Centralized management of complex library delivery workflows
- Secure handling of user data and authentication
- Efficient organization and retrieval of book inventory
- Processing and tracking of delivery orders
- Role-based authorization for different user types

**Solution Provided:**
The backend server provides a robust REST API that enables:

- User registration, authentication, and profile management
- Complete book inventory management
- Order creation, tracking, and status updates
- Review and rating functionality
- Role-based access control and permissions
- Integration with payment processing (Stripe)
- Real-time data synchronization with the client application

---

## 🌐 Server URLs

**Local Development:**

```
http://localhost:3000/
```

**Live Production Server:**

```
https://book-courier-server-kappa.vercel.app/
```

---

## 🛠 Technologies Used

- **Node.js** - Runtime environment for server-side JavaScript
- **Express.js** - Web application framework for building REST APIs
- **MongoDB** - NoSQL database for data storage and management
- **Firebase Admin SDK** - Authentication and user management
- **Stripe** - Payment processing and transaction handling
- **CORS** - Cross-Origin Resource Sharing for client-server communication
- **dotenv** - Environment variable management
- **MongoDB Driver** - Official MongoDB client for Node.js

---

## 🗄 Database Information

**Database System:** MongoDB (Cloud-hosted on MongoDB Atlas)

The server uses MongoDB to store and organize data across multiple collections:

**Core Collections:**

- **users** - Stores user profiles, authentication details, and role information
- **books** - Maintains book catalog with title, author, ISBN, availability status, and library references
- **orders** - Records delivery requests, order status, and customer delivery information
- **reviews** - Stores user ratings and reviews for books
- **libraries** - Information about partner libraries and their locations

**Additional Collections:**

- **transactions** - Payment and order transaction records
- **inventory** - Library-specific book inventory tracking
- **notifications** - User notifications and communication logs

Each collection is designed to maintain data integrity and support efficient querying for the client application.

---

## 📡 API Endpoints Overview

The server provides a comprehensive set of REST API endpoints organized by functionality:

### User Management APIs

- User registration and authentication
- User profile retrieval and updates
- User role management and permissions
- Account management and security

### Book Management APIs

- Browse and search book catalog
- Retrieve detailed book information
- Manage book inventory (Librarian feature)
- Update book availability status

### Order Management APIs

- Create new delivery orders
- Retrieve order history and status
- Update order status (in transit, delivered, etc.)
- Cancel or modify orders

### Review APIs

- Submit book reviews and ratings
- Retrieve reviews for specific books
- Update and delete user reviews
- Calculate average ratings

### Admin & Librarian APIs

- User role assignment and modification
- System-wide statistics and analytics
- Inventory management and reporting
- Order monitoring and management

### Payment APIs

- Process payment transactions through Stripe
- Payment verification and confirmation
- Transaction history retrieval

All endpoints require appropriate authentication and authorization based on user roles.

---

## 👥 User Roles Handled by Server

### 👤 Normal User (Customer)

- User registration and authentication
- Browse available books and libraries
- Create and manage book delivery orders
- Add books to wishlist
- Submit and manage book reviews
- View personal order history
- Update profile information
- Track delivery status in real-time

### 📖 Librarian

- Authentication with librarian privileges
- Add, update, and delete books from library catalog
- Manage inventory for their assigned library
- Process and manage customer orders
- Update order status and delivery information
- View order-specific reports and statistics
- Manage library-specific settings

### 🔐 Admin

- Full authentication and authorization
- Manage all users in the system (create, read, update, delete)
- Assign and modify user roles
- Monitor all orders across the platform
- Access comprehensive system statistics and analytics
- Manage all libraries and their information
- System configuration and maintenance

---

## 🚀 How to Run the Server Locally

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB account (for database connection string)
- Stripe account (for payment integration)

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd __Server-Side
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory
   - Add the following variables:

   ```
   DB_USERNAME=your_mongodb_username
   DB_PASSWORD=your_mongodb_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server:**

   ```bash
   node index.js
   ```

   The server will start at `http://localhost:3000/`

5. **For development with auto-reload (optional):**
   ```bash
   npm install -g nodemon
   nodemon index.js
   ```

---

## ⚙ Environment Variables

The following environment variables are required for the server to function properly:

| Variable            | Description           | Example                       |
| ------------------- | --------------------- | ----------------------------- |
| `DB_USERNAME`       | MongoDB username      | `bookcourier_user`            |
| `DB_PASSWORD`       | MongoDB password      | `your_secure_password`        |
| `STRIPE_SECRET_KEY` | Stripe API secret key | `sk_live_...`                 |
| `PORT`              | Server port           | `3000`                        |
| `NODE_ENV`          | Environment type      | `development` or `production` |

**Important:** Never commit `.env` files to version control. Always use `.env.example` template for reference.

---

## 📝 Conclusion

BookCourier Backend Server is the backbone of the entire library delivery management system. It provides a secure, scalable, and efficient API infrastructure that enables seamless communication between clients and the database. By handling authentication, data management, payment processing, and role-based access control, the server ensures that BookCourier delivers a reliable and professional service to users, librarians, and administrators alike.

The modular design and comprehensive API structure make it easy to extend functionality and integrate with various client applications and third-party services.

---

## 📄 Additional Information

- **API Documentation:** Available upon request or through Postman collection
- **Database Backups:** Configured on MongoDB Atlas
- **Deployment:** Hosted on Vercel with automatic deployments from the main branch
- **Support:** For issues or queries, contact the development team
