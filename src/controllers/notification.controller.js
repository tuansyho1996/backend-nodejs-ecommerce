'use strict'
import { OK, CREATED } from "../core/success.response.js";
import NotificationService from "../services/notification.service.js";


class NotificationController {
  async listNotiByUser(req, res, next) {
    return new OK({
      message: 'Get list notification success',
      metadata: await NotificationService.listNotiByUser(req.query)
    }).send(res)
  }
}

export default new NotificationController()