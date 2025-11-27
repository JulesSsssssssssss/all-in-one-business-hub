import { Types } from 'mongoose'
import ProductModel from '../db/models/product.model'
import type {
  IDashboardAnalytics,
  IRevenueByPeriod,
  ITopProduct,
  ISalesByPlatform,
  IProfitabilityOverTime,
  IAnalyticsFilter
} from '../types/analytics'

/**
 * Service pour gérer les analytics et statistiques avancées
 */
class AnalyticsService {
  /**
   * Obtenir le dashboard analytics complet
   */
  async getDashboardAnalytics(userId: string, hasAcre: boolean = false): Promise<IDashboardAnalytics> {
    const objectId = new Types.ObjectId(userId)
    
    // Récupérer tous les produits vendus de l'utilisateur
    const soldProducts = await ProductModel.find({
      userId: objectId,
      status: 'sold_euros'
    }).sort({ soldDate: 1 })

    // CA par mois (12 derniers mois)
    const revenueByMonth = await this.getRevenueByPeriod(objectId, 'month', 12, hasAcre)
    
    // CA par semaine (12 dernières semaines)
    const revenueByWeek = await this.getRevenueByPeriod(objectId, 'week', 12, hasAcre)
    
    // Top 5 produits les plus rentables
    const topProducts = await this.getTopProducts(objectId, 5, hasAcre)
    
    // Ventes par plateforme
    const salesByPlatform = await this.getSalesByPlatform(objectId, hasAcre)
    
    // Courbe de rentabilité (30 derniers jours)
    const profitabilityOverTime = await this.getProfitabilityOverTime(objectId, 30, hasAcre)
    
    // Stats globales
    const totalRevenue = soldProducts.reduce((sum, p) => sum + (p.soldPrice || 0), 0)
    const totalCosts = soldProducts.reduce((sum, p) => sum + (p.totalCost || (p.quantity * p.unitCost)), 0)
    const taxRate = hasAcre ? 0.11 : 0.22
    const totalTaxes = soldProducts.reduce((sum, p) => sum + ((p.soldPrice || 0) * taxRate), 0)
    const totalProfit = totalRevenue - totalCosts - totalTaxes
    const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return {
      revenueByMonth,
      revenueByWeek,
      topProducts,
      salesByPlatform,
      profitabilityOverTime,
      totalRevenue,
      totalProfit,
      totalSales: soldProducts.length,
      averageMargin
    }
  }

  /**
   * CA par période (mois ou semaine)
   */
  private async getRevenueByPeriod(
    userId: Types.ObjectId,
    periodType: 'month' | 'week',
    count: number,
    hasAcre: boolean
  ): Promise<IRevenueByPeriod[]> {
    const now = new Date()
    const periods: IRevenueByPeriod[] = []
    
    for (let i = count - 1; i >= 0; i--) {
      let startDate: Date
      let endDate: Date
      let period: string
      
      if (periodType === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
        period = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
      } else {
        // Semaine
        const weekStart = new Date(now)
        weekStart.setDate(weekStart.getDate() - (i * 7))
        weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)
        
        startDate = weekStart
        endDate = weekEnd
        period = `${startDate.toISOString().split('T')[0]}`
      }

      const products = await ProductModel.find({
        userId,
        status: 'sold_euros',
        soldDate: { $gte: startDate, $lte: endDate }
      })

      const revenue = products.reduce((sum, p) => sum + (p.soldPrice || 0), 0)
      const costs = products.reduce((sum, p) => sum + (p.totalCost || (p.quantity * p.unitCost)), 0)
      const taxRate = hasAcre ? 0.11 : 0.22
      const taxes = products.reduce((sum, p) => sum + ((p.soldPrice || 0) * taxRate), 0)
      const profit = revenue - costs - taxes
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0

      periods.push({
        period,
        revenue,
        profit,
        salesCount: products.length,
        costs,
        margin
      })
    }

