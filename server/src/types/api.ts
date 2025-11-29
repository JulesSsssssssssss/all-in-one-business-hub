import type { Request } from 'express'

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Extension de Request avec user authentifié
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name?: string
  }
  userId?: string // Placeholder pour compatibilité
}
