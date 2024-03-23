'use strict'

import { OK, CREATED } from "../core/success.response.js";
import CheckoutService from "../services/checkout.service.js";

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    return new OK({
      message: 'Checkout review success',
      metadata: await CheckoutService.checkoutReview(req.body)
    }).send(res)
  }
}


export default new CheckoutController()