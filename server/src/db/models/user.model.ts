import mongoose, { Schema, type Document } from 'mongoose'

/**
 * Interface TypeScript pour le document User
 */
export interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  name?: string
  password: string
  hasAcre: boolean
  acreStartDate?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Schéma Mongoose pour User
 */
const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  hasAcre: {
    type: Boolean,
    default: false
  },
  acreStartDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
})

// Index pour optimiser les requêtes
userSchema.index({ email: 1 })

/**
 * Modèle Mongoose User
 */
export default mongoose.models.User ?? mongoose.model<IUserDocument>('User', userSchema)
