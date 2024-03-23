'use strict'

import inventoryModel from "../inventory.model.js"

const createInventory = async (product_id, shop_id, stock) => {
  return await inventoryModel.create({ inven_productId: product_id, inven_shopId: shop_id, inven_stock: stock })
}

export {
  createInventory
}