'use strict'
import { CREATED, OK } from '../core/success.response.js'
import InventoryService from '../services/inventory.service.js'

class InventoryController {
  async addStockToInventory(req, res, next) {
    return new OK({
      message: 'Add stock success',
      metadata: await InventoryService.addStockToInventory({
        shopId: req.decodeUser.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        location: req.body.location
      })
    }).send(res)
  }
}
export default new InventoryController