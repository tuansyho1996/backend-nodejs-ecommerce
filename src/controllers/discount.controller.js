'use strict'

import DiscountService from "../services/discount.service.js";
import { OK, CREATED } from "../core/success.response.js";

class DiscountController {

  createDiscount = async (req, res, next) => {
    return new CREATED({
      message: 'Create discount success',
      metadata: await DiscountService.createDiscount({ ...req.body, shopId: req.decodeUser.userId })
    }).send(res)
  }
  updateDiscount = async (req, res, next) => {
    return new OK({
      message: 'Update discount success',
      metadata: await DiscountService.updateDiscount({ discount_id: req.params.discountId, payload: req.body })
    }).send(res)
  }
  getAllDiscountCodesByShopSelect = async (req, res, next) => {
    return new OK({
      message: 'Get discount codes success',
      metadata: await DiscountService.getAllDiscountCodesByShopSelect({ shopId: req.params.shopId })
    }).send(res)
  }
}


export default new DiscountController()