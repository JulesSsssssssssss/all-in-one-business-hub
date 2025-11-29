'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { validateEmail } from '@/lib/utils/validation';
import { ROUTES } from '@/constants/app';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Le nom est requis');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email invalide');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "Erreur lors de l'inscription");
        return;
      }

      // Redirection vers le dashboard après inscription réussie
      router.push(ROUTES.DASHBOARD);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kaki-2 to-kaki-1">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">✍️ Inscription</h1>
          <p className="text-gray-600 mb-6">
            Créez un nouveau compte
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20 transition disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20 transition disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-900 font-semibold mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20 transition disabled:opacity-50"
                required
              />
              <p className="text-gray-500 text-xs mt-1">Minimum 8 caractères</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-900 font-semibold mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:border-kaki-6 focus:outline-none focus:ring-2 focus:ring-kaki-6/20 transition disabled:opacity-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-primary hover:bg-kaki-7 disabled:bg-primary/60 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition"
            >
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Vous avez déjà un compte?{' '}
            <Link href={ROUTES.LOGIN} className="text-kaki-7 hover:text-kaki-6 font-semibold">
              Connectez-vous
            </Link>
          </p>

          <Link
            href={ROUTES.HOME}
            className="block text-center text-gray-500 hover:text-gray-700 text-sm mt-4"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}