import { Types } from 'mongoose'
import SupplierOrderModel, { type ISupplierOrderDocument } from '../db/models/supplier-order.model'

/**
 * Input pour créer une commande fournisseur
 */
export interface ICreateSupplierOrderInput {
  name: string
  supplier: string
  purchaseDate: Date | string
  totalCost: number
  shippingCost?: number
  customsCost?: number
  otherFees?: number
  notes?: string
}

/**
 * Input pour mettre à jour une commande
 */
export interface IUpdateSupplierOrderInput {
  name?: string
  supplier?: string
  purchaseDate?: Date | string
  totalCost?: number
  shippingCost?: number
  customsCost?: number
  otherFees?: number
  notes?: string
  status?: 'active' | 'completed'
}

/**
 * Service de gestion des commandes fournisseurs
 */
export class SupplierOrderService {
  /**
   * Créer une nouvelle commande fournisseur
   */
  async createOrder(userId: string, input: ICreateSupplierOrderInput): Promise<ISupplierOrderDocument> {
    const order = await SupplierOrderModel.create({
      userId: new Types.ObjectId(userId),
      name: input.name,
      supplier: input.supplier,
      purchaseDate: new Date(input.purchaseDate),
      totalCost: input.totalCost,
      shippingCost: input.shippingCost || 0,
      customsCost: input.customsCost || 0,
      otherFees: input.otherFees || 0,
      notes: input.notes,
      status: 'active'
    })

    return order
  }

  /**
   * Obtenir une commande par ID
   */
  async getOrderById(orderId: string, userId: string): Promise<ISupplierOrderDocument | null> {
    const order = await SupplierOrderModel.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId)
    })

    return order
  }

  /**
   * Obtenir toutes les commandes d'un utilisateur
   */
  async getOrders(userId: string, status?: 'active' | 'completed'): Promise<ISupplierOrderDocument[]> {
    const query: any = {
      userId: new Types.ObjectId(userId)
    }

    if (status) {
      query.status = status
    }

    const orders = await SupplierOrderModel.find(query).sort({ createdAt: -1 })

    return orders
  }

  /**
   * Mettre à jour une commande
   */
  async updateOrder(
    orderId: string,
    userId: string,
    updates: IUpdateSupplierOrderInput
  ): Promise<ISupplierOrderDocument | null> {
    const updateData: any = {}

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.supplier !== undefined) updateData.supplier = updates.supplier
    if (updates.purchaseDate !== undefined) updateData.purchaseDate = new Date(updates.purchaseDate)
    if (updates.totalCost !== undefined) updateData.totalCost = updates.totalCost
    if (updates.shippingCost !== undefined) updateData.shippingCost = updates.shippingCost
    if (updates.customsCost !== undefined) updateData.customsCost = updates.customsCost
    if (updates.otherFees !== undefined) updateData.otherFees = updates.otherFees
    if (updates.notes !== undefined) updateData.notes = updates.notes
    if (updates.status !== undefined) updateData.status = updates.status

    const order = await SupplierOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(orderId),
        userId: new Types.ObjectId(userId)
      },
      { $set: updateData },
      { new: true }
    )

    return order
  }

  /**
   * Supprimer une commande
   */
  async deleteOrder(orderId: string, userId: string): Promise<boolean> {
    const result = await SupplierOrderModel.deleteOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId)
    })

    return result.deletedCount > 0
  }

  /**
   * Marquer une commande comme complétée
   */
  async completeOrder(orderId: string, userId: string): Promise<ISupplierOrderDocument | null> {
    const order = await SupplierOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(orderId),
        userId: new Types.ObjectId(userId)
      },
      { $set: { status: 'completed' } },
      { new: true }
    )

    return order
  }

  /**
   * Calculer le coût total d'une commande (avec frais)
   */
  async getTotalCost(orderId: string, userId: string): Promise<number> {
    const order = await this.getOrderById(orderId, userId)
    if (!order) return 0

    return order.totalCost + order.shippingCost + order.customsCost + order.otherFees
  }
}

export default new SupplierOrderService()
