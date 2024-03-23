'use strict'

import { OK, CREATED } from "../core/success.response.js";
import CartService from "../services/cart.service.js";

class CartController {
  addToCart = async (req, res, next) => {
    return new OK({
      message: 'Add product to cart success',
      metadata: await CartService.addToCart({ userId: req.body.userId, product: req.body })
    }).send(res)
  }
  updateProductCart = async (req, res, next) => {
    return new OK({
      message: 'Update cart success',
      metadata: await CartService.updateProductCart({ userId: req.body.userId, shop_order_ids: req.body.shop_order_ids })
    }).send(res)
  }
  deleteProductCart = async (req, res, next) => {
    return new OK({
      message: 'Delete product to cart success',
      metadata: await CartService.deleteProductCart({ userId: req.body.userId, productId: req.body.productId })
    }).send(res)
  }
  getListProductCartByUserId = async (req, res, next) => {
    return new OK({
      message: 'Get list product cart from userId success',
      metadata: await CartService.getListProductCartByUserId(req.query.user_id)
    }).send(res)
  }
}


export default new CartController()