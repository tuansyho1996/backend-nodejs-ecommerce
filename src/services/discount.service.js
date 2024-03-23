'use strict'
import { BadRequestError, NotFoundError } from "../core/error.response.js"
import discountModel from "../models/discount.model.js"
import { updateDiscount, findAllDiscountCodesSelect, findAllDiscountCodesUnselect, isDiscountExist } from "../models/repositories/discount.repo.js"
import { findAllProducts } from "../models/repositories/product.repo.js"
import { convertToObjectIdMongodb, removeUndefinedObject, } from "../utils/index.js"

class DiscountService {
  //create discount
  static createDiscount = async (payload) => {
    const { code, name, description, type, value, start_date, end_date, max_uses, is_active, max_value,
      max_uses_per_user, min_order_value, shopId, applies_to, product_ids
    } = payload

    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expried')
    }
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date')
    }
    const foundDiscount = await discountModel.findOne({ discount_code: code, discount_shopId: convertToObjectIdMongodb(shopId) }).lean()
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code exist already')
    }
    console.log('check date', new Date(start_date), typeof new Date(start_date))
    const newDiscount = await discountModel.create(
      {
        discount_code: code,
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_max_value: max_value,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_max_uses: max_uses,
        discount_is_active: is_active || true,
        discount_max_uses_per_user: max_uses_per_user,
        discount_min_order_value: min_order_value || 0,
        discount_shopId: shopId,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === 'all' ? [] : product_ids
      }
    )
    return newDiscount
  }
  // update discount codes
  static updateDiscount = async ({ discount_id, payload }) => {
    const foundDiscount = await discountModel.findOne({ _id: convertToObjectIdMongodb(discount_id) })
    if (!foundDiscount) {
      throw new BadRequestError('Discount not exist')
    }
    if (payload.discount_start_date && !payload.discount_end_date) {
      if (new Date() > new Date(payload.discount_start_date) || new Date() > new Date(foundDiscount.discount_end_date)) {
        throw new BadRequestError('Invalid Discount start date')
      }
      if (new Date(payload.discount_start_date) > new Date(foundDiscount.discount_end_date)) {
        throw new BadRequestError('Invalid Start date must be before end date')
      }
    }
    if (!payload.discount_start_date && payload.discount_end_date) {
      if (new Date() > new Date(foundDiscount.discount_start_date) || new Date() > new Date(payload.discount_end_date)) {
        throw new BadRequestError('Invalid Discount start date')
      }
      if (new Date(foundDiscount.discount_start_date) > new Date(payload.discount_end_date)) {
        throw new BadRequestError('Invalid Start date must be before end date')
      }
    }
    if (payload.discount_start_date && payload.discount_end_date) {
      if (new Date() > new Date(payload.discount_start_date) || new Date() > new Date(payload.discount_end_date)) {
        throw new BadRequestError('Invalid Discount start date')
      }
      if (new Date(payload.discount_start_date) > new Date(payload.discount_end_date)) {
        throw new BadRequestError('Invalid Start date must be before end date')
      }
    }

    const objectParams = removeUndefinedObject(payload)
    const filter = {
      _id: convertToObjectIdMongodb(discount_id),
      discount_is_active: true
    }
    return await updateDiscount(filter, objectParams)
  }
  // get all discount codes  
  static getAllDiscountCodes = async ({ shopId, code, sort = 'ctime', page, limit = 50 }) => {
    //get product by discount code
    const foundDiscountCode = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()
    if (!foundDiscountCode || foundDiscountCode.discount_is_active) {
      throw new BadRequestError('Discount code not exist or expried!')
    }
    const { discount_applies_to, discount_product_ids } = foundDiscountCode
    let products
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: { product_shop: shopId, isPushlished: true },
        sort,
        limit,
        page,
        select: ['product_name']
      })
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPushlished: true
        },
        sort,
        limit,
        page,
        select: ['product_name']
      })
    }
    return products
  }
  static getAllDiscountCodesByShopUnselect = async (payload) => {
    const { shopId, limit, page } = payload
    return await findAllDiscountCodesUnselect({
      filter: { discount_shopId: convertToObjectIdMongodb(shopId), discount_is_active: true },
      sort,
      limit: +limit,
      page: +page,
      unSelect: ['__v', 'discount_shopId'],
    })
  }
  static getAllDiscountCodesByShopSelect = async (payload) => {
    const { shopId } = payload
    return await findAllDiscountCodesSelect({
      filter: { discount_shopId: convertToObjectIdMongodb(shopId), discount_is_active: true },
      sort: 'ctime',
      select: ['discount_name', 'discount_code', 'discount_shopId', 'discount_description', 'discount_type', 'discount_value'],
    })
  }
  static getDiscountAmount = async (products, discount_code) => {
    const foundDiscount = await isDiscountExist(discount_code)

    if (!foundDiscount) throw new NotFoundError('Discount not found')
    if (foundDiscount.discount_is_active === false) throw new NotFoundError('Discount not active')
    if (new Date(foundDiscount.discount_end_date) < new Date()) throw NotFoundError('Discount expried ')
    let totalOrder = 0
    totalOrder = products.reduce((acc, product) => acc + (product.price * product.quantity), 0)
    if (totalOrder < foundDiscount.discount_min_order_value) throw new NotFoundError(`Discount not active with order under ${foundDiscount.discount_min_order_value}`)
    if (!foundDiscount.discount_max_uses) throw new NotFoundError(`Discount code has been used up`)
    // if(foundDiscount.discount_max_uses_per_user>0){
    //   const countUserUse = foundDiscount.discount_users_used.find(user=>user.userId===userId)
    //   if(!(countUserUse.lenght <foundDiscount.discount_max_uses_per_user)) throw new NotFoundError(`User has used maximum discount code `)
    // }
    const discountAmount = foundDiscount.discount_type === 'fixed_amount' ? foundDiscount.discount_value : totalOrder * (foundDiscount.discount_value / 100)
    const orderPrice = totalOrder - discountAmount
    console.log('discount amount', discountAmount)
    return {
      totalOrder,
      discountAmount,
      orderPrice
    }
  }
  static deleteDiscountAmount = async (userId, codeId) => {
    const deleteDiscount = await discountModel.findOneAndDelete(
      {
        discount_code: codeId,
        discount_shopId: userId
      }
    )
    return deleteDiscount
  }
  static cancelDiscount = async (codeId, shopId, userId) => {
    const foundDiscount = await discountModel.findOne({ _id: codeId, discount_shopId: shopId })
    if (!foundDiscount) throw NotFoundError('Discount not exist ')
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
    return result
  }
}
export default DiscountService