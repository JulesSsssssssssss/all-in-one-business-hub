/**
 * Types pour la gestion des ventes et commandes
 */

import { Platform } from "./product";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "dispute";

export type ShippingMethod = 
  | "mondial-relay"
  | "colissimo"
  | "chronopost"
  | "remise-main-propre"
  | "autre";

export interface Order {
  id: string;
  orderNumber: string; // Ex: #VIN-2847
  
  // Produit
  productId: string;
  productTitle: string;
  productImage: string;
  
  // Acheteur
  buyerName: string;
  buyerEmail?: string;
  
  // Prix et frais
  price: number;
  platformFees: number;
  shippingCost: number;
  totalAmount: number;
  
  // Plateforme
  platform: Platform;
  platformOrderId?: string;
  
  // Statut et livraison
  status: OrderStatus;
  shippingMethod?: ShippingMethod;
  trackingNumber?: string;
  shippingAddress?: string;
  
  // Dates
  orderDate: Date;
  paymentDate?: Date;
  shippingDate?: Date;
  deliveryDate?: Date;
  
  // Notes
  notes?: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStats {
  toShip: number;
  shipped: number;
  delivered: number;
  disputes: number;
}

export interface OrderFilters {
  status?: OrderStatus[];
  platform?: Platform[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

/**
 * Types pour la gestion des commandes fournisseurs
 */

export interface SupplierOrder {
  id: string;
  userId: number;
  name: string;
  supplier: string;
  purchaseDate: string;
  totalCost: number;
  shippingCost: number;
  customsCost: number;
  otherFees: number;
  notes?: string;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Product {
  id: string;
  userId: number;
  supplierOrderId: string;
  name: string;
  size?: string;
  quantity: number;
  description?: string;
  photos: string[];
  unitCost: number;
  purchaseDate: string;
  salePrice: number;
  soldPrice?: number;
  soldTo?: string;
  status: 'in_stock' | 'listed' | 'sold';
  condition?: string;
  platform?: string;
  listedDate?: string;
  soldDate?: string;
  boosted: boolean;
  createdAt: string;
  updatedAt: string;
  supplierOrder?: SupplierOrder;
  // Champs calculés
  grossProfit?: number;
  netProfit?: number;
  taxes?: number;
}

export interface CreateSupplierOrderDto {
  name: string;
  supplier: string;
  purchaseDate: string;
  totalCost: number;
  shippingCost?: number;
  customsCost?: number;
  otherFees?: number;
  notes?: string;
}

export interface UpdateSupplierOrderDto {
  name?: string;
  supplier?: string;
  purchaseDate?: string;
  totalCost?: number;
  shippingCost?: number;
  customsCost?: number;
  otherFees?: number;
  notes?: string;
  status?: 'active' | 'completed';
}

export interface CreateProductDto {
  supplierOrderId: string;
  name: string;
  description?: string;
  photos?: string[];
  unitCost: number;
  salePrice: number;
  platform?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  photos?: string[];
  unitCost?: number;
  salePrice?: number;
  soldPrice?: number;
  status?: 'in_stock' | 'listed' | 'sold';
  platform?: string;
  listedDate?: string;
  soldDate?: string;
}

export interface OrderProfitability {
  orderId: string;
  orderName: string;
  supplier: string;
  purchaseDate: string;
  totalCost: number;
  totalItems: number;
  itemsSold: number;
  itemsInStock: number;
  itemsListed: number;
  totalRevenue: number;
  currentProfit: number;
  profitMargin: number;
  breakEvenPoint: number;
  projectedRevenue: number;
  projectedProfit: number;
  status: 'profitable' | 'in_progress' | 'not_profitable';
}

export interface DashboardStats {
  totalInvested: number;
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  activeOrders: number;
  profitableOrders: number;
  totalProducts: number;
  productsSold: number;
  productsInStock: number;
  productsListed: number;
}

export const PRODUCT_STATUS = {
  IN_STOCK: 'in_stock',
  LISTED: 'listed',
  SOLD: 'sold',
} as const;

export const ORDER_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const PLATFORMS = [
  'Vinted',
  'Leboncoin',
  'eBay',
  'Vestiaire Collective',
  'Depop',
  'Facebook Marketplace',
  'Instagram',
  'Autre',
] as const;
