import { CREATED, OK } from "../core/success.response.js"
import { getAllShops, createNewShop, getShop, importManyShops, changeAvatar, editInformation } from "../services/shop.service.js"

class ShopController {
  getAllShops = async (req, res, next) => {
    return new OK({
      message: 'Get all shop success!',
      metadata: await getAllShops()
    }).send(res)
  }
  createNewShop = async (req, res, next) => {

    const { email, name, password } = req.body
    return new CREATED({
      message: 'Create new shop success!',
      metadata: await createNewShop({ email, name, password, logo: req.file })
    }).send(res)
  }
  getShop = async (req, res, next) => {
    return new OK({
      message: 'Get shop success!',
      metadata: await getShop(req.cookies.userId)
    }).send(res)
  }
  importManyShops = async (req, res, next) => {
    return new CREATED({
      message: 'Import success!',
      metadata: await importManyShops(req.body)
    }).send(res)
  }
  changeAvatar = async (req, res, next) => {
    return new OK({
      message: 'Changed avatar successfully!',
      metadata: await changeAvatar({ userId: req.body.userId, logo: req.file })
    }).send(res)
  }
  editInformation = async (req, res, next) => {
    return new OK({
      message: 'Changed infomation profile successfully',
      metadata: await editInformation(req.body)
    }).send(res)
  }
}

export default new ShopController