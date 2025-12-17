'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Protect routes based on authentication and role
    if (!loading) {
      protectRoutes();
    }
  }, [pathname, user, loading]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const protectRoutes = () => {
    const isLoginPage = pathname === '/login';
    const isDashboardRoute = pathname?.startsWith('/dashboard');
    const isHomePage = pathname === '/';

    // If user is logged in and tries to access login page, redirect to their dashboard
    if (user && isLoginPage) {
      redirectToDashboard(user.role);
      return;
    }

    // If user is not logged in and tries to access dashboard, redirect to login
    if (!user && isDashboardRoute) {
      router.push('/login');
      return;
    }

    // If user is logged in and tries to access wrong dashboard, redirect to their dashboard
    if (user && isDashboardRoute) {
      const allowedRoute = getDashboardRoute(user.role);
      if (!pathname.startsWith(allowedRoute) && pathname !== '/dashboard/settings') {
        router.push(allowedRoute);
      }
    }
  };

  const getDashboardRoute = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'INSPECTOR':
        return '/dashboard/inspector';
      case 'KITCHEN_MANAGER':
        return '/dashboard/kitchen';
      case 'HOTEL_MANAGEMENT':
        return '/dashboard/management';
      default:
        return '/';
    }
  };

  const redirectToDashboard = (role: string) => {
    router.push(getDashboardRoute(role));
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    setUser(userData);
    
    // Redirect to appropriate dashboard
    redirectToDashboard(userData.role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
