import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import env from '../env';

interface User {
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  loading: boolean;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verify token and set user data
  const verifyToken = async (token: string): Promise<{ valid: boolean; userData?: User }> => {
    try {
      const response = await axios.post(`${env.API_URL}/api/verify-token/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { valid: true, userData: response.data.decoded }; // Return user data along with validity
    } catch (error) {
      console.error('Token is invalid or expired', error);
      return { valid: false }; // Token is invalid
    }
  };

  // Check if the user is logged in based on token
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const { valid, userData } = await verifyToken(token);
        if (valid && userData) {
          setUser(userData); // Set user data if token is valid
        } else {
          setUser(null); // Clear user if token is invalid
        }
      } else {
        setUser(null); // Clear user if no token exists
      }
      setLoading(false); // Set loading to false once verification is complete
    };

    checkUser();
  }, []);

  const isLoggedIn = user !== null;

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken'); // Clear token from local storage
    localStorage.removeItem('refreshToken'); // Clear refresh token as well
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, loading, handleLogout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

// Custom hook for consuming the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

