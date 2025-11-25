'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS, ROUTES, ERROR_MESSAGES } from '@/constants/app';
import { getErrorMessage } from '@/lib/utils/errors';
import type { User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Hook personnalisé pour l'authentification
 * Gère login, register, logout
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || ERROR_MESSAGES.SERVER_ERROR);
      }

      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      setUser(null);
      localStorage.removeItem('user');
      router.push(ROUTES.HOME);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
