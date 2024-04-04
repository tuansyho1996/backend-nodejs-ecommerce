'use strict'

import inventoryModel from "../inventory.model.js"

const createInventory = async (product_id, shop_id, stock) => {
  return await inventoryModel.create({ inven_productId: product_id, inven_shopId: shop_id, inven_stock: stock })
}
const reservationInventory = async (productId, cartId, quantity) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity }
  }, updates = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservation: {
        cartId,
        productId,
        quantity
      }
    }
  }, options = { new: true, upsert: true }
  return await inventoryModel.findOneAndUpdate(query, updates, options)
}

export {
  createInventory,
  reservationInventory
}