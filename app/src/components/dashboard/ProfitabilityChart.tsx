'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ProfitabilityOverTime } from '@/types/analytics';

interface ProfitabilityChartProps {
  data: ProfitabilityOverTime[];
}

export function ProfitabilityChart({ data }: ProfitabilityChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de la rentabilité (30 derniers jours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#6b7280"
            />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={formatDate}
            />
            <Area 
              type="monotone" 
              dataKey="cumulativeRevenue" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="CA cumulé"
            />
            <Area 
              type="monotone" 
              dataKey="cumulativeProfit" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorProfit)"
              name="Bénéfice cumulé"
            />
            <Area 
              type="monotone" 
              dataKey="cumulativeCosts" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorCosts)"
              name="Coûts cumulés"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
