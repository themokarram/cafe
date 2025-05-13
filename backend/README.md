# Tandoori Cafe Backend

This is the backend server for the Tandoori Cafe application. It provides APIs for user authentication, order management, and payment processing.

## Features

- User authentication with JWT and Google OAuth
- User profile and address management
- Order creation and management
- Payment processing with Razorpay
- Admin functionality for order management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials
- Razorpay account

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tandoori-cafe
   JWT_SECRET=your-super-secret-jwt-key
   SESSION_SECRET=your-session-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/signin` - Login with email and password
- GET `/api/auth/google` - Login with Google
- GET `/api/auth/google/callback` - Google OAuth callback

### User Profile

- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/addresses` - Add new address
- GET `/api/users/addresses` - Get all addresses
- PUT `/api/users/addresses/:addressId` - Update address
- DELETE `/api/users/addresses/:addressId` - Delete address

### Orders

- POST `/api/orders` - Create new order
- GET `/api/orders` - Get all orders
- GET `/api/orders/:orderId` - Get single order
- PATCH `/api/orders/:orderId/status` - Update order status (admin only)
- POST `/api/orders/:orderId/cancel` - Cancel order

### Payments

- POST `/api/payments/create-order` - Create Razorpay order
- POST `/api/payments/verify` - Verify payment
- GET `/api/payments/status/:orderId` - Get payment status

## Security

- All routes except authentication are protected with JWT
- Passwords are hashed using bcrypt
- Payment verification using Razorpay signature
- Google OAuth for secure third-party authentication

## Error Handling

The API uses a consistent error response format:

```json
{
  "message": "Error message",
  "error": "Detailed error information (in development)"
}
```

## Development

To run the server in development mode with hot reloading:

```bash
npm run dev
```

For production:

```bash
npm start
```
