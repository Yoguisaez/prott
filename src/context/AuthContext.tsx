import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mock';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, nombre: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage on load
    const savedUser = localStorage.getItem('ticket_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string) => {
    // Mock login
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ticket_user', JSON.stringify(foundUser));
      localStorage.setItem('ticket_user_id', foundUser.id);
    } else {
      throw new Error('Usuario no encontrado');
    }
  };

  const register = async (email: string, nombre: string) => {
    // Mock register
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      nombre,
      rol: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=random`
    };
    setUser(newUser);
    localStorage.setItem('ticket_user', JSON.stringify(newUser));
    localStorage.setItem('ticket_user_id', newUser.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ticket_user');
    localStorage.removeItem('ticket_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
