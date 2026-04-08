# User Context Setup Guide

## Overview
The User Context manages global authentication state for your MERN application.

## Files Created/Updated

1. **`src/context/user.context.jsx`** - User context with auth logic
2. **`src/routes/AppRoutes.jsx`** - Wrapped with UserProvider
3. **`src/screens/Login.jsx`** - Updated to use context
4. **`src/screens/Register.jsx`** - Updated to use context

## Usage in Components

### Access User Context
```jsx
import { useUser } from '../context/user.context'

const MyComponent = () => {
  const { user, token, isAuthenticated, loading, login, register, logout } = useUser()
  
  // Use the context values...
}
```

## Available Context Values

| Property | Type | Description |
|----------|------|-------------|
| `user` | Object \| null | Current logged-in user data (email, id, etc.) |
| `token` | String \| null | JWT token stored in localStorage |
| `isAuthenticated` | Boolean | True if user is logged in |
| `loading` | Boolean | True during API calls |
| `error` | String \| null | Error message from last operation |

## Available Methods

### `login(email, password)`
```jsx
const result = await login('user@example.com', 'password123')
if (result.success) {
  // Login successful, user and token are set
} else {
  // result.error contains error message
}
```

### `register(email, password)`
```jsx
const result = await register('newuser@example.com', 'password123')
if (result.success) {
  // Registration successful, user logged in automatically
}
```

### `logout()`
```jsx
const result = await logout()
// Clears user, token, and localStorage
```

### `setError(errorMsg)`
```jsx
setError('Custom error message')
```

## How It Works

1. **Initialization**: On app load, context checks localStorage for saved token
2. **Profile Fetch**: If token exists, fetches user profile from `/users/profile`
3. **Authentication**: Login/Register methods handle API calls and store token
4. **Persistence**: Token stored in localStorage for app persistence
5. **Logout**: Clears all auth state and localStorage

## API Endpoints Used

- `POST /users/login` - Login user
- `POST /users/register` - Create new user
- `GET /users/logout` - Logout user
- `GET /users/profile` - Fetch user details (requires token)

## Notes

- Token is sent via cookies (httpOnly) by backend
- Token also stored in localStorage as backup
- All authenticated requests use axios with `credentials: true`
- Context initializes with `loading: true` until profile fetch completes
- On invalid token, user is logged out automatically
