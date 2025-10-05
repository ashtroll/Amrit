import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string): Promise<void> => {
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'researcher',
    };

    setAuthState({
      user: mockUser,
      token: 'mock-jwt-token',
      isAuthenticated: true,
    });

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'researcher',
    };

    setAuthState({
      user: mockUser,
      token: 'mock-jwt-token',
      isAuthenticated: true,
    });

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
  };

  const logout = (): void => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setAuthState({
        user: JSON.parse(savedUser),
        token: savedToken,
        isAuthenticated: true,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
