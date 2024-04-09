'use strict'

import RedisPubsubService from "../services/redisPubsub.service.js"

class InventoryServiceTest {
  constructor() {
    RedisPubsubService.subscribe('purchase_events', (channel, message) => {
      console.log('check')
      this.updateInventory(JSON.parse(message))
    })
  }
  updateInventory({ productId, quantity }) {
    console.log(`Update inventory id:${productId} with quantity ${quantity}`)
  }
}
export default new InventoryServiceTest()