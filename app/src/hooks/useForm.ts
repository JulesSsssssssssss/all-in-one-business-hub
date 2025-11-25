'use client';

import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook personnalisé pour gérer l'état des formulaires
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  options: UseFormOptions<T>
) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Effacer l'erreur du champ quand l'utilisateur commence à taper
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrors({});

      try {
        await options.onSubmit(values);
        setValues(initialValues);
        options.onSuccess?.();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        options.onError?.(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, initialValues, options]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
    reset: () => {
      setValues(initialValues);
      setErrors({});
    },
  };
}
