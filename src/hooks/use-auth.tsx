'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { login as loginApi, getProfile, LoginRequest, User } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      validateAndSetUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Redirect if not authenticated on admin pages
  useEffect(() => {
    if (!isLoading && pathname?.startsWith('/admin') && pathname !== '/admin/login') {
      if (!user) {
        router.push('/admin/login');
      }
    }
  }, [isLoading, user, pathname, router]);

  async function validateAndSetUser(token: string) {
    try {
      const userData = await getProfile(token);
      if (userData.role === 'admin') {
        setUser(userData);
      } else {
        // Not an admin, clear token
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(credentials: LoginRequest) {
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await loginApi(credentials);
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      
      // Get user profile
      const userData = await getProfile(response.accessToken);
      
      if (userData.role !== 'admin') {
        throw new Error('Access denied. Admin only.');
      }
      
      setUser(userData);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push('/admin/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
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

/**
 * Hook to get auth token for API calls
 */
export function useAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
