# E-Commerce MERN Application

A full-stack e-commerce application built with MongoDB, Express.js, React.js, and Node.js (MERN stack). This application features user authentication, product management, shopping cart, order processing, payment integration, and a comprehensive admin dashboard.

## Features

### Customer Features
- User registration and authentication
- Email verification and password reset
- Product browsing with search and filters
- Product categories and subcategories
- Shopping cart management
- Wishlist functionality
- Secure checkout process
- Payment integration with Stripe
- Order tracking and history
- User profile and address management
- Product reviews and ratings

### Admin Dashboard Features
- Dashboard with analytics and statistics
- User management (view, edit roles, delete)
- Product management (CRUD operations)
- Category management (CRUD operations)
- Order management and status updates
- Sales analytics and reporting
- Image upload for products
- Inventory management
- Low stock alerts

## Backend Complete ✅

The backend is fully implemented with:
- Complete REST API with all endpoints
- MongoDB models and database integration
- JWT authentication system
- Admin dashboard functionality
- File upload with Cloudinary
- Email notifications
- Payment processing with Stripe
- Comprehensive error handling
- Input validation and security

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (already configured)
- Cloudinary account (for image uploads)
- Stripe account (for payments)
- Gmail account (for email services)

### Backend Setup

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   The `.env` file is already configured with MongoDB connection.
   Update these additional credentials:
   ```env
   JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Start the backend server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /forgot-password` - Password reset request
- `PUT /reset-password/:token` - Reset password
- `GET /verify-email/:token` - Verify email

### Products (`/api/products`)
- `GET /` - Get all products (with filters, search, pagination)
- `GET /featured` - Get featured products
- `GET /:id` - Get single product
- `POST /:id/reviews` - Add product review

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `GET /tree` - Get category hierarchy
- `GET /:id` - Get single category

### Cart (`/api/cart`)
- `GET /` - Get user cart
- `POST /add` - Add item to cart
- `PUT /item/:itemId` - Update cart item
- `DELETE /item/:itemId` - Remove from cart

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `PUT /:id/status` - Update order status

### Payments (`/api/payments`)
- `POST /create-intent` - Create Stripe payment intent
- `POST /confirm` - Confirm payment
- `GET /history` - Get payment history

### Admin Dashboard (`/api/admin`)
- `GET /dashboard` - Dashboard statistics
- `GET /users` - Manage users
- `POST /products` - Create products
- `PUT /products/:id` - Update products
- `DELETE /products/:id` - Delete products
- `POST /categories` - Create categories
- `GET /orders` - Manage all orders

## Database Models

- **User**: Authentication, profiles, addresses, wishlist
- **Product**: Details, images, variants, reviews, SEO
- **Category**: Hierarchical categories with featured products
- **Order**: Complete order management with status tracking
- **Cart**: User shopping cart with item management

## Security Features

✅ JWT authentication
✅ Password hashing with bcrypt
✅ Rate limiting
✅ Input validation
✅ CORS configuration
✅ File upload restrictions
✅ Admin role protection

## Next Steps

The backend is complete and ready for frontend development. You can now:

1. Test all API endpoints using Postman or similar tools
2. Start developing the React frontend
3. Implement the admin dashboard UI
4. Add payment integration on frontend
5. Deploy both backend and frontend

## Testing the Backend

You can test the API using tools like Postman. All endpoints are documented above with their respective HTTP methods and expected payloads.

---

**Backend Status: ✅ COMPLETE**
Ready for frontend development and integration!