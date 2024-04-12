'use strict'

import { NotFoundError } from "../core/error.response.js"
import CommentModel from "../models/comment.model.js"
import { convertToObjectIdMongodb } from "../utils/index.js"
import { findProductById } from "../models/repositories/product.repo.js"



class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null
  }) {
    const comment = new CommentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })
    let rightValue
    if (parentCommentId) {
      //reply comment
      const parentComment = await CommentModel.findById(convertToObjectIdMongodb(parentCommentId))
      if (!parentComment) throw NotFoundError('Not found comment')
      rightValue = parentComment.comment_right
      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: parentComment.comment_right }
        },
        {
          $inc: { comment_right: 2 }
        }
      )
      await CommentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: parentComment.comment_right }
        },
        {
          $inc: { comment_left: 2 }
        }
      )
    }
    else {
      const maxRightValue = await CommentModel.findOne(
        { comment_productId: convertToObjectIdMongodb(productId) },
        'comment_right', { sort: { comment_right: -1 } }
      )
      if (maxRightValue) {
        rightValue = maxRightValue + 1
      }
      else {
        rightValue = 1
      }
    }
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1
    await comment.save()
    return comment
  }
  static async getCommentProduct({
    productId,
    parentCommentId = null
  }) {
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(convertToObjectIdMongodb(parentCommentId))
      if (!parentComment) throw NotFoundError('Not found comment')
      const comments = await CommentModel.find(
        {
          comment_productId: productId,
          comment_left: { $gt: parentComment.comment_left },
          comment_right: { $lt: parentComment.comment_right }
        }
      ).select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      }).sort({
        comment_left: 1
      })
      return comments
    }
    const comments = await CommentModel.find(
      {
        comment_productId: productId,
        comment_parentId: null
      }
    ).select({
      comment_left: 1,
      comment_right: 1,
      comment_content: 1,
      comment_parentId: 1,
    }).sort({
      comment_left: 1
    })
    return comments
  }
  static async deleteComment({
    commentId,
    productId,
  }) {
    const product = await findProductById(productId)
    if (!product) throw new NotFoundError('Not found product')
    const comment = await CommentModel.findById(convertToObjectIdMongodb(commentId))
    if (!comment) throw new NotFoundError('Not found comment')
    await CommentModel.deleteMany(
      {
        comment_productId: productId,
        comment_left: {
          $gte: comment.comment_left,
          $lte: comment.comment_right
        }
      }
    )
    const width = comment.comment_right - comment.comment_left + 1
    await CommentModel.updateMany(
      {
        comment_productId: productId,
        comment_right: { $gt: comment.comment_right }
      },
      {
        $inc: {
          comment_right: -width
        }
      }
    )
    await CommentModel.updateMany(
      {
        comment_productId: productId,
        comment_left: { $gt: comment.comment_right }
      },
      {
        $inc: {
          comment_left: -width
        }
      }
    )
    return true
  }
}
export default CommentService