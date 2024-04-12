'use strict'

import { CREATED, OK } from "../core/success.response.js"
import CommentService from "../services/comment.service.js"

class CommentController {
  async createComment(req, res, next) {
    return new CREATED({
      message: 'Create comment success',
      metadata: await CommentService.createComment(req.body)
    }).send(res)
  }
  async getCommentProduct(req, res, next) {
    return new OK({
      message: 'Get comment of product success',
      metadata: await CommentService.getCommentProduct(req.query)
    }).send(res)
  }
  async deleteComment(req, res, next) {
    return new OK({
      message: 'Delete comment success',
      metadata: await CommentService.deleteComment(req.body)
    }).send(res)
  }
}
export default new CommentController