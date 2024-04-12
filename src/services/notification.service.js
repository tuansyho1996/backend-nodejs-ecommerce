'use strict'

import notificationModel from "../models/notification.model.js"

class NotificationService {
  static async pushNotiToSystem({
    receivedId = 1,
    senderId,
    type,
    option = {}
  }) {
    let noti_content
    if (type === 'SHOP-001') {
      noti_content = '@@@ just released a new product @@@'
    }
    else if (type === 'PROMOTION-001') {
      noti_content = '@@@ just got a new voucher discount @@@@'
    }
    const newNoti = await notificationModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_option: option,
      noti_content
    })
    return newNoti
  }
  static async listNotiByUser({
    userId = 1,
    type = 'ALL',
    isRead = 0
  }) {
    const match = {
      noti_receivedId: userId,
    }
    if (type !== 'ALL') {
      match['noti_type'] = type
    }
    const noti = await notificationModel.aggregate([
      {
        $match: match
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receivedId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ['noti_option.shop_name', 0, -1]
              },
              'just released a new product',
              {
                $substr: ['noti_option.product_name', 0, -1]
              }
            ]
          },
          noti_option: 1,
          createAt: 1
        }
      }
    ])
    return noti
  }
}
export default NotificationService