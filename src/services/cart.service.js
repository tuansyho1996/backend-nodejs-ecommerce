'use strict'

import cartModel from "../models/cart.model.js"
import { BadRequestError, NotFoundError } from "../core/error.response.js"
import { convertToObjectIdMongodb } from "../utils/index.js"
import { findProductById } from "../models/repositories/product.repo.js"
import { product } from "../models/product.model.js"


/*
 Key feature cart service
 - add product to cart(user)
 - reduce product quantity by one (user)
 - increase product quantity by one (user)
 - get cart (user)
 - delete cart (user)
 - delete cart item (user)
*/

class CartService {
  //Add product to cart
  static createUserCart = async (userId, product) => {
    const query = {
      cart_userId: userId,
      cart_state: 'active'
    }, insertOrUpdate = {
      $addToSet: {
        cart_products: product
      }
    }, options = {
      new: true,
      upsert: true
    }
    return await cartModel.findOneAndUpdate(query, insertOrUpdate, options)
  }
  static updateUserCartQuantityProduct = async (userId, product) => {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    }, updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }, options = {
      new: true,
      upsert: true
    }
    return await cartModel.findOneAndUpdate(query, updateSet, options)
  }
  static addToCart = async ({ userId, product }) => {
    const userCart = await cartModel.findOne({ cart_userId: userId })
    // Cart with user id not exist
    if (!userCart) {
      //Create cart for user 
      return CartService.createUserCart(userId, product)
    }
    // if have cart user already but not yet product

    const isProduct = userCart.cart_products.find(item => item.productId === product.productId)
    if (!isProduct) {
      userCart.cart_products.push(product)
      return await userCart.save()
    }
    // if have product in cart update quantity
    return await CartService.updateUserCartQuantityProduct(userId, product)
  }
  /**
      shopOrderIds:[
        {
          shopId
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
  static updateProductCart = async ({ userId, shop_order_ids }) => {
    //check product
    const { productId, old_quantity, quantity } = shop_order_ids[0].item_products[0]
    const foundProduct = await findProductById(productId)
    console.log('found product', foundProduct)
    if (!foundProduct) throw new NotFoundError('Product not exist')
    //compare
    if (!foundProduct.product_shop.equals(convertToObjectIdMongodb(shop_order_ids[0].item_products[0].shopId))) throw new NotFoundError('Product do not belong to the shop')
    if (quantity === 0) {
      //Delete product cart 
      return await CartService.deleteProductCart({ userId, productId })
    }
    return await this.updateUserCartQuantityProduct(userId, {
      productId,
      quantity: quantity - old_quantity
    })
  }
  //Delete product by cartId 
  static deleteProductCart = async ({ userId, productId }) => {
    const query = {
      cart_userId: userId,
    }, updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }, options = {
      new: true,
    }
    return await cartModel.findOneAndUpdate(query, updateSet, options)
  }
  // Get cart by cartId
  static getListProductCartByUserId = async (userId) => {
    return await cartModel.findOne({ cart_userId: +userId }).lean()
  }
}
export default CartService
