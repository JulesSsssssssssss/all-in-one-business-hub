/**
 * Types pour la gestion de stock et produits
 * Respecte les principes SOLID et Clean Code
 */

export type ProductStatus = "draft" | "online" | "sold" | "reserved";

export type ProductCategory = 
  | "vetements"
  | "chaussures"
  | "accessoires"
  | "electronique"
  | "autre";

export type ProductCondition = "neuf" | "excellent" | "bon" | "acceptable";

export type Platform = 
  | "Vinted"
  | "Leboncoin"
  | "eBay"
  | "Vestiaire Collective"
  | "Facebook Marketplace"
  | "Depop"
  | "autre";

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  
  // Prix et coûts
  purchasePrice: number;  // Prix d'achat
  sellingPrice: number;   // Prix de vente
  additionalCosts?: number; // Frais annexes (nettoyage, réparation)
  
  // Images
  images: string[];
  mainImage: string;
  
  // Détails produit
  brand?: string;
  size?: string;
  color?: string;
  material?: string;
  
  // Publication
  status: ProductStatus;
  platforms: Platform[];  // Sur quelles plateformes il est publié
  publishedAt?: Date;
  
  // Statistiques
  views: number;
  likes: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface ProductFormData extends Omit<Product, "id" | "createdAt" | "updatedAt" | "views" | "likes"> {}

export interface ProductFilters {
  status?: ProductStatus[];
  category?: ProductCategory[];
  platform?: Platform[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
