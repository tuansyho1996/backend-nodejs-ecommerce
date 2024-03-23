'use strict'

import cartModel from "../cart.model.js"

const findCartById = async (id) => {
  return await cartModel.findById(id)
}
export {
  findCartById
}