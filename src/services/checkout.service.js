'use strict'

import { BadRequestError } from "../core/error.response.js"
import orderModel from "../models/order.model.js"
import { findCartById } from "../models/repositories/cart.repo.js"
import { checkProductService } from "../models/repositories/product.repo.js"
import DiscountService from "./discount.service.js"
import { acquireLock, releaseLock } from "./redis.service.js"

class CheckoutService {
  /**
   cartId:
   userId: 
   shopOrderIds:[
       {
         shopId
         shop_discounts:[]
         item_products:[
           {
             quantity
             old_quantity
             price
             productId
             shopId
           }
         ]
       }
       {
         shopId
         shop_discounts:[]
         item_products:[
           {
             quantity
             old_quantity
             price
             productId
             shopId
           }
         ]
       }
     ]
     
    */
  static checkoutReview = async (payload) => {
    const { cartId, shop_order_ids } = payload
    const checkCartId = findCartById(cartId)
    if (!checkCartId) throw new BadRequestError(`Cart does't exist `)
    let checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      discountAmount: 0,
      totalCheckout: 0
    }, shop_order_ids_new = []
    for (let index = 0; index < shop_order_ids.length; index++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[index]
      const checkProducts = await checkProductService(item_products)
      // if element product fail throw bad request

      checkProducts.forEach((element, index) => {
        if (!element) throw new BadRequestError(`Product ${item_products.productId} does not exist`)
      })
      const checkoutPrice = checkProducts.reduce((acc, product) => {
        const { price, quantity } = product
        return acc + (price * quantity)
      }, 0)
      checkout_order.totalPrice += checkoutPrice
      const item_checkout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProducts
      }

      if (shop_discounts.length > 0) {
        const discount = await DiscountService.getDiscountAmount(item_products, shop_discounts[0])
        const { discountAmount = 0 } = discount
        checkout_order.discountAmount += discountAmount
        if (discountAmount > 0) {
          item_checkout.priceApplyDiscount = checkoutPrice - discountAmount
        }
      }
      checkout_order.totalCheckout += item_checkout.priceApplyDiscount
      shop_order_ids_new.push(item_checkout)
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
  static async orderByUser({
    cartId,
    userId,
    shop_order_ids,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({ cartId, shop_order_ids })
    const products = shop_order_ids_new.flatMap(order => order.item_products)
    const lockProducts = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)
      lockProducts.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }
    if (lockProducts.includes(false)) {
      throw new BadRequestError('Your cart has been updated,please back to cart')
    }
    const newOrder = orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_products: shop_order_ids_new,
      order_shipping: user_address,
      order_payment: user_payment
    })
    return newOrder
  }
}
export default CheckoutService