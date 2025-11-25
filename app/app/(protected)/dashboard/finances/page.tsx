import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FinancesPage() {
  const financialStats = [
    {
      title: "Revenus bruts",
      value: "2 847 €",
      change: "+15.3%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Coûts d'achat",
      value: "1 123 €",
      change: "+8.2%",
      icon: TrendingDown,
      trend: "neutral",
    },
    {
      title: "Frais & Commissions",
      value: "284 €",
      change: "+12.1%",
      icon: CreditCard,
      trend: "neutral",
    },
    {
      title: "Bénéfice net",
      value: "1 440 €",
      change: "+18.7%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  const transactions = [
    {
      date: "2024-01-15",
      description: "Vente Nike Air Max 90",
      platform: "Vinted",
      revenue: 85,
      cost: 45,
      fees: 8.5,
      profit: 31.5,
    },
    {
      date: "2024-01-14",
      description: "Vente Zara Manteau",
      platform: "Leboncoin",
      revenue: 45,
      cost: 20,
      fees: 4.5,
      profit: 20.5,
    },
    {
      date: "2024-01-14",
      description: "Vente iPhone 12",
      platform: "eBay",
      revenue: 380,
      cost: 280,
      fees: 38,
      profit: 62,
    },
    {
      date: "2024-01-13",
      description: "Achat lot friperie",
      platform: "Achat",
      revenue: 0,
      cost: -150,
      fees: 0,
      profit: -150,
    },
    {
      date: "2024-01-13",
      description: "Vente Sac Longchamp",
      platform: "Vinted",
      revenue: 120,
      cost: 65,
      fees: 12,
      profit: 43,
    },
  ];

  const categoryBreakdown = [
    { category: "Vêtements", revenue: 1247, percentage: 44 },
    { category: "Chaussures", revenue: 856, percentage: 30 },
    { category: "Accessoires", revenue: 524, percentage: 18 },
    { category: "Électronique", revenue: 220, percentage: 8 },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Finances</h1>
        <p className="text-muted-foreground">Suivez votre trésorerie et rentabilité</p>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={cn(
                  "h-4 w-4",
                  stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
                )} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={cn(
                  "text-xs",
                  stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
                )}>
                  {stat.change} ce mois
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{transaction.platform}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold",
                      transaction.profit > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {transaction.profit > 0 ? "+" : ""}{transaction.profit} €
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.revenue > 0 ? `${transaction.revenue} €` : "Achat"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus par catégorie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{category.category}</span>
                  <span className="text-muted-foreground">{category.revenue} €</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{category.percentage}% du total</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
