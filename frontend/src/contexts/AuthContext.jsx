import React, { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Add other auth-related state here, e.g., user info, token

  // Example login/logout functions (replace with actual logic)
  const login = () => {
    // TODO: Implement actual login logic (API call, token storage)
    console.log('Simulating login...');
    setIsAuthenticated(true);
  };

  const logout = () => {
    // TODO: Implement actual logout logic (API call, token removal)
    console.log('Simulating logout...');
    setIsAuthenticated(false);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    // Add other values/functions to expose
  }), [isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 3. Create a custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default export can be the context itself if needed elsewhere
export default AuthContext;