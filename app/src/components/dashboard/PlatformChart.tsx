'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SalesByPlatform } from '@/types/analytics';

interface PlatformChartProps {
  data: SalesByPlatform[];
}

export function PlatformChart({ data }: PlatformChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes par plateforme</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="platform" 
              stroke="#6b7280"
            />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Bar 
              dataKey="revenue" 
              fill="#10b981" 
              name="CA"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="profit" 
              fill="#3b82f6" 
              name="Bénéfice"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {data.map((platform) => (
            <div key={platform.platform} className="flex items-center justify-between text-sm">
              <span className="font-medium">{platform.platform}</span>
              <div className="flex gap-4 text-muted-foreground">
                <span>{platform.salesCount} ventes</span>
                <span>Moy: {formatCurrency(platform.averagePrice)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
