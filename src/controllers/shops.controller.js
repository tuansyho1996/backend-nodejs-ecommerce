import { CREATED, OK } from "../core/success.response.js"
import { getAllShops, createNewShop } from "../services/shop.service.js"

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
}

export default new ShopController