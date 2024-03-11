'use strict'
import { product, clothing, electronic } from "../models/product.model.js"
import { BadRequestError, ConflictRequestError } from "../core/error.response.js"
import {
  findAllDraftForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop,
  findAllProduct, findOneProduct
} from "../models/repositories/product.repo.js"

class ProductFactory {
  static createProduct(type, payload) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid  product type ${type}`)
    }
  }
  static async findAllDraftForShop(product_shop, limit = 50, skip = 0) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftForShop(query, limit, skip)
  }
  static async findAllPublishForShop(product_shop, limit = 50, skip = 0) {
    const query = { product_shop, isPublished: true }
    return await findAllPublishForShop(query, limit, skip)
  }
  static async publishProductByShop(product_shop, product_id) {
    return await publishProductByShop(product_shop, product_id)
  }
  static async unPublishProductByShop(product_shop, product_id) {
    return await unPublishProductByShop(product_shop, product_id)
  }
  static async findAllProduct({ sort, page }) {
    return await findAllProduct({
      filter: { isPublished: true }, sort, limit: 50, page,
      select: ['product_name', 'product_thumb', 'product_price']
    })
  }
  static async findOneProduct(id) {
    return await findOneProduct(id)
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_quantity, product_type, product_shop, product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }
  async createProduct(_id) {
    return await product.create({ ...this, _id })
  }
}
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop })

    if (!newClothing) {
      throw new BadRequestError('Create new clothing error')
    }
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) {
      throw new BadRequestError('Create new product error')
    }
    return newProduct
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop })
    if (!newElectronic) {
      throw new BadRequestError('Create new electronic error')
    }
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw new BadRequestError('Create new product error')
    }
    return newProduct
  }
}

export default ProductFactory
