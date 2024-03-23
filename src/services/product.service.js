import { product, clothing, electronic } from "../models/product.model.js"
import { BadRequestError, ConflictRequestError } from "../core/error.response.js"
import {
  findAllDraftForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop,
  findAllProducts, findOneProduct, updateProductById
} from "../models/repositories/product.repo.js"
import { removeUndefinedObject, updateNestedObjectParse } from "../utils/index.js"
import { createInventory } from "../models/repositories/inventory.repo.js"

class ProductFactory {
  static createProduct(type, payload) {
    switch (type) {
      case 'Electronic':
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
  static async findAllProducts({ sort, page }) {
    return await findAllProducts({
      filter: { isPublished: true }, sort, limit: 50, page,
      select: ['product_name', 'product_thumb', 'product_price']
    })
  }
  static async findOneProduct(id) {
    return await findOneProduct(id)
  }
  static async updateProduct({ type, product_id, payload }) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).updateProduct(product_id)
      case 'Electronic':
        return new Electronic(payload).updateProduct(product_id)
      default:
        throw new BadRequestError(`Invalid  product type ${type}`)
    }
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
    const new_product = await product.create({ ...this, _id })
    await createInventory(new_product._id, new_product.product_shop, new_product.product_quantity)
    return new_product
  }
  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({ id: product_id, bodyUpdate, model: product })
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
  async updateProduct(product_id) {
    const objectParams = this
    if (objectParams.product_attributes) {
      await updateProductById({ id: product_id, bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), model: clothing })
    }
    return await super.updateProduct(product_id, updateNestedObjectParse(objectParams))
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
  async updateProduct(product_id) {

    const objectParams = this

    if (objectParams.product_attributes) {

      await updateProductById({ id: product_id, bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), model: electronic })
    }
    return await super.updateProduct(product_id, updateNestedObjectParse(objectParams))
  }
}

export default ProductFactory
