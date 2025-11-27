'use client';

import { createAuthClient } from "better-auth/react";
import { useEffect, useState } from "react";

// Configuration du client Better Auth
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:5000",
  credentials: "include", // Important pour les cookies
});

// Custom hook to access session
export function useSession() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const session = await authClient.getSession();
        if (session.data) {
          setData(session.data);
        }
        if (session.error) {
          setError(session.error);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  return {
    data,
    isPending: isLoading,
    error
  };
}
