/**
 * Types pour les analytics frontend
 */

/**
 * CA par période (mois ou semaine)
 */
export interface RevenueByPeriod {
  period: string
  revenue: number
  profit: number
  salesCount: number
  costs: number
  margin: number
}

/**
 * Produit le plus rentable
 */
export interface TopProduct {
  productId: string
  name: string
  brand?: string
  platform?: string
  revenue: number
  profit: number
  margin: number
  soldDate: string
}

/**
 * Ventes par plateforme
 */
export interface SalesByPlatform {
  platform: string
  salesCount: number
  revenue: number
  profit: number
  averagePrice: number
}

/**
 * Statistiques de rentabilité dans le temps
 */
export interface ProfitabilityOverTime {
  date: string
  cumulativeRevenue: number
  cumulativeProfit: number
  cumulativeCosts: number
  profitMargin: number
}

/**
 * Dashboard analytics complet
 */
export interface DashboardAnalytics {
  revenueByMonth: RevenueByPeriod[]
  revenueByWeek: RevenueByPeriod[]
  topProducts: TopProduct[]
  salesByPlatform: SalesByPlatform[]
  profitabilityOverTime: ProfitabilityOverTime[]
  totalRevenue: number
  totalProfit: number
  totalSales: number
  averageMargin: number
}
