'use strict'

import { getSelectData, unGetSelectData } from "../../utils/index.js"
import discountModel from "../discount.model.js"

const findAllDiscountCodesSelect = async ({ filter, sort, select, page = 1, limit = 50 }) => {
  console.log('check discount repo', filter)
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const skip = (page - 1) * limit
  return await discountModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}


const findAllDiscountCodesUnselect = async (filter, sort, page = 1, limit = 50, unSelect) => {
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const skip = (page - 1) * limit
  return await discountModel.find({ filter })
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
}

const updateDiscount = async (filter, objectParams) => {
  return await discountModel.findOneAndUpdate(
    filter,
    objectParams,
    { new: true }
  )
}

const isDiscountExist = async (discount_code) => {
  return await discountModel.findOne({ discount_code }).lean()
}
export {
  findAllDiscountCodesUnselect,
  updateDiscount,
  findAllDiscountCodesSelect,
  isDiscountExist
}

