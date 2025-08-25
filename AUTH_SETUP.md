# Authentication Setup Guide

This guide will help you set up the authentication system for your DSA Visualizer project.

## Prerequisites

1. **MongoDB Atlas Account**: You'll need a MongoDB Atlas account to host your database
2. **Node.js**: Make sure you have Node.js installed (version 14 or higher)

## Step 1: Install Dependencies

First, install the required dependencies:

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# JWT Secret for token signing (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/dsa-visualizer?retryWrites=true&w=majority

# Next.js Public JWT Secret (for client-side verification if needed)
NEXT_PUBLIC_JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Generate JWT Secret

You can generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 3: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can allow access from anywhere (0.0.0.0/0)
   - For production, restrict to your Vercel deployment IPs

5. **Get Connection String**:
   - Go to "Clusters" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `dsa-visualizer`

## Step 4: Test the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the registration endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Test the login endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

4. **Test the protected user endpoint** (use the token from login):
   ```bash
   curl -X GET http://localhost:3000/api/auth/user \
     -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
   ```

## API Endpoints

### POST /api/auth/register
- **Purpose**: Register a new user
- **Body**: `{ "name": "string", "email": "string", "password": "string" }`
- **Response**: User data and success message

### POST /api/auth/login
- **Purpose**: Authenticate user and get JWT token
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: User data and JWT token

### GET /api/auth/user
- **Purpose**: Get current user data
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response**: User data (protected route)

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **JWT Tokens**: Secure authentication using JSON Web Tokens
- **Input Validation**: Comprehensive validation for all inputs
- **Error Handling**: Proper error messages without exposing sensitive information
- **MongoDB Injection Protection**: Uses Mongoose ODM for safe database operations

## Vercel Deployment

When deploying to Vercel:

1. **Set Environment Variables**: Add your environment variables in the Vercel dashboard
2. **MongoDB Network Access**: Make sure to allow Vercel's IP addresses in MongoDB Atlas
3. **Build Command**: The build command is already configured in `package.json`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Check your connection string
   - Verify network access settings
   - Ensure database user has correct permissions

2. **JWT Errors**:
   - Verify JWT_SECRET is set correctly
   - Check token expiration
   - Ensure proper Authorization header format

3. **Build Errors**:
   - Make sure all dependencies are installed
   - Check Node.js version compatibility
   - Verify Next.js configuration

### Getting Help

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the MongoDB connection separately
4. Check the API response status codes and messages
