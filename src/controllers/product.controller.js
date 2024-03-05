'use strict'

import ProductService from "../services/product.service.js";
import { OK, CREATED } from "../core/success.response.js";

class ProductController {
  createProduct = async (req, res, next) => {
    return new CREATED({
      message: 'Create product success',
      metadata: await ProductService.createProduct(req.body.product_type, req.body)
    }).send(res)
  }
}

export default new ProductController()