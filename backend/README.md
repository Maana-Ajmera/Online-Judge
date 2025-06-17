# Backend API

This is the backend API for the Online Judge application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- User registration and login
- Password hashing with bcrypt
- Input validation with express-validator
- Protected routes with middleware
- Admin role support

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online-judge
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Users

- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/change-password` - Change password (protected)
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:userId` - Delete user (admin only)

## Request/Response Examples

### Register User

```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Update Profile

```json
PUT /api/users/profile
Authorization: Bearer <token>
{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS enabled
- Protected routes with middleware
