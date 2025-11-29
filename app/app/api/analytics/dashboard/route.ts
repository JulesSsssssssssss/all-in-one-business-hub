import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/db'
import { createAuth } from '@/lib/auth'

interface RevenueByPeriod {
  period: string
  revenue: number
  profit: number
  salesCount: number
  costs: number
  margin: number
}

interface TopProduct {
  productId: string
  name: string
  brand?: string
  platform?: string
  revenue: number
  profit: number
  margin: number
  soldDate: Date
}

interface SalesByPlatform {
  platform: string
  salesCount: number
  revenue: number
  profit: number
  averagePrice: number
}

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const auth = await createAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const hasAcre = searchParams.get('hasAcre') === 'true'
    const taxRate = hasAcre ? 0.11 : 0.22

    // Connexion à MongoDB
    const db = await getDatabase()
    const collection = db.collection('products')

    // Récupérer tous les produits vendus
    const soldProducts = await collection
      .find({ userId, status: 'sold_euros' })
      .sort({ soldDate: 1 })
      .toArray()

    // CA par mois (12 derniers mois)
    const revenueByMonth = await getRevenueByPeriod(collection, userId, 'month', 12, taxRate)
    
    // CA par semaine (12 dernières semaines)
    const revenueByWeek = await getRevenueByPeriod(collection, userId, 'week', 12, taxRate)
    
    // Top 5 produits les plus rentables
    const topProducts = getTopProducts(soldProducts, 5, taxRate)
    
    // Ventes par plateforme
    const salesByPlatform = getSalesByPlatform(soldProducts, taxRate)
    
    // Courbe de rentabilité (30 derniers jours)
    const profitabilityOverTime = await getProfitabilityOverTime(collection, userId, 30, taxRate)

    // Stats globales
    const totalRevenue = soldProducts.reduce((sum: number, p: any) => sum + (p.soldPrice || 0), 0)
    const totalCosts = soldProducts.reduce((sum: number, p: any) => sum + (p.totalCost || (p.quantity * p.unitCost)), 0)
    const totalTaxes = soldProducts.reduce((sum: number, p: any) => sum + ((p.soldPrice || 0) * taxRate), 0)
    const totalProfit = totalRevenue - totalCosts - totalTaxes
    const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return NextResponse.json({
      analytics: {
        revenueByMonth,
        revenueByWeek,
        topProducts,
        salesByPlatform,
        profitabilityOverTime,
        totalRevenue,
        totalProfit,
        totalSales: soldProducts.length,
        averageMargin: Math.round(averageMargin * 100) / 100
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

async function getRevenueByPeriod(
  collection: any,
  userId: string,
  periodType: 'month' | 'week',
  count: number,
  taxRate: number
): Promise<RevenueByPeriod[]> {
  const now = new Date()
  const periods: RevenueByPeriod[] = []
  
  for (let i = count - 1; i >= 0; i--) {
    let startDate: Date
    let endDate: Date
    let period: string
    
    if (periodType === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999)
      period = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
    } else {
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

    const products = await collection
      .find({
        userId,
        status: 'sold_euros',
        soldDate: { $gte: startDate, $lte: endDate }
      })
      .toArray()

    const revenue = products.reduce((sum: number, p: any) => sum + (p.soldPrice || 0), 0)
    const costs = products.reduce((sum: number, p: any) => sum + (p.totalCost || (p.quantity * p.unitCost)), 0)
    const taxes = products.reduce((sum: number, p: any) => sum + ((p.soldPrice || 0) * taxRate), 0)
    const profit = revenue - costs - taxes
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0

    periods.push({
      period,
      revenue,
      profit,
      salesCount: products.length,
      costs,
      margin: Math.round(margin * 100) / 100
    })
  }

  return periods
}

function getTopProducts(
  products: any[],
  limit: number,
  taxRate: number
): TopProduct[] {
  const productsWithProfit = products.map((p: any) => {
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
      margin: Math.round(margin * 100) / 100,
      soldDate: p.soldDate || p.createdAt
    }
  })

  return productsWithProfit
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit)
}

function getSalesByPlatform(
  products: any[],
  taxRate: number
): SalesByPlatform[] {
  const platformMap = new Map<string, SalesByPlatform>()

  products.forEach((p: any) => {
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
  platformMap.forEach((data) => {
    data.averagePrice = data.salesCount > 0 ? data.revenue / data.salesCount : 0
    data.averagePrice = Math.round(data.averagePrice * 100) / 100
    data.revenue = Math.round(data.revenue * 100) / 100
    data.profit = Math.round(data.profit * 100) / 100
  })

  return Array.from(platformMap.values())
    .sort((a, b) => b.revenue - a.revenue)
}

async function getProfitabilityOverTime(
  collection: any,
  userId: string,
  days: number,
  taxRate: number
): Promise<Array<{ date: string; cumulativeProfit: number }>> {
  const results = []
  const now = new Date()
  let cumulativeProfit = 0
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const products = await collection
      .find({
        userId,
        status: 'sold_euros',
        soldDate: { $gte: date, $lt: nextDate }
      })
      .toArray()

    const dayRevenue = products.reduce((sum: number, p: any) => sum + (p.soldPrice || 0), 0)
    const dayCosts = products.reduce((sum: number, p: any) => sum + (p.totalCost || (p.quantity * p.unitCost)), 0)
    const dayTaxes = products.reduce((sum: number, p: any) => sum + ((p.soldPrice || 0) * taxRate), 0)
    const dayProfit = dayRevenue - dayCosts - dayTaxes
    
    cumulativeProfit += dayProfit

    results.push({
      date: date.toISOString().split('T')[0],
      cumulativeProfit: Math.round(cumulativeProfit * 100) / 100
    })
  }

  return results
}
