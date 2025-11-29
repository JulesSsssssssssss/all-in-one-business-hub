/**
 * Client Better Auth pour le backend
 * 
 * Ce fichier contient les types et helpers pour utiliser Better Auth
 * depuis le backend Express.
 */

import { auth } from '../auth';

/**
 * Types d'authentification
 */
export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

/**
 * Helper pour récupérer la session depuis une requête
 */
export async function getSession(request: Request): Promise<Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers as any
    });
    
    return session as Session | null;
  } catch (error) {
    return null;
  }
}

/**
 * Helper pour vérifier si un utilisateur est authentifié
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const session = await getSession(request);
  return session !== null;
}

/**
 * Middleware Express pour protéger les routes
 */
export function requireAuth() {
  return async (req: any, res: any, next: any) => {
    const session = await getSession(req);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Non authentifié',
        statusCode: 401
      });
    }
    
    // Attacher la session à la requête
    req.user = session.user;
    req.session = session.session;
    
    next();
  };
}
