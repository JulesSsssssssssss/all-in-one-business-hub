import { TrendingUp, Package, ShoppingCart, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const stats = [
    {
      title: "Chiffre d'affaires",
      value: "2 847 €",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Articles en ligne",
      value: "143",
      change: "+8",
      trend: "up" as const,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Ventes ce mois",
      value: "47",
      change: "+23%",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Bénéfice net",
      value: "1 624 €",
      change: "+18.2%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  const platforms = [
    { name: "Vinted", sales: 28, color: "bg-[#09B1BA]" },
    { name: "Leboncoin", sales: 12, color: "bg-[#FF6E14]" },
    { name: "eBay", sales: 5, color: "bg-[#E53238]" },
    { name: "Vestiaire", sales: 2, color: "bg-[#000000]" },
  ];

  const recentSales = [
    { item: "Nike Air Max 90", platform: "Vinted", price: "85 €", status: "Payée" },
    { item: "Zara Manteau", platform: "Leboncoin", price: "45 €", status: "Expédiée" },
    { item: "iPhone 12", platform: "eBay", price: "380 €", status: "Livrée" },
    { item: "Sac Longchamp", platform: "Vinted", price: "120 €", status: "Payée" },
  ];

  const alerts = [
    { message: "5 articles à publier", type: "info" as const },
    { message: "3 commandes à expédier", type: "warning" as const },
    { message: "Stock faible: 8 articles", type: "warning" as const },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={cn("text-xs", stat.color)}>
                  {stat.change} ce mois
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Alertes & Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border"
              >
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  alert.type === "warning" ? "bg-orange-500" : "bg-primary"
                )} />
                <span className="text-sm text-foreground">{alert.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Plateformes Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes par plateforme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{platform.name}</span>
                  <span className="text-muted-foreground">{platform.sales} ventes</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full", platform.color)}
                    style={{ width: `${(platform.sales / 47) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{sale.item}</p>
                    <p className="text-sm text-muted-foreground">{sale.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{sale.price}</p>
                    <p className={cn(
                      "text-xs",
                      sale.status === "Livrée" ? "text-green-600" : "text-orange-500"
                    )}>
                      {sale.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
