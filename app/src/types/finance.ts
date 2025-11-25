/**
 * Types pour la gestion financière et trésorerie
 */

import { Platform } from "./product";

export type TransactionType = "sale" | "purchase" | "fee" | "refund" | "other";

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: TransactionType;
  
  // Montants
  revenue: number;      // Revenu de la vente
  cost: number;         // Coût d'achat du produit
  fees: number;         // Frais de plateforme
  profit: number;       // Bénéfice net (revenue - cost - fees)
  
  // Référence
  orderId?: string;
  productId?: string;
  platform?: Platform | "Achat" | "Autre";
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialStats {
  totalRevenue: number;
  totalCosts: number;
  totalFees: number;
  netProfit: number;
  profitMargin: number;  // En pourcentage
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface PlatformPerformance {
  platform: Platform;
  sales: number;
  revenue: number;
  averagePrice: number;
  conversionRate: number;
}

export interface FinancialPeriod {
  period: string;  // "2024-01", "2024-Q1", etc.
  revenue: number;
  profit: number;
  salesCount: number;
}
