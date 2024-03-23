'use strict'

import ProductService from "../services/product.service.js";
import { OK, CREATED } from "../core/success.response.js";

class ProductController {
  createProduct = async (req, res, next) => {
    return new CREATED({
      message: 'Create product success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.decodeUser.userId
      })
    }).send(res)
  }
  //GET QUERY
  // get all draft for shop
  findAllDraftForShop = async (req, res, next) => {
    return new OK({
      message: 'Get Draft product success',
      metadata: await ProductService.findAllDraftForShop(req.decodeUser.userId)
    }).send(res)
  }
  // get all publish for shop
  findAllPublishForShop = async (req, res, next) => {
    return new OK({
      message: 'Get publish product success',
      metadata: await ProductService.findAllPublishForShop(req.decodeUser.userId)
    }).send(res)
  }
  // publish one product
  publishProductByShop = async (req, res, next) => {
    return new OK({
      message: 'publish product success',
      metadata: await ProductService.publishProductByShop(req.decodeUser.userId, req.params.id)
    }).send(res)
  }
  // unpublish one product
  unPublishProductByShop = async (req, res, next) => {
    return new OK({
      message: 'unPublish product success',
      metadata: await ProductService.unPublishProductByShop(req.decodeUser.userId, req.params.id)
    }).send(res)
  }
  // find all product for shop
  findAllProducts = async (req, res, next) => {
    return new OK({
      message: 'Get all product success',
      metadata: await ProductService.findAllProducts({ product_shop: req.decodeUser.userId, sort: 'ctime', page: 1 })
    }).send(res)
  }
  //find one product
  findOneProduct = async (req, res, next) => {
    return new OK({
      message: 'Get one product success',
      metadata: await ProductService.findOneProduct(req.params.id)
    }).send(res)
  }
  // PATCH
  //update product by id
  updateProduct = async (req, res, next) => {
    return new OK({
      message: 'Update product success',
      metadata: await ProductService.updateProduct({ type: req.body.product_type, product_id: req.params.productId, payload: req.body })
    }).send(res)
  }
}

export default new ProductController()