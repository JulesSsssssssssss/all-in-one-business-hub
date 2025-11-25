import mongoose, { Schema, type Document } from 'mongoose'

/**
 * Interface TypeScript pour le document SupplierOrder
 */
export interface ISupplierOrderDocument extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  supplier: string
  purchaseDate: Date
  totalCost: number
  shippingCost: number
  customsCost: number
  otherFees: number
  notes?: string
  status: 'active' | 'completed'
  createdAt: Date
  updatedAt: Date
}

/**
 * Schéma Mongoose pour SupplierOrder
 */
const supplierOrderSchema = new Schema<ISupplierOrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  customsCost: {
    type: Number,
    default: 0,
    min: 0
  },
  otherFees: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
})

// Index pour optimiser les requêtes
supplierOrderSchema.index({ userId: 1, createdAt: -1 })
supplierOrderSchema.index({ status: 1 })

/**
 * Modèle Mongoose SupplierOrder
 */
export default mongoose.models.SupplierOrder ?? mongoose.model<ISupplierOrderDocument>('SupplierOrder', supplierOrderSchema)
