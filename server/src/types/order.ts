/**
 * Types pour la gestion des commandes fournisseurs
 */

export interface SupplierOrder {
  id: string;
  userId: number;
  name: string;
  supplier: string;
  purchaseDate: Date;
  totalCost: number;
  shippingCost: number;
  customsCost: number;
  otherFees: number;
  notes?: string;
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}

export interface Product {
  id: string;
  userId: number;
  supplierOrderId: string;
  name: string;
  description?: string;
  photos: string[]; // Array d'URLs
  unitCost: number;
  salePrice: number;
  soldPrice?: number;
  status: 'in_stock' | 'listed' | 'sold';
  platform?: string;
  listedDate?: Date;
  soldDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  supplierOrder?: SupplierOrder;
}

export interface CreateSupplierOrderDto {
  name: string;
  supplier: string;
  purchaseDate: Date | string;
  totalCost: number;
  shippingCost?: number;
  customsCost?: number;
  otherFees?: number;
  notes?: string;
}

export interface UpdateSupplierOrderDto {
  name?: string;
  supplier?: string;
  purchaseDate?: Date | string;
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
  listedDate?: Date | string;
  soldDate?: Date | string;
}

export interface OrderProfitability {
  orderId: string;
  orderName: string;
  supplier: string;
  purchaseDate: Date;
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
