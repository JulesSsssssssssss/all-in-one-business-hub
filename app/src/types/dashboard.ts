/**
 * Types pour les statistiques et le dashboard
 */

export interface DashboardStats {
  revenue: {
    value: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
  itemsOnline: {
    value: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
  salesCount: {
    value: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
  netProfit: {
    value: number;
    change: string;
    trend: "up" | "down" | "neutral";
  };
}

export interface Alert {
  id: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  actionUrl?: string;
  createdAt: Date;
}

export interface RecentSale {
  id: string;
  itemName: string;
  platform: string;
  price: number;
  status: string;
  date: Date;
}