    return periods
  }

  /**
   * Top produits les plus rentables
   */
  private async getTopProducts(
    userId: Types.ObjectId,
    limit: number,
    hasAcre: boolean
  ): Promise<ITopProduct[]> {
    const products = await ProductModel.find({
      userId,
      status: 'sold_euros'
    }).sort({ soldDate: -1 })

    const taxRate = hasAcre ? 0.11 : 0.22
    
    const productsWithProfit = products.map(p => {
      const revenue = p.soldPrice || 0
      const cost = p.totalCost || (p.quantity * p.unitCost)
      const taxes = revenue * taxRate
      const profit = revenue - cost - taxes
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0

      return {
        productId: p._id.toString(),
        name: p.name,
        brand: p.brand,
        platform: p.platform,
        revenue,
        profit,
        margin,
        soldDate: p.soldDate || p.createdAt
      }
    })

    // Trier par profit décroissant et prendre le top
    return productsWithProfit
      .sort((a, b) => b.profit - a.profit)
      .slice(0, limit)
  }

  /**
   * Ventes par plateforme
   */
  private async getSalesByPlatform(
    userId: Types.ObjectId,
    hasAcre: boolean
  ): Promise<ISalesByPlatform[]> {
    const products = await ProductModel.find({
      userId,
      status: 'sold_euros'
    })

    const taxRate = hasAcre ? 0.11 : 0.22
    const platformMap = new Map<string, ISalesByPlatform>()

    products.forEach(p => {
      const platform = p.platform || 'Autre'
      const revenue = p.soldPrice || 0
      const cost = p.totalCost || (p.quantity * p.unitCost)
      const taxes = revenue * taxRate
      const profit = revenue - cost - taxes

      if (!platformMap.has(platform)) {
        platformMap.set(platform, {
          platform,
          salesCount: 0,
          revenue: 0,
          profit: 0,
          averagePrice: 0
        })
      }

      const platformData = platformMap.get(platform)!
      platformData.salesCount++
      platformData.revenue += revenue
      platformData.profit += profit
    })

    // Calculer le prix moyen
    const result: ISalesByPlatform[] = []
    platformMap.forEach(data => {
      data.averagePrice = data.salesCount > 0 ? data.revenue / data.salesCount : 0
      result.push(data)
    })

    // Trier par revenu décroissant
    return result.sort((a, b) => b.revenue - a.revenue)
  }

  /**
   * Courbe de rentabilité dans le temps
   */
  private async getProfitabilityOverTime(
    userId: Types.ObjectId,
    days: number,
    hasAcre: boolean
  ): Promise<IProfitabilityOverTime[]> {
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    const products = await ProductModel.find({
      userId,
      status: 'sold_euros',
      soldDate: { $gte: startDate, $lte: endDate }
    }).sort({ soldDate: 1 })

    const taxRate = hasAcre ? 0.11 : 0.22
    const timeline: IProfitabilityOverTime[] = []
    let cumulativeRevenue = 0
    let cumulativeCosts = 0
    let cumulativeProfit = 0

    // Grouper par jour
    const dailyMap = new Map<string, any[]>()
    
    products.forEach(p => {
      const date = p.soldDate ? new Date(p.soldDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, [])
      }
      dailyMap.get(date)!.push(p)
    })

    // Créer la timeline cumulative
    const sortedDates = Array.from(dailyMap.keys()).sort()
    
    sortedDates.forEach(date => {
      const dayProducts = dailyMap.get(date)!
      
      dayProducts.forEach(p => {
        const revenue = p.soldPrice || 0
        const cost = p.totalCost || (p.quantity * p.unitCost)
        const taxes = revenue * taxRate
        const profit = revenue - cost - taxes

        cumulativeRevenue += revenue
        cumulativeCosts += cost + taxes
        cumulativeProfit += profit
      })

      const profitMargin = cumulativeRevenue > 0 ? (cumulativeProfit / cumulativeRevenue) * 100 : 0

      timeline.push({
        date,
        cumulativeRevenue,
        cumulativeProfit,
        cumulativeCosts,
        profitMargin
      })
    })

    return timeline
  }
}

export default new AnalyticsService()
