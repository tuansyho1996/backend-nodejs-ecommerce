'use strict'

import inventoryModel from "../models/inventory.model.js"


class InventoryService {
  static async addStockToInventory({ productId, shopId, quantity, location }) {
    const query = {
      inven_productId: productId,
      inven_shopId: shopId
    }, updates = {
      $inc: {
        inven_stock: quantity
      },
      $set: {
        inven_location: location
      }
    }, options = { new: true, upsert: true }
    return await inventoryModel.findOneAndUpdate(query, updates, options)
  }
}

export default InventoryService