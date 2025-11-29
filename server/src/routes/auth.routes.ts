import { Router } from 'express';
import { auth } from '../auth';
import { toNodeHandler } from 'better-auth/node';

const authRouter = Router();

/**
 * Better Auth gère toutes les routes d'authentification automatiquement :
 * 
 * POST /api/auth/sign-up/email       - Inscription
 * POST /api/auth/sign-in/email       - Connexion  
 * POST /api/auth/sign-out            - Déconnexion
 * GET  /api/auth/get-session         - Récupérer la session
 * POST /api/auth/change-password     - Changer le mot de passe
 * POST /api/auth/request-password-reset - Demander réinitialisation
 * POST /api/auth/reset-password      - Réinitialiser le mot de passe
 */

// Toutes les routes Better Auth sont gérées par ce handler
authRouter.use('/', toNodeHandler(auth));

export { authRouter };
