/**
 * Types pour les analytics et statistiques avancées
 */

/**
 * CA par période (mois ou semaine)
 */
export interface IRevenueByPeriod {
  period: string // Format: "2024-01" pour mois ou "2024-W01" pour semaine
  revenue: number
  profit: number
  salesCount: number
  costs: number
  margin: number // Pourcentage de marge
}

/**
 * Produit le plus rentable
 */
export interface ITopProduct {
  productId: string
  name: string
  brand?: string
  platform?: string
  revenue: number
  profit: number
  margin: number
  soldDate: Date
}

/**
 * Ventes par plateforme
 */
export interface ISalesByPlatform {
  platform: string
  salesCount: number
  revenue: number
  profit: number
  averagePrice: number
}

/**
 * Statistiques de rentabilité dans le temps
 */
export interface IProfitabilityOverTime {
  date: string // Format: "2024-01-15"
  cumulativeRevenue: number
  cumulativeProfit: number
  cumulativeCosts: number
  profitMargin: number // Pourcentage
}

/**
 * Dashboard analytics complet
 */
export interface IDashboardAnalytics {
  // CA par mois (12 derniers mois)
  revenueByMonth: IRevenueByPeriod[]
  
  // CA par semaine (12 dernières semaines)
  revenueByWeek: IRevenueByPeriod[]
  
  // Top 5 produits les plus rentables
  topProducts: ITopProduct[]
  
  // Évolution des ventes par plateforme
  salesByPlatform: ISalesByPlatform[]
  
  // Courbe de rentabilité (30 derniers jours)
  profitabilityOverTime: IProfitabilityOverTime[]
  
  // Stats globales
  totalRevenue: number
  totalProfit: number
  totalSales: number
  averageMargin: number
}

/**
 * Filtres pour les analytics
 */
export interface IAnalyticsFilter {
  userId: string
  dateFrom?: Date
  dateTo?: Date
  platform?: string
  supplierOrderId?: string
}
