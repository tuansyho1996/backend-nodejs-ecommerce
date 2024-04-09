'use strict'

import redisPubsubService from "../services/redisPubsub.service.js"

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId, quantity
    }
    redisPubsubService.publish('purchase_events', JSON.stringify(order))
  }
}

export default new ProductServiceTest()