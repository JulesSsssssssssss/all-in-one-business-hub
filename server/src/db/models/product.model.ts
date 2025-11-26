import mongoose, { Schema, type Document } from 'mongoose'

/**
 * Interface TypeScript pour le document Product
 */
export interface IProductDocument extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  supplierOrderId: mongoose.Types.ObjectId
  name: string // Description
  brand?: string // Marque
  size?: string // Taille
  quantity: number
  description?: string
  photos: string // JSON array des URLs
  url?: string // URL de vente (plateforme)
  unitCost: number // Prix d'achat unitaire
  totalCost: number // Prix total (quantity * unitCost)
  purchaseDate: Date // Date achat
  salePrice: number // Prix de vente prévu
  soldPrice?: number // Vendu à combien
  soldTo?: string
  status: 'in_delivery' | 'to_list' | 'in_progress' | 'listed' | 'for_sale' | 'completed' | 'sold' | 'problem' | 'sold_euros'
  condition?: string
  platform?: string
  listedDate?: Date
  soldDate?: Date // Date vente
  boosted: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Schéma Mongoose pour Product
 */
const productSchema = new Schema<IProductDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  supplierOrderId: {
    type: Schema.Types.ObjectId,
    ref: 'SupplierOrder',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: false
  },
  size: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  description: {
    type: String,
    required: false
  },
  photos: {
    type: String,
    default: '[]' // JSON array
  },
  url: {
    type: String,
    required: false
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  salePrice: {
    type: Number,
    required: false,
    min: 0,
    default: 0
  },
  soldPrice: {
    type: Number,
    required: false,
    min: 0
  },
  soldTo: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['in_delivery', 'to_list', 'in_progress', 'listed', 'for_sale', 'completed', 'sold', 'problem', 'sold_euros'],
    default: 'to_list',
    index: true
  },
  condition: {
    type: String,
    required: false
  },
  platform: {
    type: String,
    required: false
  },
  listedDate: {
    type: Date,
    required: false
  },
  soldDate: {
    type: Date,
    required: false
  },
  boosted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index composés pour optimiser les requêtes
productSchema.index({ userId: 1, status: 1 })
productSchema.index({ supplierOrderId: 1, status: 1 })
productSchema.index({ userId: 1, createdAt: -1 })

/**
 * Modèle Mongoose Product
 */
export default mongoose.models.Product ?? mongoose.model<IProductDocument>('Product', productSchema)
