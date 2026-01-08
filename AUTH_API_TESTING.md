# VOLTRA Auth API Testing Guide

## Overview

This guide explains how to test the Auth API endpoints, including:
- **Register** (with password confirmation)
- **Login** (email/password)
- **Google OAuth** (via Passport.js redirects + ID token endpoint)
- **Get Profile** (/me)
- **Update Profile**

---

## Prerequisites

### 1. Environment Setup
Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/voltra_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Google OAuth (optional for testing register/login via Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# For running behind proxies/HTTPS
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### 2. Database Setup
Run migrations to create tables:

```bash
npm run test-db
# or manually:
node scripts/migrate.js
```

This creates:
- `users` table (with email, password, username, full_name, job_title, division, bio, company, avatar_url, is_verified)
- `oauth_accounts` table (for Google OAuth linking)
- Plus other tables (servers, channels, tasks, etc.)

### 3. Start the Server
```bash
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode with clustering
```

The server will listen on `http://localhost:3000` by default.

---

## API Endpoints

### 1. **POST /api/auth/register** - Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "fullName": "John Doe",
  "jobTitle": "Developer",
  "division": "Engineering",
  "bio": "Short bio",
  "company": "Company Name"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "fullName": "John Doe",
      "jobTitle": "Developer",
      "division": "Engineering",
      "bio": "Short bio",
      "company": "Company Name",
      "avatarUrl": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- `email`, `password`, `username` are required
- If `confirmPassword` is provided, it must match `password`
- Email must be unique
- Username must be unique

---

### 2. **POST /api/auth/login** - Login with email/password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "fullName": "John Doe",
      "jobTitle": "Developer",
      "division": "Engineering",
      "bio": "Short bio",
      "company": "Company Name",
      "avatarUrl": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation:**
- Both `email` and `password` are required
- Invalid credentials return 401

---

### 3. **GET /api/auth/me** - Get authenticated user profile

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "fullName": "John Doe",
    "jobTitle": "Developer",
    "division": "Engineering",
    "bio": "Short bio",
    "company": "Company Name",
    "avatarUrl": null
  }
}
```

---

### 4. **PUT /api/auth/profile** - Update user profile

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "jobTitle": "Senior Developer",
  "division": "Cloud Engineering",
  "bio": "Updated bio",
  "company": "New Company",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "fullName": "Jane Doe",
    "jobTitle": "Senior Developer",
    "division": "Cloud Engineering",
    "bio": "Updated bio",
    "company": "New Company",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

---

### 5. **GET /api/auth/google** - Initiate Google OAuth flow

Redirects to Google login. After authentication, redirects to callback.

---

### 6. **GET /api/auth/google/callback** - Google OAuth callback

Handled by Passport.js. Redirects to `FRONTEND_URL/auth-success?token=<jwt_token>`

---

### 7. **POST /api/auth/google/token** - Login/Register via Google ID Token

**Use case:** Mobile apps or SPAs that obtain an `id_token` from Google's SDK directly.

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Google sign-in successful",
  "data": {
    "user": {
      "id": 2,
      "email": "user@gmail.com",
      "username": null,
      "fullName": "Google User Name",
      "jobTitle": null,
      "division": null,
      "bio": null,
      "company": null,
      "avatarUrl": "https://lh3.googleusercontent.com/..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**How it works:**
1. Client sends Google `id_token` to `/api/auth/google/token`
2. API verifies token with Google's `tokeninfo` endpoint
3. Extracts email, name, avatar from token
4. Finds or creates user in database
5. Links Google account via `oauth_accounts` table
6. Returns JWT token for your app

---

## Running Tests

### Option 1: PowerShell Test Script (Windows)

```bash
.\scripts\test-auth.ps1
```

This script tests:
- ✓ Health check
- ✓ Register user
- ✓ Login user
- ✓ Get profile (/me)
- ✓ Update profile
- ✓ Register with mismatched passwords (error case)
- ✓ Login with wrong password (error case)

### Option 2: Node.js Test Script

```bash
node scripts/test-auth.js
```

### Option 3: cURL Commands

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123!"
  }'

# Get profile (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"

# Update profile
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "jobTitle": "Senior Dev"
  }'

# Google OAuth via ID token
curl -X POST http://localhost:3000/api/auth/google/token \
  -H "Content-Type: application/json" \
  -d '{"idToken": "google_id_token_here"}'
```

### Option 4: Postman / REST Client

Import the API endpoints and test with your favorite REST client.

---

## Key Changes Made

1. **Enhanced Register Endpoint**
   - Added `confirmPassword` validation
   - Returns user data with camelCase field names (matching UI)
   - Clear error messages for validation failures

2. **Enhanced Login Endpoint**
   - Returns user data in camelCase format
   - Password is excluded from response for security

3. **Updated Responses**
   - All endpoints now return consistent camelCase user objects
   - Database fields (snake_case) are mapped to API response (camelCase)

4. **Google OAuth via ID Token**
   - New `/api/auth/google/token` endpoint
   - Accepts `idToken` from mobile/SPA clients
   - Verifies with Google's tokeninfo API
   - Automatically creates user if first-time login

5. **Error Middleware**
   - Connected proper error handling in app.js
   - Clear error messages with HTTP status codes

6. **Testing Infrastructure**
   - PowerShell test script with full test coverage
   - Node.js test script for cross-platform use
   - npm script `npm run test-auth` for easy execution

---

## Response Format

All API responses follow a consistent format:

### Success (2xx):
```json
{
  "success": true,
  "message": "Description of success",
  "data": { /* response payload */ }
}
```

### Error (4xx/5xx):
```json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
```

---

## Performance & Optimization

✅ **Fast Response Times:**
- bcryptjs hashing with salt factor 10
- JWT tokens (no session overhead)
- Direct PostgreSQL queries with parameterized statements
- Compression middleware enabled
- Connection pooling configured

✅ **Security:**
- Passwords hashed with bcryptjs
- JWT for stateless authentication
- CORS protection
- SQL injection prevention via parameterized queries

✅ **Database Optimization:**
- Indexes on `email`, `username`, `provider_user_id`
- Efficient foreign key relationships
- Cascade delete for cleanup

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `No DATABASE_URL configured` | Set DATABASE_URL in .env and restart |
| `GoogleStrategy skipped` | Set GOOGLE_CLIENT_ID/SECRET in .env (optional) |
| `Invalid token` | Ensure JWT_SECRET is set consistently |
| `Email/username already exists` | Choose a different email/username |
| `Password mismatch` | Ensure confirmPassword equals password |
| `401 Unauthorized` | Check token is in Authorization header as `Bearer <token>` |

---

## Next Steps

- Test all endpoints with the provided scripts
- Configure Google OAuth credentials if needed
- Deploy to production with proper environment variables
- Monitor response times and database performance
