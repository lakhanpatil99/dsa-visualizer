# Frontend Authentication Integration Guide

This guide explains how to use the authentication system in your DSA Visualizer frontend components.

## 🚀 **What's Been Added**

### 1. **Authentication Context (`AuthContext`)**
- Global state management for user authentication
- Automatic token verification on app start
- JWT token storage in localStorage
- User data persistence across sessions

### 2. **Authentication Pages**
- **`/login`** - User login form
- **`/register`** - User registration form
- Both pages include proper error handling and validation

### 3. **Updated Navigation**
- Navbar now shows authentication status
- Login/Register buttons for unauthenticated users
- Welcome message and logout button for authenticated users

### 4. **Protected Features Component**
- `ProtectedFeature` component to wrap authentication-required features
- Automatic fallback UI for unauthenticated users
- Loading states and proper error handling

## 🔧 **How to Use**

### **Basic Authentication Check**

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <div>Please log in to continue</div>;
};
```

### **Protecting Features**

Use the `ProtectedFeature` component to wrap any feature that requires authentication:

```jsx
import ProtectedFeature from '../components/ProtectedFeature';

const MyPage = () => {
  return (
    <div>
      <h1>Algorithm Visualizer</h1>
      
      {/* This feature requires authentication */}
      <ProtectedFeature>
        <button>Save Progress</button>
      </ProtectedFeature>
      
      {/* This feature is always available */}
      <ProtectedFeature requireAuth={false}>
        <button>View Demo</button>
      </ProtectedFeature>
    </div>
  );
};
```

### **Custom Fallback UI**

You can provide custom fallback content:

```jsx
<ProtectedFeature
  fallback={
    <div className="custom-fallback">
      <h3>Premium Feature</h3>
      <p>Upgrade your account to access this feature</p>
      <a href="/upgrade">Upgrade Now</a>
    </div>
  }
>
  <PremiumFeature />
</ProtectedFeature>
```

## 📱 **Available Authentication Functions**

### **From `useAuth()` Hook:**

```jsx
const {
  user,           // Current user object (null if not logged in)
  token,          // JWT token (null if not logged in)
  loading,        // Boolean indicating if auth check is in progress
  isAuthenticated, // Boolean indicating if user is logged in
  login,          // Function to log in user
  register,       // Function to register new user
  logout          // Function to log out user
} = useAuth();
```

### **Login Function:**

```jsx
const handleLogin = async () => {
  const result = await login(email, password);
  
  if (result.success) {
    // User logged in successfully
    console.log(result.message);
    // Redirect or show success message
  } else {
    // Login failed
    console.error(result.message);
    // Show error message
  }
};
```

### **Register Function:**

```jsx
const handleRegister = async () => {
  const result = await register(name, email, password);
  
  if (result.success) {
    // User registered successfully
    console.log(result.message);
    // Redirect to login or show success message
  } else {
    // Registration failed
    console.error(result.message);
    // Show error message
  }
};
```

## 🎨 **Styling and Dark Mode**

All authentication components automatically support dark mode through the `DarkModeContext`. The styling is consistent with your existing design system.

## 🔒 **Security Features**

- **JWT Tokens**: Secure authentication with automatic expiration
- **Local Storage**: Persistent login across browser sessions
- **Token Verification**: Automatic validation on app start
- **Protected Routes**: Server-side protection for API endpoints
- **Input Validation**: Client-side validation for forms

## 📋 **Integration Examples**

### **Example 1: Save Progress Button**

```jsx
import SaveProgressButton from '../components/SaveProgressButton';

const SortingVisualizer = () => {
  return (
    <div>
      {/* Your existing sorting visualization code */}
      
      {/* Protected save progress feature */}
      <SaveProgressButton 
        algorithmName="Bubble Sort" 
        currentState={currentArray}
      />
    </div>
  );
};
```

### **Example 2: User Profile Section**

```jsx
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="user-profile">
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      
      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};
```

### **Example 3: Conditional Feature Rendering**

```jsx
import { useAuth } from '../contexts/AuthContext';

const AlgorithmControls = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="controls">
      <button>Start</button>
      <button>Pause</button>
      <button>Reset</button>
      
      {/* Only show advanced features to logged-in users */}
      {isAuthenticated && (
        <>
          <button>Save State</button>
          <button>Load Previous</button>
          <button>Share Results</button>
        </>
      )}
    </div>
  );
};
```

## 🚨 **Error Handling**

The authentication system includes comprehensive error handling:

- **Network Errors**: Automatic fallback messages
- **Validation Errors**: Clear feedback for form inputs
- **Authentication Errors**: Proper error messages for login/register failures
- **Token Expiration**: Automatic logout and redirect to login

## 🔄 **State Management**

- **Automatic Persistence**: User stays logged in across browser sessions
- **Real-time Updates**: UI updates immediately when authentication state changes
- **Loading States**: Proper loading indicators during authentication checks
- **Error Recovery**: Automatic cleanup on authentication failures

## 📱 **Mobile Responsiveness**

All authentication components are fully responsive and work well on mobile devices. The forms and buttons adapt to different screen sizes automatically.

## 🎯 **Next Steps**

1. **Test the authentication flow** using the login/register pages
2. **Integrate protected features** into your existing components
3. **Customize the UI** to match your design preferences
4. **Add more protected features** as needed
5. **Implement actual save/load functionality** using the authentication tokens

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"useAuth must be used within an AuthProvider"**
   - Make sure your app is wrapped with `AuthProvider`

2. **Authentication not persisting**
   - Check if localStorage is enabled in the browser
   - Verify the JWT token is being stored correctly

3. **Protected features not working**
   - Ensure the component is wrapped with `ProtectedFeature`
   - Check if the user is properly authenticated

4. **API calls failing**
   - Verify the backend authentication endpoints are working
   - Check if the JWT token is being sent in request headers

### **Debug Mode:**

You can add console logs to debug authentication issues:

```jsx
const { user, isAuthenticated, loading } = useAuth();

useEffect(() => {
  console.log('Auth state:', { user, isAuthenticated, loading });
}, [user, isAuthenticated, loading]);
```

## 📚 **Additional Resources**

- **Backend API**: Check `AUTH_SETUP.md` for backend configuration
- **Component Library**: Explore the `components/` directory for reusable UI components
- **Styling**: Refer to your Tailwind CSS configuration for custom styling
- **Testing**: Use the `/test-auth` page to test the authentication system

---

**Happy coding! 🚀** Your DSA Visualizer now has a robust authentication system that can protect features and provide personalized user experiences.
