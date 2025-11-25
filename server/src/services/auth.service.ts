import User from '../db/models/user.model';
import { connectMongooseToDatabase } from '../db';
import { createLogger } from '../lib/logger';
import { SignUpRequest, SignInRequest } from '../types/auth';
import { CONSTANTS } from '../config/constants';

const logger = createLogger('AuthService');

/**
 * ⚠️ NOTE: Better Auth gère l'authentification automatiquement.
 * Ce service est conservé pour fonctions utilitaires uniquement.
 */
export class AuthService {
  /**
   * Récupérer un utilisateur par email
   */
  static async getUserByEmail(email: string) {
    await connectMongooseToDatabase();

    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new Error(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      hasAcre: user.hasAcre,
      acreStartDate: user.acreStartDate
    };
  }

  /**
   * Récupérer un utilisateur par ID
   */
  static async getUserById(userId: string) {
    await connectMongooseToDatabase();

    const user = await User.findById(userId).exec();

    if (!user) {
      throw new Error(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      hasAcre: user.hasAcre,
      acreStartDate: user.acreStartDate
    };
  }

  /**
   * Mettre à jour les informations ACRE d'un utilisateur
   */
  static async updateAcreInfo(userId: string, hasAcre: boolean, acreStartDate?: Date) {
    await connectMongooseToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        hasAcre,
        acreStartDate: acreStartDate || null
      },
      { new: true }
    ).exec();

    if (!user) {
      throw new Error(CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    logger.info('Informations ACRE mises à jour', { userId, hasAcre });

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      hasAcre: user.hasAcre,
      acreStartDate: user.acreStartDate
    };
  }
}
